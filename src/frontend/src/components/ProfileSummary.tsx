import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Edit, Heart, Activity, Dumbbell } from 'lucide-react';
import type { UserProfile } from '@/backend';

interface ProfileSummaryProps {
  profile: UserProfile;
  onEdit: () => void;
}

export default function ProfileSummary({ profile, onEdit }: ProfileSummaryProps) {
  const fitnessLevel = () => {
    const avg = (
      Number(profile.capabilities.strength) +
      Number(profile.capabilities.endurance) +
      Number(profile.capabilities.flexibility) +
      Number(profile.capabilities.balance)
    ) / 4;

    if (avg < 4) return { label: 'Beginner', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' };
    if (avg < 7) return { label: 'Intermediate', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' };
    return { label: 'Advanced', color: 'bg-purple-500/10 text-purple-500 border-purple-500/30' };
  };

  const activeConditions = [
    profile.conditions.heartConditions ? 'Heart' : null,
    profile.conditions.diabetes ? 'Diabetes' : null,
    profile.conditions.jointIssues ? 'Joint' : null,
    profile.conditions.respiratoryIssues ? 'Respiratory' : null,
  ].filter((condition): condition is string => condition !== null);

  const level = fitnessLevel();

  return (
    <Card className="bg-gradient-to-br from-card via-card to-chart-1/5 border-chart-1/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-chart-1" />
            Your Profile
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Fitness Level:</span>
          <Badge variant="outline" className={level.color}>
            {level.label}
          </Badge>
        </div>

        {activeConditions.length > 0 && (
          <div className="flex items-start gap-2">
            <Heart className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <span className="text-sm text-muted-foreground">Health Considerations:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {activeConditions.map((condition) => (
                  <Badge key={condition} variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30 text-xs">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2">
          <Activity className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <span className="text-sm text-muted-foreground">Preferred Activities:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {profile.preferences.exerciseTypes.map((type) => (
                <Badge key={type} variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/30 text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
