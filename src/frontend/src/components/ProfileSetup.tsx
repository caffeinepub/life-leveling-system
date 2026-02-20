import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { User, Heart, Activity, Moon, Utensils, Dumbbell, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { UserProfile } from '@/backend';

interface ProfileSetupProps {
  userId: string;
  initialProfile?: UserProfile | null;
  onComplete: (profile: UserProfile) => void;
  onCancel?: () => void;
}

export default function ProfileSetup({ userId, initialProfile, onComplete, onCancel }: ProfileSetupProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Physical Capabilities
  const [strength, setStrength] = useState(initialProfile?.capabilities.strength || BigInt(5));
  const [endurance, setEndurance] = useState(initialProfile?.capabilities.endurance || BigInt(5));
  const [flexibility, setFlexibility] = useState(initialProfile?.capabilities.flexibility || BigInt(5));
  const [balance, setBalance] = useState(initialProfile?.capabilities.balance || BigInt(5));

  // Health Conditions
  const [heartConditions, setHeartConditions] = useState(initialProfile?.conditions.heartConditions || false);
  const [diabetes, setDiabetes] = useState(initialProfile?.conditions.diabetes || false);
  const [jointIssues, setJointIssues] = useState(initialProfile?.conditions.jointIssues || false);
  const [respiratoryIssues, setRespiratoryIssues] = useState(initialProfile?.conditions.respiratoryIssues || false);

  // Habits
  const [activityLevel, setActivityLevel] = useState(initialProfile?.habits.activityLevel || BigInt(5));
  const [sleepQuality, setSleepQuality] = useState(initialProfile?.habits.sleepQuality || BigInt(5));
  const [dietQuality, setDietQuality] = useState(initialProfile?.habits.dietQuality || BigInt(5));
  const [smoking, setSmoking] = useState(initialProfile?.habits.smoking || false);
  const [alcoholConsumption, setAlcoholConsumption] = useState(initialProfile?.habits.alcoholConsumption || BigInt(0));

  // Preferences
  const [exerciseTypes, setExerciseTypes] = useState<string[]>(initialProfile?.preferences.exerciseTypes || []);
  const [difficultyPreference, setDifficultyPreference] = useState(initialProfile?.preferences.difficultyPreference || BigInt(5));
  const [timeAvailability, setTimeAvailability] = useState(initialProfile?.preferences.timeAvailability || BigInt(30));

  const handleExerciseTypeToggle = (type: string) => {
    setExerciseTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = () => {
    if (exerciseTypes.length === 0) {
      toast.error('Please select at least one exercise type');
      return;
    }

    const profile: UserProfile = {
      capabilities: {
        strength,
        endurance,
        flexibility,
        balance,
      },
      conditions: {
        heartConditions,
        diabetes,
        jointIssues,
        respiratoryIssues,
      },
      habits: {
        activityLevel,
        sleepQuality,
        dietQuality,
        smoking,
        alcoholConsumption,
      },
      preferences: {
        exerciseTypes,
        difficultyPreference,
        timeAvailability,
      },
      level: initialProfile?.level || BigInt(1),
      experience: initialProfile?.experience || BigInt(0),
      completedTasks: initialProfile?.completedTasks || BigInt(0),
      currentTasks: initialProfile?.currentTasks || [],
    };

    onComplete(profile);
  };

  const progressPercent = (step / totalSteps) * 100;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>AI Personalization Setup</CardTitle>
                <CardDescription>Step {step} of {totalSteps}</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/30">
              {Math.round(progressPercent)}% Complete
            </Badge>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Physical Capabilities */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="w-5 h-5 text-chart-1" />
                <h3 className="text-lg font-semibold">Physical Capabilities</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Rate your current physical capabilities on a scale of 1-10
              </p>

              <div className="space-y-4">
                <div>
                  <Label>Strength: {Number(strength)}/10</Label>
                  <Input
                    type="range"
                    min="1"
                    max="10"
                    value={Number(strength)}
                    onChange={(e) => setStrength(BigInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label>Endurance: {Number(endurance)}/10</Label>
                  <Input
                    type="range"
                    min="1"
                    max="10"
                    value={Number(endurance)}
                    onChange={(e) => setEndurance(BigInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label>Flexibility: {Number(flexibility)}/10</Label>
                  <Input
                    type="range"
                    min="1"
                    max="10"
                    value={Number(flexibility)}
                    onChange={(e) => setFlexibility(BigInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label>Balance: {Number(balance)}/10</Label>
                  <Input
                    type="range"
                    min="1"
                    max="10"
                    value={Number(balance)}
                    onChange={(e) => setBalance(BigInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Health Conditions */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-chart-1" />
                <h3 className="text-lg font-semibold">Health Conditions</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Select any health conditions that may affect your exercise routine
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="heart"
                    checked={heartConditions}
                    onCheckedChange={(checked) => setHeartConditions(checked as boolean)}
                  />
                  <Label htmlFor="heart" className="cursor-pointer">Heart Conditions</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="diabetes"
                    checked={diabetes}
                    onCheckedChange={(checked) => setDiabetes(checked as boolean)}
                  />
                  <Label htmlFor="diabetes" className="cursor-pointer">Diabetes</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="joint"
                    checked={jointIssues}
                    onCheckedChange={(checked) => setJointIssues(checked as boolean)}
                  />
                  <Label htmlFor="joint" className="cursor-pointer">Joint Issues</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="respiratory"
                    checked={respiratoryIssues}
                    onCheckedChange={(checked) => setRespiratoryIssues(checked as boolean)}
                  />
                  <Label htmlFor="respiratory" className="cursor-pointer">Respiratory Issues</Label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Current Habits */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-chart-1" />
                <h3 className="text-lg font-semibold">Current Habits</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Tell us about your current lifestyle habits
              </p>

              <div className="space-y-4">
                <div>
                  <Label>Activity Level: {Number(activityLevel)}/10</Label>
                  <Input
                    type="range"
                    min="1"
                    max="10"
                    value={Number(activityLevel)}
                    onChange={(e) => setActivityLevel(BigInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label>Sleep Quality: {Number(sleepQuality)}/10</Label>
                  <Input
                    type="range"
                    min="1"
                    max="10"
                    value={Number(sleepQuality)}
                    onChange={(e) => setSleepQuality(BigInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label>Diet Quality: {Number(dietQuality)}/10</Label>
                  <Input
                    type="range"
                    min="1"
                    max="10"
                    value={Number(dietQuality)}
                    onChange={(e) => setDietQuality(BigInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smoking"
                    checked={smoking}
                    onCheckedChange={(checked) => setSmoking(checked as boolean)}
                  />
                  <Label htmlFor="smoking" className="cursor-pointer">I smoke</Label>
                </div>

                <div>
                  <Label>Alcohol Consumption (drinks per week)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="50"
                    value={Number(alcoholConsumption)}
                    onChange={(e) => setAlcoholConsumption(BigInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preferences */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Moon className="w-5 h-5 text-chart-1" />
                <h3 className="text-lg font-semibold">Exercise Preferences</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Select your preferred exercise types and availability
              </p>

              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Exercise Types (select at least one)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Cardio', 'Strength Training', 'Yoga', 'Swimming', 'Cycling', 'Walking'].map((type) => (
                      <div
                        key={type}
                        onClick={() => handleExerciseTypeToggle(type)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          exerciseTypes.includes(type)
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={exerciseTypes.includes(type)}
                            onCheckedChange={() => handleExerciseTypeToggle(type)}
                          />
                          <Label className="cursor-pointer">{type}</Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Preferred Difficulty: {Number(difficultyPreference)}/10</Label>
                  <Input
                    type="range"
                    min="1"
                    max="10"
                    value={Number(difficultyPreference)}
                    onChange={(e) => setDifficultyPreference(BigInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label>Daily Time Availability (minutes)</Label>
                  <Select
                    value={String(timeAvailability)}
                    onValueChange={(value) => setTimeAvailability(BigInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => step > 1 ? setStep(step - 1) : onCancel?.()}
              disabled={step === 1 && !onCancel}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step === 1 ? 'Cancel' : 'Previous'}
            </Button>

            {step < totalSteps ? (
              <Button onClick={() => setStep(step + 1)} className="bg-chart-1 hover:bg-chart-1/90">
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-chart-2 hover:bg-chart-2/90">
                <Check className="w-4 h-4 mr-2" />
                Complete Setup
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
