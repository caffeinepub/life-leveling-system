export interface Character {
    name: string;
    level: number;
    currentXP: number;
    totalXP: number;
    xpToNextLevel: number;
    strength: number;
    intelligence: number;
    discipline: number;
    agility: number;
}

export interface DailyTask {
    id: string;
    name: string;
    xpReward: number;
    completed: boolean;
}

export interface Habit {
    id: string;
    name: string;
    streak: number;
    lastCompleted: string;
}

export interface Skill {
    id: string;
    name: string;
    level: number;
    practiceCount: number;
    practiceToNextLevel: number;
}

export interface Goal {
    id: string;
    name: string;
    targetValue: number;
    currentProgress: number;
}

export interface Quest {
    id: string;
    name: string;
    description: string;
    requiredLevel: number;
    xpReward: number;
    goldReward: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    completed: boolean;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    xpReward: number;
    unlocked: boolean;
    unlockedDate?: string;
}
