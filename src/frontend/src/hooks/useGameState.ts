import { useState, useEffect } from 'react';
import type { Character, DailyTask, Habit, Skill, Goal, Quest, Achievement } from '@/types/game';
import { useTextToSpeech } from './useTextToSpeech';

const STORAGE_KEY = 'life-leveling-system';

const initialCharacter: Character = {
    name: 'Hunter',
    level: 1,
    currentXP: 0,
    totalXP: 0,
    xpToNextLevel: 100,
    strength: 10,
    intelligence: 10,
    discipline: 10,
    agility: 10,
};

const initialQuests: Quest[] = [
    {
        id: 'q1',
        name: 'First Steps',
        description: 'Complete your first daily task',
        requiredLevel: 1,
        xpReward: 50,
        goldReward: 10,
        difficulty: 'Easy',
        completed: false,
    },
    {
        id: 'q2',
        name: 'Building Momentum',
        description: 'Complete 5 tasks in a single day',
        requiredLevel: 2,
        xpReward: 100,
        goldReward: 25,
        difficulty: 'Medium',
        completed: false,
    },
    {
        id: 'q3',
        name: 'Skill Master',
        description: 'Practice any skill 10 times',
        requiredLevel: 3,
        xpReward: 150,
        goldReward: 50,
        difficulty: 'Medium',
        completed: false,
    },
    {
        id: 'q4',
        name: 'Habit Warrior',
        description: 'Maintain a 7-day streak on any habit',
        requiredLevel: 5,
        xpReward: 250,
        goldReward: 100,
        difficulty: 'Hard',
        completed: false,
    },
];

const initialAchievements: Achievement[] = [
    {
        id: 'a1',
        name: 'First Blood',
        description: 'Complete your first task',
        xpReward: 25,
        unlocked: false,
    },
    {
        id: 'a2',
        name: 'Level Up!',
        description: 'Reach level 5',
        xpReward: 100,
        unlocked: false,
    },
    {
        id: 'a3',
        name: 'Streak Master',
        description: 'Maintain a 30-day habit streak',
        xpReward: 500,
        unlocked: false,
    },
    {
        id: 'a4',
        name: 'Goal Crusher',
        description: 'Complete 10 goals',
        xpReward: 300,
        unlocked: false,
    },
    {
        id: 'a5',
        name: 'Skill Prodigy',
        description: 'Reach level 10 in any skill',
        xpReward: 400,
        unlocked: false,
    },
    {
        id: 'a6',
        name: 'Legendary Hunter',
        description: 'Reach level 20',
        xpReward: 1000,
        unlocked: false,
    },
];

