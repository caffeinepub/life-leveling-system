import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, Heart, Brain, Dumbbell, Target, TrendingUp } from 'lucide-react';
import type { Character } from '@/types/game';

interface CharacterStatsProps {
    character: Character;
}

export default function CharacterStats({ character }: CharacterStatsProps) {
    const xpPercentage = (character.currentXP / character.xpToNextLevel) * 100;

    const stats = [
        { name: 'Strength', value: character.strength, icon: Dumbbell, color: 'text-red-500' },
        { name: 'Intelligence', value: character.intelligence, icon: Brain, color: 'text-blue-500' },
        { name: 'Discipline', value: character.discipline, icon: Target, color: 'text-purple-500' },
        { name: 'Agility', value: character.agility, icon: Zap, color: 'text-yellow-500' },
    ];

    return (
        <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 shadow-lg shadow-primary/5">
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Level & XP */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center shadow-lg shadow-primary/30">
                                    <span className="text-3xl font-bold text-primary-foreground">{character.level}</span>
                                </div>
                                {character.level > 1 && (
                                    <div className="absolute -top-1 -right-1">
                                        <img
                                            src="/assets/generated/level-up-badge.dim_256x256.png"
                                            alt="Level Badge"
                                            className="w-8 h-8 animate-pulse"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-2xl font-bold">{character.name}</h2>
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                        Level {character.level}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {character.currentXP} / {character.xpToNextLevel} XP
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress to Level {character.level + 1}</span>
                                <span className="text-primary font-semibold">{Math.round(xpPercentage)}%</span>
                            </div>
                            <Progress value={xpPercentage} className="h-3 bg-muted/50" />
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-chart-2" />
                            <span className="text-muted-foreground">Total XP Earned:</span>
                            <span className="font-semibold text-chart-2">{character.totalXP}</span>
                        </div>
                    </div>

                    {/* Right: Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.name}
                                className="bg-accent/30 rounded-lg p-4 border border-border/50 hover:border-primary/30 transition-all"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    <span className="text-sm font-medium text-muted-foreground">{stat.name}</span>
                                </div>
                                <div className="text-3xl font-bold">{stat.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
