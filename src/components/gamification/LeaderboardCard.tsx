import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeaderboardEntry } from '@/hooks/useRecruiterGamification';
import { Trophy, Medal, Award, Star, TrendingUp, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardCardProps {
  leaderboard: LeaderboardEntry[];
  currentUserEmail?: string;
}

export default function LeaderboardCard({ leaderboard, currentUserEmail }: LeaderboardCardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-600" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          Classifica Recruiter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>La classifica verrà popolata man mano che i recruiter inviano proposte</p>
          </div>
        ) : (
          leaderboard.map((entry, index) => {
            const rank = index + 1;
            const isCurrentUser = entry.recruiter_email === currentUserEmail;
            
            return (
              <div
                key={entry.recruiter_email}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-colors",
                  getRankColor(rank),
                  isCurrentUser && "ring-2 ring-primary ring-offset-2",
                  !getRankColor(rank) && "hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {getRankIcon(rank)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold truncate">
                        {entry.recruiter_name || entry.recruiter_email}
                      </h4>
                      {isCurrentUser && (
                        <Badge variant="secondary" className="text-xs">Tu</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>Liv. {entry.level}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        <span>{entry.total_proposals} proposte</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{entry.acceptance_rate}% successo</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <div className="font-bold text-lg">{entry.total_points}</div>
                  <div className="text-xs text-muted-foreground">punti</div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}