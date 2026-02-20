import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Flame, Check, Trash2 } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { toast } from 'sonner';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

export default function HabitTracker() {
    const { habits, addHabit, completeHabit, deleteHabit } = useGameState();
    const { speak } = useTextToSpeech();
    const [newHabitName, setNewHabitName] = useState('');

    const handleAddHabit = () => {
        if (!newHabitName.trim()) return;

        addHabit(newHabitName);
        speak(`Habit added: ${newHabitName}`);
        toast.success(`Habit added: ${newHabitName}`);
        setNewHabitName('');
    };

    const handleCompleteHabit = (habitId: string) => {
        const habit = habits.find((h) => h.id === habitId);
        if (habit) {
            completeHabit(habitId);
            speak(`Habit completed! Current streak: ${habit.streak + 1} days`);
            toast.success(`Streak: ${habit.streak + 1} days! +5 XP`);
        }
    };

    const handleDeleteHabit = (habitId: string) => {
        deleteHabit(habitId);
        speak('Habit deleted');
        toast.info('Habit deleted');
    };

    return (
        <div className="space-y-6">
            {/* Add Habit Form */}
            <Card className="bg-card/50 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Plus className="w-5 h-5 text-primary" />
                        Add New Habit
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <Input
                            placeholder="Habit name..."
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
                            className="flex-1"
                        />
                        <Button onClick={handleAddHabit} className="bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Habit
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Habit List */}
            <div className="grid gap-3">
                {habits.length === 0 ? (
                    <Card className="bg-muted/30">
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">No habits yet. Start building good habits today!</p>
                        </CardContent>
                    </Card>
                ) : (
                    habits.map((habit) => (
                        <Card key={habit.id} className="bg-card/50 border-primary/20 hover:border-primary/40 transition-all">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleCompleteHabit(habit.id)}
                                        className="bg-primary/10 border-primary/30 hover:bg-primary/20"
                                    >
                                        <Check className="w-4 h-4 text-primary" />
                                    </Button>
                                    <div className="flex-1">
                                        <p className="font-medium">{habit.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Last completed: {new Date(habit.lastCompleted).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`${
                                            habit.streak > 0
                                                ? 'bg-orange-500/10 text-orange-500 border-orange-500/30'
                                                : 'bg-muted/50 text-muted-foreground'
                                        }`}
                                    >
                                        <Flame className="w-3 h-3 mr-1" />
                                        {habit.streak} day streak
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteHabit(habit.id)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
