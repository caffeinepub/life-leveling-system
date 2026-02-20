import { useMemo } from 'react';
import type { QuestLog } from '@/backend';

export function useDifficultyProgression(questLog: QuestLog | null) {
  const metrics = useMemo(() => {
    if (!questLog) {
      return {
        currentTier: 'Beginner',
        completionRate: 0,
        streak: 0,
        progressToNextTier: 0,
      };
    }

    const totalCompleted = questLog.completedQuests.length;
    const totalFailed = questLog.failedQuests.length;
    const totalAttempted = totalCompleted + totalFailed;
    
    const completionRate = totalAttempted > 0 
      ? Math.round((totalCompleted / totalAttempted) * 100) 
      : 0;

    // Calculate difficulty tier based on completion count
    let currentTier = 'Beginner';
    let progressToNextTier = 0;
    
    if (totalCompleted < 10) {
      currentTier = 'Beginner';
      progressToNextTier = (totalCompleted / 10) * 100;
    } else if (totalCompleted < 30) {
      currentTier = 'Intermediate';
      progressToNextTier = ((totalCompleted - 10) / 20) * 100;
    } else if (totalCompleted < 60) {
      currentTier = 'Advanced';
      progressToNextTier = ((totalCompleted - 30) / 30) * 100;
    } else {
      currentTier = 'Expert';
      progressToNextTier = 100;
    }

    // Calculate current streak (simplified - would need timestamps in real implementation)
    const streak = Math.min(totalCompleted, 30);

    return {
      currentTier,
      completionRate,
      streak,
      progressToNextTier: Math.round(progressToNextTier),
    };
  }, [questLog]);

  return metrics;
}
