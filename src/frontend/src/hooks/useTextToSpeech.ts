import { useCallback } from 'react';

export function useTextToSpeech() {
    const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    const speak = useCallback((text: string, options?: { priority?: 'high' | 'normal' }) => {
        if (!isSupported) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = options?.priority === 'high' ? 1.1 : 1.0;
        utterance.volume = 0.8;

        window.speechSynthesis.speak(utterance);
    }, [isSupported]);

    const speakAIQuestCompletion = useCallback((questDescription: string, xpReward: number) => {
        if (!isSupported) return;

        const text = `AI Quest completed: ${questDescription}. You earned ${xpReward} experience points. Great work!`;
        speak(text, { priority: 'high' });
    }, [isSupported, speak]);

    const speakDifficultyIncrease = useCallback((newTier: string) => {
        if (!isSupported) return;

        const text = `Your fitness level has increased to ${newTier}. Next quests will be more challenging. Keep pushing forward!`;
        speak(text, { priority: 'high' });
    }, [isSupported, speak]);

    const speakAIQuests = useCallback((quests: string[]) => {
        if (!isSupported) return;

        const text = `You have ${quests.length} AI-generated quests today: ${quests.join(', ')}`;
        speak(text);
    }, [isSupported, speak]);

    const cancel = useCallback(() => {
        if (isSupported) {
            window.speechSynthesis.cancel();
        }
    }, [isSupported]);

    return {
        speak,
        speakAIQuestCompletion,
        speakDifficultyIncrease,
        speakAIQuests,
        cancel,
        isSupported,
    };
}
