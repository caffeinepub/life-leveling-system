import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Target, Flame } from 'lucide-react';
import { useDifficultyProgression } from '@/hooks/useDifficultyProgression';
import type { QuestLog } from '@/backend';

interface AIPersonalizationPanelProps {
  questLog: QuestLog | null;
}

export default function AIPersonalizationPanel({ questLog }: AIPersonalizationPanelProps) {
  const { currentTier, completionRate, streak, progressToNextTier } = useDifficultyProgression(questLog);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Beginner':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'Intermediate':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'Advanced':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
      case 'Expert':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/30';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card via-card to-chart-1/5 border-chart-1/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-chart-1" />
          AI Personalization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Difficulty Tier */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Difficulty Tier:</span>
          </div>
          <Badge variant="outline" className={getTierColor(currentTier)}>
            {currentTier}
          </Badge>
        </div>

        {/* Progress to Next Tier */}
        {currentTier !== 'Expert' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress to Next Tier</span>
              <span className="text-chart-1 font-semibold">{progressToNextTier}%</span>
            </div>
            <Progress value={progressToNextTier} className="h-2 bg-muted/50" />
          </div>
        )}

        {/* Completion Rate */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Completion Rate:</span>
          </div>
          <span className="text-sm font-semibold text-chart-2">{completionRate}%</span>
        </div>

        {/* Current Streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-muted-foreground">Current Streak:</span>
          </div>
          <span className="text-sm font-semibold text-orange-500">{streak} days</span>
        </div>

        {/* AI Quest Stats */}
        {questLog && (
          <div className="pt-3 border-t border-border/50">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 rounded-lg bg-chart-2/10">
                <div className="text-2xl font-bold text-chart-2">{questLog.completedQuests.length}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="p-2 rounded-lg bg-chart-1/10">
                <div className="text-2xl font-bold text-chart-1">{questLog.dailyQuests.length}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
