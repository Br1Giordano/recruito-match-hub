import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useRecruiterGamification } from '@/hooks/useRecruiterGamification';
import { useAuth } from '@/hooks/useAuth';
import BadgeCard from './BadgeCard';
import LevelProgressBar from './LevelProgressBar';
import LeaderboardCard from './LeaderboardCard';
import { Trophy, Award, BarChart3, RefreshCw, Target, TrendingUp, Flame } from 'lucide-react';
import { useState } from 'react';

export default function RecruiterGamificationDashboard() {
  const { badges, stats, leaderboard, loading, refreshGamificationData } = useRecruiterGamification();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const earnedBadges = badges.filter(badge => badge.earned_at);
  const unEarnedBadges = badges.filter(badge => !badge.earned_at);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshGamificationData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Caricamento statistiche...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gamification</h1>
          <p className="text-muted-foreground">
            Livelli, badge e classifiche per i recruiter
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Aggiorna
        </Button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Proposte Totali</p>
                  <p className="text-2xl font-bold">{stats.total_proposals}</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tasso di Successo</p>
                  <p className="text-2xl font-bold">
                    {stats.total_proposals > 0 
                      ? Math.round((stats.accepted_proposals / stats.total_proposals) * 100)
                      : 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Streak Attuale</p>
                  <p className="text-2xl font-bold">{stats.current_streak}</p>
                </div>
                <Flame className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Badge Ottenuti</p>
                  <p className="text-2xl font-bold">{earnedBadges.length}</p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Level Progress */}
      {stats && (
        <LevelProgressBar 
          level={stats.level} 
          currentPoints={stats.total_points}
        />
      )}

      <Tabs defaultValue="badges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Badge
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Classifica
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistiche
          </TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-6">
          {earnedBadges.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-600">
                Badge Ottenuti ({earnedBadges.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {earnedBadges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </div>
          )}

          {unEarnedBadges.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
                Badge da Ottenere ({unEarnedBadges.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {unEarnedBadges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </div>
          )}

          {badges.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nessun badge disponibile</h3>
                <p className="text-muted-foreground">
                  I badge verranno caricati automaticamente quando saranno disponibili.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="leaderboard">
          <LeaderboardCard 
            leaderboard={leaderboard} 
            currentUserEmail={user?.email}
          />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Dettagli Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats ? (
                  <>
                    <div className="flex justify-between">
                      <span>Proposte Inviate:</span>
                      <span className="font-semibold">{stats.total_proposals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Proposte Accettate:</span>
                      <span className="font-semibold">{stats.accepted_proposals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tasso di Successo:</span>
                      <span className="font-semibold">
                        {stats.total_proposals > 0 
                          ? Math.round((stats.accepted_proposals / stats.total_proposals) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Streak Migliore:</span>
                      <span className="font-semibold">{stats.best_streak} giorni</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ultima Proposta:</span>
                      <span className="font-semibold">
                        {stats.last_proposal_date 
                          ? new Date(stats.last_proposal_date).toLocaleDateString('it-IT')
                          : 'Mai'
                        }
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    Inizia a inviare proposte per vedere le tue statistiche!
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progressi</CardTitle>
              </CardHeader>
              <CardContent>
                {stats ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Livello {stats.level}</span>
                        <span>{stats.total_points} punti</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Continue così per sbloccare nuovi badge e livelli!
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Nessun dato di progressione disponibile.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}