import { useEffect, useState } from 'react';
import { useGetQuestLog } from './useQueries';

export function useQuestGeneration(userId: string, profileComplete: boolean) {
  const { data: questLog, refetch } = useGetQuestLog(userId);
  const [needsGeneration, setNeedsGeneration] = useState(false);

  useEffect(() => {
    if (!profileComplete || !questLog) {
      setNeedsGeneration(false);
      return;
    }

    // Check if we need to generate new quests
    const now = Date.now();
    const lastGenerated = Number(questLog.lastGenerated);
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    // If last generation was more than 24 hours ago, we need new quests
    const shouldGenerate = (now - lastGenerated) > oneDayMs || questLog.dailyQuests.length === 0;
    setNeedsGeneration(shouldGenerate);
  }, [questLog, profileComplete]);

  const checkForNewQuests = async () => {
    await refetch();
  };

  return {
    needsGeneration,
    questLog,
    checkForNewQuests,
  };
}
