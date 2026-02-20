import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Scroll, Star, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { useGetQuestLog } from '@/hooks/useQueries';
import { useCompleteExercise, useCompleteNutrition, useCompleteMindfulness, useCompleteHydration, useCompleteSleep } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { TaskType } from '@/backend';

interface DailyQuestsProps {
  userId?: string;
}

export default function DailyQuests({ userId = 'default-user' }: DailyQuestsProps) {
    const { character, dailyQuests, completeQuest } = useGameState();
    const { speak } = useTextToSpeech();
    
    // Backend integration
    const { data: questLog } = useGetQuestLog(userId);
    const completeExerciseMutation = useCompleteExercise();
    const completeNutritionMutation = useCompleteNutrition();
    const completeMindfulnessMutation = useCompleteMindfulness();
    const completeHydrationMutation = useCompleteHydration();
    const completeSleepMutation = useCompleteSleep();

    const handleCompleteQuest = (questId: string) => {
        const quest = dailyQuests.find((q) => q.id === questId);
        if (quest && !quest.completed) {
            completeQuest(questId);
            speak(`Quest completed! You earned ${quest.xpReward} XP and ${quest.goldReward} gold`);
            toast.success(`Quest completed! +${quest.xpReward} XP, +${quest.goldReward} gold`);
        }
    };

    const handleCompleteAIQuest = async (taskId: bigint, taskType: TaskType) => {
        try {
            let success = false;
            const timestamp = BigInt(Date.now());

            switch (taskType) {
                case TaskType.exercise:
                    success = await completeExerciseMutation.mutateAsync({ exerciseId: taskId, repetitions: BigInt(1) });
                    break;
                case TaskType.nutrition:
                    success = await completeNutritionMutation.mutateAsync({ taskId, timestamp });
                    break;
                case TaskType.mindfulness:
                    success = await completeMindfulnessMutation.mutateAsync({ taskId, timestamp });
                    break;
                case TaskType.hydration:
                    success = await completeHydrationMutation.mutateAsync({ taskId, timestamp });
                    break;
                case TaskType.sleep:
                    success = await completeSleepMutation.mutateAsync({ taskId, timestamp });
                    break;
            }

            if (success) {
                speak('AI Quest completed! Your progress has been recorded.');
                toast.success('AI Quest completed! Keep up the great work!');
            }
        } catch (error) {
            console.error('Failed to complete AI quest:', error);
            toast.error('Failed to complete quest. Please try again.');
        }
    };

    const completedCount = dailyQuests.filter((q) => q.completed).length;
    const progressPercent = dailyQuests.length > 0 ? (completedCount / dailyQuests.length) * 100 : 0;

    // Combine local quests with AI-generated quests from backend
    const aiQuests = questLog?.dailyQuests || [];

    return (
        <div className="space-y-6">
            {/* Quest Progress Overview */}
            <Card className="bg-gradient-to-br from-card via-card to-chart-1/5 border-chart-1/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Scroll className="w-5 h-5 text-chart-1" />
                        Daily Quest Progress
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            {completedCount} / {dailyQuests.length} quests completed
                        </span>
                        <span className="text-chart-1 font-semibold">{Math.round(progressPercent)}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-3 bg-muted/50" />
                </CardContent>
            </Card>

            {/* AI-Generated Quests */}
            {aiQuests.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-chart-1" />
                        <h3 className="text-lg font-semibold">AI-Generated Quests</h3>
                        <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/30">
                            Personalized
                        </Badge>
                    </div>

                    <div className="grid gap-4">
                        {aiQuests.map((task) => (
                            <Card
                                key={Number(task.id)}
                                className="bg-card/50 border-chart-1/20 hover:border-chart-1/40 transition-all"
                            >
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-chart-1/10">
                                            <Sparkles className="w-6 h-6 text-chart-1" />
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-lg">{task.description}</h3>
                                                        <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/30 text-xs">
                                                            AI
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Duration: {Number(task.duration)} min • Difficulty: {Number(task.difficulty)}/10
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 flex-wrap">
                                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                                    <Star className="w-3 h-3 mr-1" />
                                                    {Number(task.rewardPoints)} XP
                                                </Badge>
                                                <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/30">
                                                    {task.taskType}
                                                </Badge>
                                            </div>

                                            <Button
                                                onClick={() => handleCompleteAIQuest(task.id, task.taskType)}
                                                className="mt-3 bg-chart-1 hover:bg-chart-1/90"
                                                disabled={completeExerciseMutation.isPending || completeNutritionMutation.isPending}
                                            >
                                                {completeExerciseMutation.isPending || completeNutritionMutation.isPending ? 'Completing...' : 'Complete Quest'}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Regular Quest List */}
            <div className="grid gap-4">
                {dailyQuests.map((quest) => {
                    const isLocked = quest.requiredLevel > character.level;
                    const isCompleted = quest.completed;

                    return (
                        <Card
                            key={quest.id}
                            className={`transition-all ${
                                isCompleted
                                    ? 'bg-chart-2/10 border-chart-2/30 opacity-75'
                                    : isLocked
                                      ? 'bg-muted/20 border-muted/30 opacity-60'
                                      : 'bg-card/50 border-chart-1/20 hover:border-chart-1/40'
                            }`}
                        >
                            <CardContent className="p-5">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`p-3 rounded-lg ${
                                            isCompleted
                                                ? 'bg-chart-2/20'
                                                : isLocked
                                                  ? 'bg-muted/30'
                                                  : 'bg-chart-1/10'
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-6 h-6 text-chart-2" />
                                        ) : isLocked ? (
                                            <Lock className="w-6 h-6 text-muted-foreground" />
                                        ) : (
                                            <Scroll className="w-6 h-6 text-chart-1" />
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-semibold text-lg">{quest.name}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>
                                            </div>
                                            {isLocked && (
                                                <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
                                                    Level {quest.requiredLevel} Required
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 flex-wrap">
                                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                                <Star className="w-3 h-3 mr-1" />
                                                {quest.xpReward} XP
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
                                            >
                                                💰 {quest.goldReward} Gold
                                            </Badge>
                                            <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/30">
                                                {quest.difficulty}
                                            </Badge>
                                        </div>

                                        {!isLocked && !isCompleted && (
                                            <Button
                                                onClick={() => handleCompleteQuest(quest.id)}
                                                className="mt-3 bg-chart-1 hover:bg-chart-1/90"
                                            >
                                                Complete Quest
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