export function useGameState() {
    const { speak } = useTextToSpeech();
    const [character, setCharacter] = useState<Character>(initialCharacter);
    const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [dailyQuests, setDailyQuests] = useState<Quest[]>(initialQuests);
    const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setCharacter(data.character || initialCharacter);
                setDailyTasks(data.dailyTasks || []);
                setHabits(data.habits || []);
                setSkills(data.skills || []);
                setGoals(data.goals || []);
                setDailyQuests(data.dailyQuests || initialQuests);
                setAchievements(data.achievements || initialAchievements);
            } catch (e) {
                console.error('Failed to load game state:', e);
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        const data = {
            character,
            dailyTasks,
            habits,
            skills,
            goals,
            dailyQuests,
            achievements,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [character, dailyTasks, habits, skills, goals, dailyQuests, achievements]);

    const gainXP = (amount: number) => {
        setCharacter((prev) => {
            let newXP = prev.currentXP + amount;
            let newLevel = prev.level;
            let newXPToNext = prev.xpToNextLevel;
            let newTotalXP = prev.totalXP + amount;

            // Level up logic
            while (newXP >= newXPToNext) {
                newXP -= newXPToNext;
                newLevel++;
                newXPToNext = Math.floor(100 * Math.pow(1.5, newLevel - 1));
                speak(`Level up! You are now level ${newLevel}`);
                
                // Check level achievements
                if (newLevel === 5) unlockAchievement('a2');
                if (newLevel === 20) unlockAchievement('a6');
            }

            // Stat increases on level up
            const statIncrease = newLevel - prev.level;
            return {
                ...prev,
                level: newLevel,
                currentXP: newXP,
                totalXP: newTotalXP,
                xpToNextLevel: newXPToNext,
                strength: prev.strength + statIncrease * 2,
                intelligence: prev.intelligence + statIncrease * 2,
                discipline: prev.discipline + statIncrease * 2,
                agility: prev.agility + statIncrease * 2,
            };
        });
    };

    const unlockAchievement = (achievementId: string) => {
        setAchievements((prev) =>
            prev.map((a) => {
                if (a.id === achievementId && !a.unlocked) {
                    speak(`Achievement unlocked: ${a.name}`);
                    gainXP(a.xpReward);
                    return { ...a, unlocked: true, unlockedDate: new Date().toISOString() };
                }
                return a;
            })
        );
    };

    // Daily Tasks
    const addDailyTask = (name: string, xpReward: number) => {
        const newTask: DailyTask = {
            id: Date.now().toString(),
            name,
            xpReward,
            completed: false,
        };
        setDailyTasks((prev) => [...prev, newTask]);
    };

    const completeDailyTask = (taskId: string) => {
        const task = dailyTasks.find((t) => t.id === taskId);
        if (task && !task.completed) {
            setDailyTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t)));
            gainXP(task.xpReward);
            
            // Check achievements
            if (dailyTasks.filter(t => !t.completed).length === dailyTasks.length) {
                unlockAchievement('a1');
            }
        }
    };

    const deleteDailyTask = (taskId: string) => {
        setDailyTasks((prev) => prev.filter((t) => t.id !== taskId));
    };

    // Habits
    const addHabit = (name: string) => {
        const newHabit: Habit = {
            id: Date.now().toString(),
            name,
            streak: 0,
            lastCompleted: new Date().toISOString(),
        };
        setHabits((prev) => [...prev, newHabit]);
    };

    const completeHabit = (habitId: string) => {
        setHabits((prev) =>
            prev.map((h) => {
                if (h.id === habitId) {
                    const newStreak = h.streak + 1;
                    gainXP(5);
                    
                    // Check streak achievements
                    if (newStreak === 30) unlockAchievement('a3');
                    
                    return { ...h, streak: newStreak, lastCompleted: new Date().toISOString() };
                }
                return h;
            })
        );
    };

    const deleteHabit = (habitId: string) => {
        setHabits((prev) => prev.filter((h) => h.id !== habitId));
    };

    // Skills
    const addSkill = (name: string) => {
        const newSkill: Skill = {
            id: Date.now().toString(),
            name,
            level: 1,
            practiceCount: 0,
            practiceToNextLevel: 10,
        };
        setSkills((prev) => [...prev, newSkill]);
    };

    const practiceSkill = (skillId: string) => {
        let result = { leveledUp: false, newLevel: 1, progress: 0 };
        
        setSkills((prev) =>
            prev.map((s) => {
                if (s.id === skillId) {
                    const newPracticeCount = s.practiceCount + 1;
                    let newLevel = s.level;
                    let newPracticeToNext = s.practiceToNextLevel;
                    let leveledUp = false;

                    if (newPracticeCount >= s.practiceToNextLevel) {
                        newLevel++;
                        newPracticeToNext = Math.floor(10 * Math.pow(1.3, newLevel - 1));
                        leveledUp = true;
                        gainXP(20);
                        
                        // Check skill level achievements
                        if (newLevel === 10) unlockAchievement('a5');
                    } else {
                        gainXP(8);
                    }

                    result = {
                        leveledUp,
                        newLevel,
                        progress: Math.round((newPracticeCount / newPracticeToNext) * 100),
                    };

                    return {
                        ...s,
                        level: newLevel,
                        practiceCount: leveledUp ? 0 : newPracticeCount,
                        practiceToNextLevel: newPracticeToNext,
                    };
                }
                return s;
            })
        );
        
        return result;
    };

    const deleteSkill = (skillId: string) => {
        setSkills((prev) => prev.filter((s) => s.id !== skillId));
    };

    // Goals
    const addGoal = (name: string, targetValue: number) => {
        const newGoal: Goal = {
            id: Date.now().toString(),
            name,
            targetValue,
            currentProgress: 0,
        };
        setGoals((prev) => [...prev, newGoal]);
    };

    const updateGoalProgress = (goalId: string, increment: number) => {
        let result = { completed: false, progress: 0 };
        
        setGoals((prev) =>
            prev.map((g) => {
                if (g.id === goalId) {
                    const newProgress = Math.min(g.currentProgress + increment, g.targetValue);
                    const wasCompleted = g.currentProgress >= g.targetValue;
                    const isNowCompleted = newProgress >= g.targetValue;

                    if (isNowCompleted && !wasCompleted) {
                        gainXP(50);
                        result.completed = true;
                        
                        // Check goal achievements
                        const completedGoals = goals.filter(goal => goal.currentProgress >= goal.targetValue).length;
                        if (completedGoals + 1 >= 10) unlockAchievement('a4');
                    }

                    result.progress = Math.round((newProgress / g.targetValue) * 100);
                    return { ...g, currentProgress: newProgress };
                }
                return g;
            })
        );
        
        return result;
    };

    const deleteGoal = (goalId: string) => {
        setGoals((prev) => prev.filter((g) => g.id !== goalId));
    };

    // Quests
    const completeQuest = (questId: string) => {
        const quest = dailyQuests.find((q) => q.id === questId);
        if (quest && !quest.completed) {
            setDailyQuests((prev) => prev.map((q) => (q.id === questId ? { ...q, completed: true } : q)));
            gainXP(quest.xpReward);
        }
    };

    return {
        character,
        dailyTasks,
        habits,
        skills,
        goals,
        dailyQuests,
        achievements,
        addDailyTask,
        completeDailyTask,
        deleteDailyTask,
        addHabit,
        completeHabit,
        deleteHabit,
        addSkill,
        practiceSkill,
        deleteSkill,
        addGoal,
        updateGoalProgress,
        deleteGoal,
        completeQuest,
    };
}
