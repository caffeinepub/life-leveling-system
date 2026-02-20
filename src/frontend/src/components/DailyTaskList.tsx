import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Star } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { toast } from 'sonner';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

export default function DailyTaskList() {
    const { dailyTasks, addDailyTask, completeDailyTask, deleteDailyTask } = useGameState();
    const { speak } = useTextToSpeech();
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskXP, setNewTaskXP] = useState('10');

    const handleAddTask = () => {
        if (!newTaskName.trim()) return;

        const xp = parseInt(newTaskXP) || 10;
        addDailyTask(newTaskName, xp);
        speak(`Added task: ${newTaskName}`);
        toast.success(`Task added: ${newTaskName}`);
        setNewTaskName('');
        setNewTaskXP('10');
    };

    const handleCompleteTask = (taskId: string) => {
        const task = dailyTasks.find((t) => t.id === taskId);
        if (task && !task.completed) {
            completeDailyTask(taskId);
            speak(`Task completed! You earned ${task.xpReward} XP`);
            toast.success(`+${task.xpReward} XP earned!`);
        }
    };

    const handleDeleteTask = (taskId: string) => {
        deleteDailyTask(taskId);
        speak('Task deleted');
        toast.info('Task deleted');
    };

    return (
        <div className="space-y-6">
            {/* Add Task Form */}
            <Card className="bg-card/50 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Plus className="w-5 h-5 text-primary" />
                        Add New Daily Task
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            placeholder="Task name..."
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                            className="flex-1"
                        />
                        <Input
                            type="number"
                            placeholder="XP"
                            value={newTaskXP}
                            onChange={(e) => setNewTaskXP(e.target.value)}
                            className="w-24"
                            min="1"
                        />
                        <Button onClick={handleAddTask} className="bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Task
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Task List */}
            <div className="grid gap-3">
                {dailyTasks.length === 0 ? (
                    <Card className="bg-muted/30">
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">No daily tasks yet. Add your first task above!</p>
                        </CardContent>
                    </Card>
                ) : (
                    dailyTasks.map((task) => (
                        <Card
                            key={task.id}
                            className={`transition-all ${
                                task.completed
                                    ? 'bg-accent/20 border-chart-2/30 opacity-75'
                                    : 'bg-card/50 border-primary/20 hover:border-primary/40'
                            }`}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <Checkbox
                                        checked={task.completed}
                                        onCheckedChange={() => handleCompleteTask(task.id)}
                                        className="w-6 h-6"
                                    />
                                    <div className="flex-1">
                                        <p
                                            className={`font-medium ${
                                                task.completed ? 'line-through text-muted-foreground' : ''
                                            }`}
                                        >
                                            {task.name}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                                        <Star className="w-3 h-3 mr-1" />
                                        {task.xpReward} XP
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteTask(task.id)}
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
