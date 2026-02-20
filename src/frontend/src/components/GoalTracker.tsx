import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, Trash2, CheckCircle2 } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { toast } from 'sonner';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

export default function GoalTracker() {
    const { goals, addGoal, updateGoalProgress, deleteGoal } = useGameState();
    const { speak } = useTextToSpeech();
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState('100');

    const handleAddGoal = () => {
        if (!newGoalName.trim()) return;

        const target = parseInt(newGoalTarget) || 100;
        addGoal(newGoalName, target);
        speak(`Goal added: ${newGoalName}`);
        toast.success(`Goal added: ${newGoalName}`);
        setNewGoalName('');
        setNewGoalTarget('100');
    };

    const handleUpdateProgress = (goalId: string, increment: number) => {
        const goal = goals.find((g) => g.id === goalId);
        if (goal) {
            const result = updateGoalProgress(goalId, increment);
            if (result.completed) {
                speak(`Goal completed! ${goal.name} achieved!`);
                toast.success(`🎉 Goal completed: ${goal.name}! +50 XP`);
            } else {
                speak(`Progress updated: ${result.progress}%`);
                toast.success(`Progress updated! +${increment} units`);
            }
        }
    };

    const handleDeleteGoal = (goalId: string) => {
        deleteGoal(goalId);
        speak('Goal deleted');
        toast.info('Goal deleted');
    };

    return (
        <div className="space-y-6">
            {/* Add Goal Form */}
            <Card className="bg-card/50 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Plus className="w-5 h-5 text-primary" />
                        Add New Goal
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            placeholder="Goal name..."
                            value={newGoalName}
                            onChange={(e) => setNewGoalName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                            className="flex-1"
                        />
                        <Input
                            type="number"
                            placeholder="Target"
                            value={newGoalTarget}
                            onChange={(e) => setNewGoalTarget(e.target.value)}
                            className="w-32"
                            min="1"
                        />
                        <Button onClick={handleAddGoal} className="bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Goal
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Goal List */}
            <div className="grid gap-3">
                {goals.length === 0 ? (
                    <Card className="bg-muted/30">
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">No goals yet. Set your first goal above!</p>
                        </CardContent>
                    </Card>
                ) : (
                    goals.map((goal) => {
                        const progressPercent = (goal.currentProgress / goal.targetValue) * 100;
                        const isCompleted = goal.currentProgress >= goal.targetValue;

                        return (
                            <Card
                                key={goal.id}
                                className={`transition-all ${
                                    isCompleted
                                        ? 'bg-chart-2/10 border-chart-2/30'
                                        : 'bg-card/50 border-primary/20 hover:border-primary/40'
                                }`}
                            >
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4">
                                            <Target className={`w-5 h-5 ${isCompleted ? 'text-chart-2' : 'text-primary'}`} />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium">{goal.name}</p>
                                                    {isCompleted && (
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-chart-2/10 text-chart-2 border-chart-2/30"
                                                        >
                                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                                            Completed
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {goal.currentProgress} / {goal.targetValue} units
                                                </p>
                                            </div>
                                            {!isCompleted && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleUpdateProgress(goal.id, 1)}
                                                        className="bg-primary/10 border-primary/30 hover:bg-primary/20"
                                                    >
                                                        +1
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleUpdateProgress(goal.id, 5)}
                                                        className="bg-primary/10 border-primary/30 hover:bg-primary/20"
                                                    >
                                                        +5
                                                    </Button>
                                                </>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteGoal(goal.id)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <Progress value={Math.min(progressPercent, 100)} className="h-2 bg-muted/50" />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
