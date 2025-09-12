import { Badge } from '@/hooks/useRecruiterGamification';
import { Card, CardContent } from '@/components/ui/card';
import { Badge as BadgeComponent } from '@/components/ui/badge';
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
  const IconComponent = (LucideIcons as any)[badge.icon] || LucideIcons.Award;
  const isEarned = !!badge.earned_at;

  // Simplified color system for earned vs unearned
  const colors = isEarned ? {
    bg: 'bg-gradient-to-br from-emerald-50 to-green-100',
    border: 'border-emerald-200',
    icon: 'text-emerald-600',
    badge: 'bg-emerald-600 text-white'
  } : {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    icon: 'text-gray-400',
    badge: 'bg-gray-300 text-gray-600'
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

  // Get Italian name and description
  const getAchievementInfo = (name: string) => {
    const cleanName = getCleanBadgeName(name);
    const translation = achievementTranslations[cleanName];
    
    return {
      name: translation?.name || cleanName,
      description: translation?.description || badge.description
    };
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
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg hover:scale-105",
      colors.bg,
      colors.border,
      !isEarned && "opacity-70",
      sizeClasses[size]
    )}>
      <CardContent className="p-0 space-y-4">
        {/* Header with icon and category */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              isEarned ? "bg-emerald-100" : "bg-gray-100"
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
              Ottenuto
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
  );
}