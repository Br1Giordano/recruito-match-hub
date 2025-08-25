import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeaderboardEntry } from '@/hooks/useRecruiterGamification';
import { Trophy, Medal, Award, Star, TrendingUp, Target, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardCardProps {
  leaderboard: LeaderboardEntry[];
  currentUserEmail?: string;
}

export default function LeaderboardCard({ leaderboard, currentUserEmail }: LeaderboardCardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Trophy className="h-6 w-6 text-slate-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return (
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-bold text-muted-foreground">#{rank}</span>
          </div>
        );
    }
  };

  const getRankStyles = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          container: 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-yellow-300 shadow-lg shadow-yellow-100',
          badge: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold',
          points: 'text-yellow-700 font-extrabold text-xl',
          name: 'text-yellow-800 font-bold'
        };
      case 2:
        return {
          container: 'bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 border-slate-300 shadow-md shadow-slate-100',
          badge: 'bg-gradient-to-r from-slate-400 to-gray-500 text-white font-semibold',
          points: 'text-slate-600 font-bold text-lg',
          name: 'text-slate-700 font-semibold'
        };
      case 3:
        return {
          container: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-amber-300 shadow-md shadow-amber-100',
          badge: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold',
          points: 'text-amber-700 font-bold text-lg',
          name: 'text-amber-800 font-semibold'
        };
      default:
        return {
          container: 'bg-background border-border hover:bg-muted/30 transition-colors',
          badge: 'bg-muted text-muted-foreground',
          points: 'text-foreground font-semibold',
          name: 'text-foreground'
        };
    }
  };

  const getRankBadge = (rank: number) => {
    const styles = getRankStyles(rank);
    switch (rank) {
      case 1:
        return <Badge className={styles.badge}>🥇 1° POSTO</Badge>;
      case 2:
        return <Badge className={styles.badge}>🥈 2° POSTO</Badge>;
      case 3:
        return <Badge className={styles.badge}>🥉 3° POSTO</Badge>;
      default:
        return <Badge variant="outline" className={styles.badge}>#{rank}</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Classifica Recruiter
          <Badge variant="secondary" className="ml-auto">Top {leaderboard.length}</Badge>
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
            const styles = getRankStyles(rank);
            const isTopThree = rank <= 3;
            
            return (
              <div
                key={entry.recruiter_email}
                className={cn(
                  "relative flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300",
                  styles.container,
                  isCurrentUser && "ring-2 ring-primary ring-offset-2 scale-[1.02]",
                  isTopThree && "hover:scale-[1.01] transform-gpu",
                  !isTopThree && "hover:bg-muted/50"
                )}
              >
                {/* Sparkle effect for top 3 */}
                {isTopThree && (
                  <div className="absolute -top-1 -right-1">
                    <Star className="h-4 w-4 text-yellow-400 animate-pulse" />
                  </div>
                )}
                
                <div className="flex items-center gap-4 flex-1">
                  {/* Rank Icon */}
                  <div className="flex-shrink-0 relative">
                    {getRankIcon(rank)}
                    {isTopThree && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 blur-sm animate-pulse" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Name and Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className={cn("font-semibold truncate", styles.name)}>
                        {entry.recruiter_name || entry.recruiter_email}
                      </h4>
                      {isCurrentUser && (
                        <Badge variant="default" className="text-xs bg-primary">Tu</Badge>
                      )}
                    </div>
                    
                    {/* Rank Badge */}
                    <div className="mb-2">
                      {getRankBadge(rank)}
                    </div>
                    
                    {/* Stats */}
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
                
                {/* Points */}
                <div className="flex-shrink-0 text-right">
                  <div className={cn("font-bold", styles.points)}>
                    {entry.total_points.toLocaleString()}
                  </div>
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