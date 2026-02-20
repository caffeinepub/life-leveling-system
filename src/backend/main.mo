import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Text "mo:core/Text";

actor {
  // Types for User Profile and Personalization
  type PhysicalCapabilities = {
    strength : Nat;
    endurance : Nat;
    flexibility : Nat;
    balance : Nat;
  };

  type HealthConditions = {
    heartConditions : Bool;
    diabetes : Bool;
    jointIssues : Bool;
    respiratoryIssues : Bool;
  };

  type Habits = {
    activityLevel : Nat;
    dietQuality : Nat;
    sleepQuality : Nat;
    smoking : Bool;
    alcoholConsumption : Nat;
  };

  type Preferences = {
    exerciseTypes : [Text];
    difficultyPreference : Nat;
    timeAvailability : Nat;
  };

  type UserProfile = {
    capabilities : PhysicalCapabilities;
    conditions : HealthConditions;
    habits : Habits;
    preferences : Preferences;
    level : Nat;
    experience : Nat;
    completedTasks : Nat;
    currentTasks : [Task];
  };

  // Types for Tasks and Quests
  type Task = {
    id : Nat;
    description : Text;
    difficulty : Nat;
    duration : Nat;
    rewardPoints : Nat;
    taskType : TaskType;
    createdAt : Nat;
  };

  type TaskType = {
    #exercise;
    #nutrition;
    #mindfulness;
    #sleep;
    #hydration;
  };

  type QuestLog = {
    dailyQuests : [Task];
    completedQuests : [Task];
    failedQuests : [Task];
    lastGenerated : Nat;
  };

  // Types for AI Hints and Task Generation
  type AiHint = {
    title : Text;
    content : Text;
    focusArea : FocusArea;
  };

  type FocusArea = {
    #physical;
    #mental;
    #nutrition;
    #lifestyle;
  };

  // Persistent Storage
  let userProfiles = Map.empty<Text, UserProfile>();
  let questLogs = Map.empty<Text, QuestLog>();

  // AI Task Generation Algorithm
  func generateTask(profile : UserProfile, taskType : TaskType) : Task {
    let baseDifficulty = switch (taskType) {
      case (#exercise) { profile.capabilities.endurance };
      case (#nutrition) { profile.habits.dietQuality };
      case (#mindfulness) { profile.habits.sleepQuality };
      case (#sleep) { profile.habits.sleepQuality };
      case (#hydration) { profile.habits.activityLevel };
    };

    let adjustedDifficulty = if (profile.level > 1) {
      Int.abs((baseDifficulty + profile.level) / 2);
    } else { baseDifficulty };

    let description = switch (taskType) {
      case (#exercise) { "Complete a " # adjustedDifficulty.toText() # " difficulty exercise routine." };
      case (#nutrition) { "Prepare a healthy meal following nutritional guidelines." };
      case (#mindfulness) { "Practice mindfulness meditation for 15 minutes." };
      case (#sleep) { "Establish a bedtime routine to improve sleep quality." };
      case (#hydration) { "Drink 8 glasses of water throughout the day." };
    };

    {
      id = 100; // Placeholder for Time.now().toInt().toNat();
      description;
      difficulty = Int.abs(adjustedDifficulty);
      duration = 30;
      rewardPoints = profile.level * 10;
      taskType;
      createdAt = 100; // Placeholder for Time.now();
    };
  };

  // Daily Quest Generation System
  func generateDailyQuests(userId : Text) : async () {
    let profile = userProfiles.get(userId);
    switch (profile) {
      case (null) { return };
      case (?userProfile) {
        let exerciseTask = generateTask(userProfile, #exercise);
        let nutritionTask = generateTask(userProfile, #nutrition);
        let mindfulnessTask = generateTask(userProfile, #mindfulness);

        let dailyQuests = [exerciseTask, nutritionTask, mindfulnessTask];

        let questLog = {
          dailyQuests;
          completedQuests = [];
          failedQuests = [];
          lastGenerated = 0; // Placeholder for Time.now();
        };

        questLogs.add(userId, questLog);

        let updatedProfile = {
          userProfile with
          currentTasks = dailyQuests
        };
        userProfiles.add(userId, updatedProfile);
      };
    };
  };

  // Task Completion Tracking
  func completeTask(userId : Text, taskId : Nat) : async Bool {
    switch (userProfiles.get(userId), questLogs.get(userId)) {
      case (?profile, ?log) {
        let taskOpt = profile.currentTasks.find(func(task) { task.id == taskId });
        switch (taskOpt) {
          case (?task) {
            let updatedProfile = {
              profile with
              completedTasks = profile.completedTasks + 1;
              experience = profile.experience + task.rewardPoints;
              currentTasks = profile.currentTasks.filter(
                func(t) { t.id != taskId }
              );
            };

            userProfiles.add(userId, updatedProfile);

            let updatedQuestLog = {
              log with
              completedQuests = log.completedQuests.concat([task]);
              dailyQuests = log.dailyQuests.filter(
                func(t) { t.id != taskId }
              );
            };

            questLogs.add(userId, updatedQuestLog);
            true;
          };
          case (null) { false };
        };
      };
      case (_) { false };
    };
  };

  public shared ({ caller }) func getSuggestionsByQuestId(questId : Nat) : async [Text] {
    if (questId <= 2) {
      ["No suggestions available"];
    } else if (questId == 3) {
      ["Consistency is key!", "Try to make a habit of it"];
    } else if (questId == 4) {
      ["Find patterns that work for you", "Experiment with different techniques"];
    } else {
      ["Keep up the great work!", "You're doing amazing!"];
    };
  };

  public shared ({ caller }) func addHabitToProfile(habit : Text, userId : Text) : async Bool {
    switch (userProfiles.get(userId)) {
      case (?profile) {
        let habits = profile.preferences.exerciseTypes;
        if (habits.find(func(h) { h == habit }) != null) {
          false;
        } else {
          let newHabits = habits.concat([habit]);
          let newProfile = {
            profile with
            preferences = {
              profile.preferences with
              exerciseTypes = newHabits;
            };
          };
          userProfiles.add(userId, newProfile);
          true;
        };
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func deleteHabitFromProfile(habit : Text, userId : Text) : async Bool {
    switch (userProfiles.get(userId)) {
      case (?profile) {
        let habits = profile.preferences.exerciseTypes;
        if (habits.find(func(h) { h == habit }) == null) {
          false;
        } else {
          let newHabits = habits.filter(func(h) { h != habit });
          let newProfile = {
            profile with
            preferences = {
              profile.preferences with
              exerciseTypes = newHabits
            }
          };
          userProfiles.add(userId, newProfile);
          true;
        };
      };
      case (null) { false };
    };
  };

  // Additional Public Functions
  public query ({ caller }) func getUserProfile(userId : Text) : async ?UserProfile {
    userProfiles.get(userId);
  };

  public shared ({ caller }) func updateUserProfile(userId : Text, profile : UserProfile) : async Bool {
    userProfiles.add(userId, profile);
    true;
  };

  public query ({ caller }) func getQuestLog(userId : Text) : async ?QuestLog {
    questLogs.get(userId);
  };

  public query ({ caller }) func getTasks(userId : Text) : async [Task] {
    switch (userProfiles.get(userId)) {
      case (?profile) { profile.currentTasks };
      case (null) { [] };
    };
  };

  // Automatic Proofs
  public shared ({ caller }) func completeExercise(exerciseId : Nat, repetitions : Nat) : async Bool {
    await _completeTaskInternal(#exercise, exerciseId, repetitions);
  };

  public shared ({ caller }) func completeNutrition(taskId : Nat, _timestamp : Nat) : async Bool {
    await _completeTaskInternal(#nutrition, taskId, 1);
  };

  public shared ({ caller }) func completeMindfulness(taskId : Nat, _timestamp : Nat) : async Bool {
    await _completeTaskInternal(#mindfulness, taskId, 1);
  };

  public shared ({ caller }) func completeHydration(taskId : Nat, _timestamp : Nat) : async Bool {
    await _completeTaskInternal(#hydration, taskId, 1);
  };

  public shared ({ caller }) func completeSleep(taskId : Nat, _timestamp : Nat) : async Bool {
    await _completeTaskInternal(#sleep, taskId, 1);
  };

  func _completeTaskInternal(taskType : TaskType, _taskId : Nat, repetitions : Nat) : async Bool {
    let validRepetitions = repetitions % 1000;
    if (validRepetitions <= 0) { return false };

    _findTaskIdForType(validRepetitions, taskType);
    true;
  };

  func _findTaskIdForType(_id : Nat, _taskType : TaskType) : () {
    // Here you'd check if the taskId matches the correct taskType in a real application
    // Currently, this is a placeholder function
  };
};
