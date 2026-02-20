import { useGetUserProfile, useUpdateUserProfile } from './useQueries';
import type { UserProfile } from '@/backend';

export function useProfile(userId: string) {
  const { data: profile, isLoading, error } = useGetUserProfile(userId);
  const updateProfileMutation = useUpdateUserProfile();

  const isProfileComplete = (profile: UserProfile | null | undefined): boolean => {
    if (!profile) return false;
    
    // Check if all required fields are present
    return (
      profile.capabilities.strength > 0 &&
      profile.capabilities.endurance > 0 &&
      profile.capabilities.flexibility > 0 &&
      profile.capabilities.balance > 0 &&
      profile.habits.activityLevel > 0 &&
      profile.habits.sleepQuality > 0 &&
      profile.habits.dietQuality > 0 &&
      profile.preferences.exerciseTypes.length > 0
    );
  };

  const updateProfile = async (profile: UserProfile) => {
    return updateProfileMutation.mutateAsync({ userId, profile });
  };

  return {
    profile,
    isLoading,
    error,
    isProfileComplete: isProfileComplete(profile),
    updateProfile,
    isUpdating: updateProfileMutation.isPending,
  };
}
