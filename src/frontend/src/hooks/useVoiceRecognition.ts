import { useState, useEffect, useCallback } from 'react';
import { useGameState } from './useGameState';
import { toast } from 'sonner';

export function useVoiceRecognition() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    const gameState = useGameState();

    const isSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    useEffect(() => {
        if (!isSupported) return;

        const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognitionInstance: SpeechRecognition = new SpeechRecognitionConstructor();
        
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
            const current = event.resultIndex;
            const transcriptText = event.results[current][0].transcript.toLowerCase();
            setTranscript(transcriptText);
            processCommand(transcriptText);
        };

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            if (event.error !== 'no-speech') {
                toast.error('Voice recognition error. Please try again.');
            }
        };

        recognitionInstance.onend = () => {
            setIsListening(false);
        };

        setRecognition(recognitionInstance);

        return () => {
            if (recognitionInstance) {
                recognitionInstance.stop();
            }
        };
    }, [isSupported]);

    const processCommand = (command: string) => {
        // Add task
        if (command.includes('add task')) {
            const taskName = command.replace('add task', '').trim();
            if (taskName) {
                gameState.addDailyTask(taskName, 10);
                toast.success(`Task added: ${taskName}`);
            }
        }
        // Complete task
        else if (command.includes('complete task')) {
            const incompleteTasks = gameState.dailyTasks.filter(t => !t.completed);
            if (incompleteTasks.length > 0) {
                gameState.completeDailyTask(incompleteTasks[0].id);
            } else {
                toast.info('No tasks to complete');
            }
        }
        // Complete AI quest
        else if (command.includes('complete ai quest') || command.includes('complete generated quest')) {
            toast.info('AI quest completion via voice - navigate to the quest and use the complete button');
        }
        // Show AI quests
        else if (command.includes('show ai quests') || command.includes('list generated quests')) {
            toast.info('Showing AI-generated quests - check the Daily Quests tab');
        }
        // Add habit
        else if (command.includes('add habit')) {
            const habitName = command.replace('add habit', '').trim();
            if (habitName) {
                gameState.addHabit(habitName);
                toast.success(`Habit added: ${habitName}`);
            }
        }
        // Practice skill
        else if (command.includes('practice skill')) {
            if (gameState.skills.length > 0) {
                gameState.practiceSkill(gameState.skills[0].id);
            } else {
                toast.info('No skills to practice. Add a skill first!');
            }
        }
        // Add skill
        else if (command.includes('add skill')) {
            const skillName = command.replace('add skill', '').trim();
            if (skillName) {
                gameState.addSkill(skillName);
                toast.success(`Skill added: ${skillName}`);
            }
        }
        else {
            toast.info('Command not recognized. Try "add task", "complete task", "show ai quests", "add habit", or "practice skill"');
        }
    };

    const startListening = useCallback(() => {
        if (recognition && !isListening) {
            setTranscript('');
            recognition.start();
            setIsListening(true);
        }
    }, [recognition, isListening]);

    const stopListening = useCallback(() => {
        if (recognition && isListening) {
            recognition.stop();
            setIsListening(false);
        }
    }, [recognition, isListening]);

    return {
        isListening,
        transcript,
        startListening,
        stopListening,
        isSupported,
    };
}
