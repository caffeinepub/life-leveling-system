import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PhysicalCapabilities {
    balance: bigint;
    flexibility: bigint;
    strength: bigint;
    endurance: bigint;
}
export interface QuestLog {
    completedQuests: Array<Task>;
    dailyQuests: Array<Task>;
    lastGenerated: bigint;
    failedQuests: Array<Task>;
}
export interface Habits {
    activityLevel: bigint;
    sleepQuality: bigint;
    dietQuality: bigint;
    smoking: boolean;
    alcoholConsumption: bigint;
}
export interface Preferences {
    timeAvailability: bigint;
    difficultyPreference: bigint;
    exerciseTypes: Array<string>;
}
export interface Task {
    id: bigint;
    duration: bigint;
    difficulty: bigint;
    createdAt: bigint;
    rewardPoints: bigint;
    description: string;
    taskType: TaskType;
}
export interface HealthConditions {
    heartConditions: boolean;
    respiratoryIssues: boolean;
    jointIssues: boolean;
    diabetes: boolean;
}
export interface UserProfile {
    completedTasks: bigint;
    capabilities: PhysicalCapabilities;
    currentTasks: Array<Task>;
    level: bigint;
    preferences: Preferences;
    experience: bigint;
    habits: Habits;
    conditions: HealthConditions;
}
export enum TaskType {
    exercise = "exercise",
    sleep = "sleep",
    mindfulness = "mindfulness",
    hydration = "hydration",
    nutrition = "nutrition"
}
export interface backendInterface {
    addHabitToProfile(habit: string, userId: string): Promise<boolean>;
    completeExercise(exerciseId: bigint, repetitions: bigint): Promise<boolean>;
    completeHydration(taskId: bigint, _timestamp: bigint): Promise<boolean>;
    completeMindfulness(taskId: bigint, _timestamp: bigint): Promise<boolean>;
    completeNutrition(taskId: bigint, _timestamp: bigint): Promise<boolean>;
    completeSleep(taskId: bigint, _timestamp: bigint): Promise<boolean>;
    deleteHabitFromProfile(habit: string, userId: string): Promise<boolean>;
    getQuestLog(userId: string): Promise<QuestLog | null>;
    getSuggestionsByQuestId(questId: bigint): Promise<Array<string>>;
    getTasks(userId: string): Promise<Array<Task>>;
    getUserProfile(userId: string): Promise<UserProfile | null>;
    updateUserProfile(userId: string, profile: UserProfile): Promise<boolean>;
}
