import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock, Star } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';

export default function AchievementPanel() {
    const { achievements } = useGameState();

    const unlockedCount = achievements.filter((a) => a.unlocked).length;

    return (
        <div className="space-y-6">
            {/* Achievement Overview */}
            <Card className="bg-gradient-to-br from-card via-card to-yellow-500/5 border-yellow-500/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Achievement Progress
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-yellow-500">{unlockedCount}</div>
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">
                                {unlockedCount} of {achievements.length} achievements unlocked
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {Math.round((unlockedCount / achievements.length) * 100)}% completion
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Achievement Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                    <Card
                        key={achievement.id}
                        className={`transition-all ${
                            achievement.unlocked
                                ? 'bg-gradient-to-br from-card to-yellow-500/10 border-yellow-500/30'
                                : 'bg-muted/20 border-muted/30 opacity-60'
                        }`}
                    >
                        <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                                <div
                                    className={`p-3 rounded-lg ${
                                        achievement.unlocked ? 'bg-yellow-500/20' : 'bg-muted/30'
                                    }`}
                                >
                                    {achievement.unlocked ? (
                                        <img
                                            src="/assets/generated/achievement-trophy.dim_128x128.png"
                                            alt="Achievement"
                                            className="w-12 h-12"
                                        />
                                    ) : (
                                        <Lock className="w-12 h-12 text-muted-foreground" />
                                    )}
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div>
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            {achievement.name}
                                            {achievement.unlocked && (
                                                <Badge
                                                    variant="outline"
                                                    className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
                                                >
                                                    Unlocked
                                                </Badge>
                                            )}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                                    </div>

                                    {achievement.unlocked && achievement.unlockedDate && (
                                        <p className="text-xs text-muted-foreground">
                                            Unlocked on {new Date(achievement.unlockedDate).toLocaleDateString()}
                                        </p>
                                    )}

                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                        <Star className="w-3 h-3 mr-1" />
                                        {achievement.xpReward} XP
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
