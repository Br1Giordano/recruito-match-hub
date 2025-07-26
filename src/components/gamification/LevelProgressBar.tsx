import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Crown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LevelProgressBarProps {
  level: number;
  currentPoints: number;
  className?: string;
}

export default function LevelProgressBar({ level, currentPoints, className }: LevelProgressBarProps) {
  // Calculate points needed for current and next level
  const currentLevelPoints = Math.pow(level - 1, 2) * 100;
  const nextLevelPoints = Math.pow(level, 2) * 100;
  const pointsInCurrentLevel = currentPoints - currentLevelPoints;
  const pointsNeededForNextLevel = nextLevelPoints - currentLevelPoints;
  const progressPercentage = Math.min((pointsInCurrentLevel / pointsNeededForNextLevel) * 100, 100);

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-yellow-600 bg-gradient-to-r from-yellow-500 to-orange-500';
    if (level >= 7) return 'text-purple-600 bg-gradient-to-r from-purple-500 to-pink-500';
    if (level >= 4) return 'text-blue-600 bg-gradient-to-r from-blue-500 to-cyan-500';
    return 'text-gray-600 bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const getLevelTitle = (level: number) => {
    if (level >= 10) return 'Master Recruiter';
    if (level >= 7) return 'Expert Recruiter';
    if (level >= 4) return 'Professional Recruiter';
    if (level >= 2) return 'Junior Recruiter';
    return 'Novice Recruiter';
  };

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {level >= 10 ? (
              <Crown className="h-8 w-8 text-yellow-600" />
            ) : (
              <Star className="h-8 w-8 text-blue-600" />
            )}
            <div>
              <h3 className="text-2xl font-bold">Livello {level}</h3>
              <p className="text-sm text-muted-foreground">{getLevelTitle(level)}</p>
            </div>
          </div>
          <div className={cn(
            "px-4 py-2 rounded-full text-white font-semibold text-sm",
            getLevelColor(level)
          )}>
            {currentPoints} punti
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso al livello {level + 1}</span>
            <span>{pointsInCurrentLevel} / {pointsNeededForNextLevel}</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3"
          />
          <p className="text-xs text-muted-foreground text-center">
            {nextLevelPoints - currentPoints} punti al prossimo livello
          </p>
        </div>
      </CardContent>
    </Card>
  );
}