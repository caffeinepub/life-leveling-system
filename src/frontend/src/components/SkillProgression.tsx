import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, TrendingUp, Trash2 } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { toast } from 'sonner';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

export default function SkillProgression() {
    const { skills, addSkill, practiceSkill, deleteSkill } = useGameState();
    const { speak } = useTextToSpeech();
    const [newSkillName, setNewSkillName] = useState('');

    const handleAddSkill = () => {
        if (!newSkillName.trim()) return;

        addSkill(newSkillName);
        speak(`Skill added: ${newSkillName}`);
        toast.success(`Skill added: ${newSkillName}`);
        setNewSkillName('');
    };

    const handlePracticeSkill = (skillId: string) => {
        const skill = skills.find((s) => s.id === skillId);
        if (skill) {
            const result = practiceSkill(skillId);
            if (result.leveledUp) {
                speak(`Skill level up! ${skill.name} is now level ${result.newLevel}`);
                toast.success(`${skill.name} leveled up to ${result.newLevel}!`);
            } else {
                speak(`Practiced ${skill.name}. Progress: ${result.progress}%`);
                toast.success(`+1 practice session! +8 XP`);
            }
        }
    };

    const handleDeleteSkill = (skillId: string) => {
        deleteSkill(skillId);
        speak('Skill deleted');
        toast.info('Skill deleted');
    };

    return (
        <div className="space-y-6">
            {/* Add Skill Form */}
            <Card className="bg-card/50 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Plus className="w-5 h-5 text-primary" />
                        Add New Skill
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <Input
                            placeholder="Skill name..."
                            value={newSkillName}
                            onChange={(e) => setNewSkillName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                            className="flex-1"
                        />
                        <Button onClick={handleAddSkill} className="bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Skill
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Skill List */}
            <div className="grid gap-3">
                {skills.length === 0 ? (
                    <Card className="bg-muted/30">
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">No skills yet. Start learning something new!</p>
                        </CardContent>
                    </Card>
                ) : (
                    skills.map((skill) => {
                        const progressPercent = (skill.practiceCount / skill.practiceToNextLevel) * 100;
                        return (
                            <Card
                                key={skill.id}
                                className="bg-card/50 border-primary/20 hover:border-primary/40 transition-all"
                            >
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium">{skill.name}</p>
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-chart-1/10 text-chart-1 border-chart-1/30"
                                                    >
                                                        Level {skill.level}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {skill.practiceCount} / {skill.practiceToNextLevel} practice sessions
                                                </p>
                                            </div>
                                            <Button
                                                onClick={() => handlePracticeSkill(skill.id)}
                                                className="bg-primary hover:bg-primary/90"
                                            >
                                                <TrendingUp className="w-4 h-4 mr-2" />
                                                Practice
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteSkill(skill.id)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <Progress value={progressPercent} className="h-2 bg-muted/50" />
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
