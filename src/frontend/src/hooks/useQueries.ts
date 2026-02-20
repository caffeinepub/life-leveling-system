import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, QuestLog, Task } from '@/backend';

// User Profile Queries
export function useGetUserProfile(userId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useUpdateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, profile }: { userId: string; profile: UserProfile }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateUserProfile(userId, profile);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });
    },
  });
}

// Quest Log Queries
export function useGetQuestLog(userId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<QuestLog | null>({
    queryKey: ['questLog', userId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getQuestLog(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

// Tasks Queries
export function useGetTasks(userId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['tasks', userId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTasks(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

// Task Completion Mutations
export function useCompleteExercise() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ exerciseId, repetitions }: { exerciseId: bigint; repetitions: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.completeExercise(exerciseId, repetitions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['questLog'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

export function useCompleteNutrition() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, timestamp }: { taskId: bigint; timestamp: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.completeNutrition(taskId, timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['questLog'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

export function useCompleteMindfulness() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, timestamp }: { taskId: bigint; timestamp: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.completeMindfulness(taskId, timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['questLog'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

export function useCompleteHydration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, timestamp }: { taskId: bigint; timestamp: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.completeHydration(taskId, timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['questLog'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}

export function useCompleteSleep() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, timestamp }: { taskId: bigint; timestamp: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.completeSleep(taskId, timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['questLog'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
}
