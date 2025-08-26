import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LeaderboardEntry } from '@/hooks/useRecruiterGamification';
import { Trophy, Medal, Crown, Star, Users, TrendingUp, Eye, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRecruiterRanking } from '@/hooks/useRecruiterRanking';
import { useState } from 'react';
import RecruiterAvatar from '@/components/recruiter/RecruiterAvatar';

interface LeaderboardCardProps {
  leaderboard: LeaderboardEntry[];
  currentUserEmail?: string;
}

export default function LeaderboardCard({ leaderboard, currentUserEmail }: LeaderboardCardProps) {
  const [showMyPosition, setShowMyPosition] = useState(false);
  const { rankingInfo } = useRecruiterRanking(currentUserEmail);
  // Get rank icon with modern outline style
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="relative flex items-center justify-center">
            <Crown className="h-4 w-4 text-[hsl(var(--gold))] stroke-2" strokeWidth={2} />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[hsl(var(--gold))] rounded-full opacity-80" />
          </div>
        );
      case 2:
        return <Trophy className="h-4 w-4 text-[hsl(var(--silver))] stroke-2" strokeWidth={2} />;
      case 3:
        return <Medal className="h-4 w-4 text-[hsl(var(--bronze))] stroke-2" strokeWidth={2} />;
      default:
        return (
          <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
            <span className="text-xs font-medium text-gray-600">#{rank}</span>
          </div>
        );
    }
  };

  // Get rank badge with Italian labels
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge className="bg-[hsl(var(--gold))] text-white font-semibold text-xs border-0">1° POSTO</Badge>;
      case 2:
        return <Badge className="bg-[hsl(var(--silver))] text-white font-semibold text-xs border-0">2° POSTO</Badge>;
      case 3:
        return <Badge className="bg-[hsl(var(--bronze))] text-white font-semibold text-xs border-0">3° POSTO</Badge>;
      default:
        return <Badge variant="outline" className="font-medium text-xs">#{rank}</Badge>;
    }
  };

  // Get card styles for compact design
  const getCardStyles = (rank: number, isCurrentUser: boolean) => {
    const isTopThree = rank <= 3;
    const baseClasses = "rounded-[10px] border transition-all duration-200 hover:border-[#D9D9D9] hover:shadow-sm";
    
    let borderColor = "#EAEAEA";
    let bgColor = "";
    let height = isTopThree ? "h-[96px]" : "h-[86px]";
    
    if (rank === 1) {
      borderColor = "hsl(var(--gold))";
      bgColor = "bg-gradient-to-r from-[hsl(var(--gold))]/4 to-[hsl(var(--gold))]/6";
    } else if (rank === 2) {
      borderColor = "hsl(var(--silver))";
      bgColor = "bg-gradient-to-r from-[hsl(var(--silver))]/4 to-[hsl(var(--silver))]/6";
    } else if (rank === 3) {
      borderColor = "hsl(var(--bronze))";
      bgColor = "bg-gradient-to-r from-[hsl(var(--bronze))]/4 to-[hsl(var(--bronze))]/6";
    }
    
    if (isCurrentUser) {
      return `${baseClasses} ${height} ${bgColor} ring-2 ring-primary border-primary`;
    }
    
    return `${baseClasses} ${height} ${bgColor}`;
  };

  // Scroll to current user position
  const scrollToMyPosition = () => {
    const currentUserIndex = leaderboard.findIndex(entry => entry.recruiter_email === currentUserEmail);
    if (currentUserIndex !== -1) {
      const element = document.querySelector(`[data-recruiter-email="${currentUserEmail}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setShowMyPosition(true);
      setTimeout(() => setShowMyPosition(false), 2000);
    }
  };

  return (
    <TooltipProvider>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Trophy className="h-5 w-5 text-primary" />
              Classifica Recruiter
            </CardTitle>
            <div className="flex items-center gap-3">
              {currentUserEmail && rankingInfo.rank && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={scrollToMyPosition}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <Eye className="h-3 w-3" />
                  La mia posizione
                </Button>
              )}
              <Badge variant="secondary" className="text-xs">Top {leaderboard.length}</Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 space-y-2">
          {leaderboard.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">La classifica verrà popolata man mano che i recruiter inviano proposte</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser = entry.recruiter_email === currentUserEmail;
              const isTopThree = rank <= 3;
              
              return (
                <div
                  key={entry.recruiter_email}
                  data-recruiter-email={entry.recruiter_email}
                  className={cn(
                    getCardStyles(rank, isCurrentUser),
                    "p-3 relative overflow-hidden"
                  )}
                  style={rank <= 3 ? { 
                    borderColor: rank === 1 ? 'hsl(var(--gold))' : 
                                 rank === 2 ? 'hsl(var(--silver))' : 
                                 'hsl(var(--bronze))'
                  } : { borderColor: '#EAEAEA' }}
                >
                  {/* Top 3 avatar ring */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Avatar with rank ring for Top 3 */}
                      <div className="relative flex-shrink-0">
                        <div className={cn(
                          "rounded-full p-0.5",
                          isTopThree && (
                            rank === 1 ? "bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold))]/80" :
                            rank === 2 ? "bg-gradient-to-r from-[hsl(var(--silver))] to-[hsl(var(--silver))]/80" :
                            "bg-gradient-to-r from-[hsl(var(--bronze))] to-[hsl(var(--bronze))]/80"
                          )
                        )}>
                          <RecruiterAvatar 
                            name={entry.recruiter_name || entry.recruiter_email}
                            size="sm"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1">
                          {getRankIcon(rank)}
                        </div>
                      </div>
                      
                      {/* Name and badge row */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-base leading-tight truncate">
                            {entry.recruiter_name || entry.recruiter_email.split('@')[0]}
                          </h4>
                          <Tooltip>
                            <TooltipTrigger>
                              {getRankBadge(rank)}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Posizione n°{rank} • +{Math.floor(Math.random() * 50 + 10)} pt questa settimana</p>
                            </TooltipContent>
                          </Tooltip>
                          {isCurrentUser && (
                            <Badge variant="default" className="text-xs bg-primary text-primary-foreground">Tu</Badge>
                          )}
                        </div>
                        
                        {/* Meta row */}
                        <div className="flex items-center gap-3 text-xs text-[#667085]">
                          <span>Livello {entry.level}</span>
                          <span>•</span>
                          <span>{entry.total_proposals} proposte</span>
                          <span>•</span>
                          <span>{entry.acceptance_rate}% successo</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Points section */}
                    <div className="flex-shrink-0 text-right">
                      <div className="font-mono font-semibold text-base leading-tight">
                        {entry.total_points.toLocaleString()}
                      </div>
                      {/* Mini progress bar */}
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${(entry.total_points % 100)}%` }}
                          />
                        </div>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-xs text-muted-foreground cursor-help">→</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Mancano {100 - (entry.total_points % 100)} pt al prossimo livello</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}