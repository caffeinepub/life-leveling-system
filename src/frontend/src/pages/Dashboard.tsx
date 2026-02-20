import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import CharacterStats from '@/components/CharacterStats';
import TaskManager from '@/components/TaskManager';
import DailyQuests from '@/components/DailyQuests';
import AchievementPanel from '@/components/AchievementPanel';
import VoiceControl from '@/components/VoiceControl';
import ProfileSetup from '@/components/ProfileSetup';
import ProfileSummary from '@/components/ProfileSummary';
import AIPersonalizationPanel from '@/components/AIPersonalizationPanel';
import { useGameState } from '@/hooks/useGameState';
import { useProfile } from '@/hooks/useProfile';
import { useQuestGeneration } from '@/hooks/useQuestGeneration';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<'tasks' | 'quests' | 'achievements'>('tasks');
    const [showProfileSetup, setShowProfileSetup] = useState(false);
    const { character } = useGameState();
    
    // Use a default user ID for now (in production, this would come from authentication)
    const userId = 'default-user';
    
    const { profile, isLoading, isProfileComplete, updateProfile, isUpdating } = useProfile(userId);
    const { needsGeneration, questLog, checkForNewQuests } = useQuestGeneration(userId, isProfileComplete);

    // Check if profile setup is needed on mount
    useEffect(() => {
        if (!isLoading && !isProfileComplete) {
            setShowProfileSetup(true);
        }
    }, [isLoading, isProfileComplete]);

    // Check for quest generation needs
    useEffect(() => {
        if (needsGeneration && isProfileComplete) {
            toast.info('Generating your personalized daily quests...');
            checkForNewQuests();
        }
    }, [needsGeneration, isProfileComplete]);

    const handleProfileComplete = async (newProfile: any) => {
        try {
            await updateProfile(newProfile);
            setShowProfileSetup(false);
            toast.success('Profile saved! Your AI-powered quests are being generated.');
            // Trigger quest generation check
            setTimeout(() => checkForNewQuests(), 1000);
        } catch (error) {
            console.error('Failed to save profile:', error);
            toast.error('Failed to save profile. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[600px]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Loading your profile...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-6 space-y-6">
                {/* Character Stats Header */}
                <CharacterStats character={character} />

                {/* Profile Summary and AI Panel - Only show if profile is complete */}
                {isProfileComplete && profile && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ProfileSummary 
                            profile={profile} 
                            onEdit={() => setShowProfileSetup(true)} 
                        />
                        <AIPersonalizationPanel questLog={questLog ?? null} />
                    </div>
                )}

                {/* Voice Control */}
                <VoiceControl />

                {/* Navigation Tabs */}
                <div className="flex gap-2 border-b border-border/50">
                    <button
                        onClick={() => setActiveTab('tasks')}
                        className={`px-6 py-3 font-semibold transition-all ${
                            activeTab === 'tasks'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Tasks
                    </button>
                    <button
                        onClick={() => setActiveTab('quests')}
                        className={`px-6 py-3 font-semibold transition-all ${
                            activeTab === 'quests'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Daily Quests
                    </button>
                    <button
                        onClick={() => setActiveTab('achievements')}
                        className={`px-6 py-3 font-semibold transition-all ${
                            activeTab === 'achievements'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Achievements
                    </button>
                </div>

                {/* Content Area */}
                <div className="min-h-[600px]">
                    {activeTab === 'tasks' && <TaskManager />}
                    {activeTab === 'quests' && <DailyQuests userId={userId} />}
                    {activeTab === 'achievements' && <AchievementPanel />}
                </div>
            </div>

            {/* Profile Setup Dialog */}
            <Dialog open={showProfileSetup} onOpenChange={setShowProfileSetup}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {isProfileComplete ? 'Edit Your Profile' : 'Complete Your Profile'}
                        </DialogTitle>
                    </DialogHeader>
                    <ProfileSetup
                        userId={userId}
                        initialProfile={profile}
                        onComplete={handleProfileComplete}
                        onCancel={isProfileComplete ? () => setShowProfileSetup(false) : undefined}
                    />
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
