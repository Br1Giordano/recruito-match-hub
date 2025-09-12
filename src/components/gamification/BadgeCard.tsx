import { useState } from 'react';
import { Badge } from '@/hooks/useRecruiterGamification';
import { Card, CardContent } from '@/components/ui/card';
import { Badge as BadgeComponent } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeCardProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
}

export default function BadgeCard({ 
  badge, 
  size = 'md'
}: BadgeCardProps) {
  const [showRequirements, setShowRequirements] = useState(false);
  const IconComponent = (LucideIcons as any)[badge.icon] || LucideIcons.Award;
  const isEarned = !!badge.earned_at;

  // Extract tier from badge name
  const getTier = (name: string) => {
    if (name.includes('Bronze')) return 'bronze';
    if (name.includes('Silver')) return 'silver'; 
    if (name.includes('Gold')) return 'gold';
    return 'bronze'; // Default tier
  };

  const tier = getTier(badge.name);

  // Tier-specific colors
  const tierColors = {
    bronze: {
      bg: 'bg-gradient-to-br from-amber-50 to-orange-100',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      badge: 'bg-amber-600 text-white',
      iconBg: 'bg-amber-100'
    },
    silver: {
      bg: 'bg-gradient-to-br from-gray-50 to-slate-100', 
      border: 'border-gray-300',
      icon: 'text-gray-600',
      badge: 'bg-gray-600 text-white',
      iconBg: 'bg-gray-100'
    },
    gold: {
      bg: 'bg-gradient-to-br from-yellow-50 to-amber-100',
      border: 'border-yellow-300',
      icon: 'text-yellow-600',
      badge: 'bg-yellow-600 text-white',
      iconBg: 'bg-yellow-100'
    }
  };

  const colors = isEarned ? tierColors[tier] : {
    bg: 'bg-gray-50',
    border: 'border-gray-200', 
    icon: 'text-gray-400',
    badge: 'bg-gray-300 text-gray-600',
    iconBg: 'bg-gray-100'
  };

  // Italian achievement names and descriptions
  const achievementTranslations = {
    'Closer': {
      name: 'Chiusure di Successo',
      description: 'Dimostra eccellenza nel finalizzare le posizioni con candidati di qualità'
    },
    'Shortlist Pro': {
      name: 'Selezioni Precise',
      description: 'Esperto nel presentare candidati che vengono selezionati dalle aziende'
    },
    'Hires Made': {
      name: 'Esperto di Assunzioni',
      description: 'Ha completato con successo numerose assunzioni'
    },
    'Retention 90d': {
      name: 'Candidati Duraturi',
      description: 'I tuoi candidati dimostrano grande stabilità nelle nuove posizioni'
    },
    'Client Love': {
      name: 'Apprezzato dai Clienti',
      description: 'Riceve costantemente valutazioni eccellenti dalle aziende'
    },
    'Speedrunner': {
      name: 'Velocità di Risposta',
      description: 'Risponde rapidamente alle richieste e gestisce i processi con efficienza'
    },
    'Lightning Reply': {
      name: 'Comunicazione Immediata',
      description: 'Mantiene una comunicazione costante e tempestiva con tutti i contatti'
    },
    'Clean Desk': {
      name: 'Organizzazione Impeccabile',
      description: 'Gestisce i propri processi con ordine e precisione'
    },
    'Consistency Streak': {
      name: 'Costanza nel Lavoro',
      description: 'Mantiene un rendimento costante e affidabile nel tempo'
    },
    'Hard Role Hunter': {
      name: 'Sfide Complesse',
      description: 'Specializzato nel gestire posizioni difficili e ricerche complesse'
    },
    'Multi-Domain': {
      name: 'Versatilità Settoriale',
      description: 'Opera con successo in diversi settori e ambiti professionali'
    },
    'Zero Spam': {
      name: 'Candidature di Qualità',
      description: 'Presenta solo candidati altamente qualificati e pertinenti'
    }
  };

  const categoryLabels = {
    outcome: 'Risultati',
    quality: 'Qualità', 
    efficiency: 'Efficienza',
    reliability: 'Affidabilità',
    specialty: 'Specialità'
  };

  // Get clean badge name without tier suffixes
  const getCleanBadgeName = (name: string) => {
    return name.replace(/ (Bronze|Silver|Gold)$/, '');
  };

  // Get tier label in Italian
  const getTierLabel = (name: string) => {
    if (name.includes('Bronze')) return 'Bronzo';
    if (name.includes('Silver')) return 'Argento';
    if (name.includes('Gold')) return 'Oro';
    return 'Bronzo';
  };

  // Get Italian name and description
  const getAchievementInfo = (name: string) => {
    const cleanName = getCleanBadgeName(name);
    const translation = achievementTranslations[cleanName];
    
    return {
      name: translation?.name || cleanName,
      description: translation?.description || badge.description
    };
  };

  // Get detailed requirements for the modal
  const getDetailedRequirements = () => {
    const cleanName = getCleanBadgeName(badge.name);
    const tierName = getTierLabel(badge.name);
    
    const requirements = {
      'Closer': {
        bronze: 'Chiudi almeno il 40% delle posizioni che gestisci',
        silver: 'Chiudi almeno il 60% delle posizioni che gestisci',
        gold: 'Chiudi almeno il 75% delle posizioni che gestisci'
      },
      'Shortlist Pro': {
        bronze: 'Il 25% dei tuoi candidati viene inserito in short-list',
        silver: 'Il 35% dei tuoi candidati viene inserito in short-list', 
        gold: 'Il 45% dei tuoi candidati viene inserito in short-list'
      },
      'Hires Made': {
        bronze: 'Completa almeno 3 assunzioni negli ultimi 12 mesi',
        silver: 'Completa almeno 8 assunzioni negli ultimi 12 mesi',
        gold: 'Completa almeno 15 assunzioni negli ultimi 12 mesi'
      },
      'Retention 90d': {
        bronze: 'L\'80% dei tuoi candidati rimane nel ruolo per almeno 90 giorni',
        silver: 'Il 90% dei tuoi candidati rimane nel ruolo per almeno 90 giorni',
        gold: 'Il 95% dei tuoi candidati rimane nel ruolo per almeno 90 giorni'
      },
      'Client Love': {
        bronze: 'Mantieni una valutazione media di 4.2 stelle dalle aziende',
        silver: 'Mantieni una valutazione media di 4.5 stelle dalle aziende',
        gold: 'Mantieni una valutazione media di 4.8 stelle dalle aziende'
      },
      'Speedrunner': {
        bronze: 'Completa le short-list entro 14 giorni dalla richiesta',
        silver: 'Completa le short-list entro 10 giorni dalla richiesta',
        gold: 'Completa le short-list entro 7 giorni dalla richiesta'
      },
      'Lightning Reply': {
        bronze: 'Rispondi alle comunicazioni entro 24 ore',
        silver: 'Rispondi alle comunicazioni entro 12 ore',
        gold: 'Rispondi alle comunicazioni entro 4 ore'
      },
      'Clean Desk': {
        bronze: 'Zero incidenti di compliance negli ultimi 30 giorni',
        silver: 'Zero incidenti di compliance negli ultimi 60 giorni',
        gold: 'Zero incidenti di compliance negli ultimi 120 giorni'
      },
      'Consistency Streak': {
        bronze: 'Mantieni attività costante per 4 settimane consecutive',
        silver: 'Mantieni attività costante per 8 settimane consecutive',
        gold: 'Mantieni attività costante per 12 settimane consecutive'
      },
      'Hard Role Hunter': {
        bronze: 'Completa almeno 1 posizione difficile negli ultimi 12 mesi',
        silver: 'Completa almeno 3 posizioni difficili negli ultimi 12 mesi',
        gold: 'Completa almeno 6 posizioni difficili negli ultimi 12 mesi'
      },
      'Multi-Domain': {
        bronze: 'Opera con successo in almeno 2 settori diversi',
        silver: 'Opera con successo in almeno 3 settori diversi',
        gold: 'Opera con successo in almeno 4 settori diversi'
      },
      'Zero Spam': {
        bronze: 'Massimo 40% di candidature non pertinenti',
        silver: 'Massimo 30% di candidature non pertinenti',
        gold: 'Massimo 20% di candidature non pertinenti'
      }
    };

    const badgeReqs = requirements[cleanName];
    if (!badgeReqs) return 'Requisiti non disponibili';

    const currentTier = tier.toLowerCase();
    return badgeReqs[currentTier] || 'Requisiti non disponibili';
  };

  const achievementInfo = getAchievementInfo(badge.name);

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4', 
    lg: 'p-6'
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 28
  };

  return (
    <>
      <Card 
        className={cn(
          "transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer",
          colors.bg,
          colors.border,
          !isEarned && "opacity-70",
          sizeClasses[size]
        )}
        onClick={() => setShowRequirements(true)}
      >
        <CardContent className="p-0 space-y-4">
          {/* Header with icon and category */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-full",
                colors.iconBg
              )}>
                <IconComponent 
                  size={iconSizes[size]} 
                  className={colors.icon}
                />
              </div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {categoryLabels[badge.category] || badge.category}
              </div>
            </div>
            
            {isEarned && (
              <BadgeComponent className={`text-xs font-semibold ${colors.badge}`}>
                {getTierLabel(badge.name)}
              </BadgeComponent>
            )}
          </div>
          
          {/* Achievement name and description */}
          <div className="space-y-2">
            <h3 className={cn(
              "font-bold leading-tight text-navy",
              size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
            )}>
              {achievementInfo.name}
            </h3>
            
            <p className={cn(
              "text-muted-foreground leading-relaxed",
              size === 'sm' ? 'text-xs' : 'text-sm'
            )}>
              {achievementInfo.description}
            </p>
          </div>

          {/* Status indicator */}
          <div className="pt-2 border-t border-current/10">
            {isEarned ? (
              <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium text-sm">
                <LucideIcons.CheckCircle2 className="h-4 w-4" />
                Achievement Completato
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm font-medium">
                In Progresso
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Requirements Modal */}
      <Dialog open={showRequirements} onOpenChange={setShowRequirements}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={cn("p-2 rounded-full", colors.iconBg)}>
                <IconComponent size={20} className={colors.icon} />
              </div>
              <div>
                <div className="text-lg font-bold">{achievementInfo.name}</div>
                <div className="text-sm text-muted-foreground font-normal">
                  {getTierLabel(badge.name)}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {achievementInfo.description}
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">Requisiti per ottenere questo badge:</h4>
              <p className="text-sm">{getDetailedRequirements()}</p>
            </div>
            
            {isEarned && (
              <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium text-sm bg-emerald-50 rounded-lg py-3">
                <LucideIcons.CheckCircle2 className="h-4 w-4" />
                Badge ottenuto con successo!
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}