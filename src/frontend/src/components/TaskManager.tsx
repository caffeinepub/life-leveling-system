import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DailyTaskList from '@/components/DailyTaskList';
import HabitTracker from '@/components/HabitTracker';
import SkillProgression from '@/components/SkillProgression';
import GoalTracker from '@/components/GoalTracker';

export default function TaskManager() {
    return (
        <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                <TabsTrigger value="daily">Daily Tasks</TabsTrigger>
                <TabsTrigger value="habits">Habits</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="mt-6">
                <DailyTaskList />
            </TabsContent>

            <TabsContent value="habits" className="mt-6">
                <HabitTracker />
            </TabsContent>

            <TabsContent value="skills" className="mt-6">
                <SkillProgression />
            </TabsContent>

            <TabsContent value="goals" className="mt-6">
                <GoalTracker />
            </TabsContent>
        </Tabs>
    );
}
