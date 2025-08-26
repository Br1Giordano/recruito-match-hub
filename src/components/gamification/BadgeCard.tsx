import { Badge } from '@/hooks/useRecruiterGamification';
import { Card, CardContent } from '@/components/ui/card';
import { Badge as BadgeComponent } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeCardProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  progress?: number; // Progress verso il prossimo tier (0-100)
  currentTier?: 'bronze' | 'silver' | 'gold' | 'none';
  nextTierValue?: number; // Valore per raggiungere il prossimo tier
  currentValue?: number; // Valore attuale
}

export default function BadgeCard({ 
  badge, 
  size = 'md', 
  progress = 0, 
  currentTier = 'none',
  nextTierValue,
  currentValue 
}: BadgeCardProps) {
  const IconComponent = (LucideIcons as any)[badge.icon] || LucideIcons.Award;
  const isEarned = !!badge.earned_at;

  // Colori tier specifici
  const tierColors = {
    bronze: {
      bg: 'bg-gradient-to-br from-[#C98A55]/10 to-[#C98A55]/20',
      border: 'border-[#C98A55]/30',
      icon: 'text-[#C98A55]',
      badge: 'bg-[#C98A55] text-white'
    },
    silver: {
      bg: 'bg-gradient-to-br from-[#C8CCD4]/10 to-[#C8CCD4]/20',
      border: 'border-[#C8CCD4]/30',
      icon: 'text-[#C8CCD4]',
      badge: 'bg-[#C8CCD4] text-gray-800'
    },
    gold: {
      bg: 'bg-gradient-to-br from-[#F6C34A]/10 to-[#F6C34A]/20',
      border: 'border-[#F6C34A]/30',
      icon: 'text-[#F6C34A]',
      badge: 'bg-[#F6C34A] text-gray-800'
    },
    none: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: 'text-gray-400',
      badge: 'bg-gray-300 text-gray-600'
    }
  };

  const categoryLabels = {
    outcome: 'Risultati',
    quality: 'Qualità',
    efficiency: 'Efficienza',
    reliability: 'Affidabilità',
    specialty: 'Specialità'
  };

  const getTierLabel = (name: string) => {
    if (name.includes('Bronze')) return 'Bronzo';
    if (name.includes('Silver')) return 'Argento';
    if (name.includes('Gold')) return 'Oro';
    return '';
  };

  const getBadgeBaseName = (name: string) => {
    return name.replace(/ (Bronze|Silver|Gold)$/, '');
  };

  const getPeriodLabel = (requirementType: string) => {
    if (['hires_12m', 'hard_roles_12m', 'domains_12m'].includes(requirementType)) {
      return 'Rolling 365g';
    }
    if (['time_to_shortlist', 'reply_time', 'compliance_incidents', 'activity_streak'].includes(requirementType)) {
      return 'Rolling 90g';
    }
    return 'Continuo';
  };

  const getProgressText = () => {
    if (isEarned) return 'Ottenuto';
    if (nextTierValue && currentValue !== undefined) {
      const remaining = nextTierValue - currentValue;
      return `Mancano ${remaining} per il prossimo tier`;
    }
    return 'In progresso';
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const currentTierStyle = isEarned ? tierColors[currentTier] : tierColors.none;

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      currentTierStyle.bg,
      currentTierStyle.border,
      !isEarned && "opacity-60",
      sizeClasses[size]
    )}>
      <CardContent className="p-0 space-y-3">
        {/* Header con icona categoria e tier */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconComponent 
              size={iconSizes[size]} 
              className={currentTierStyle.icon}
            />
            <div className="text-xs text-muted-foreground font-medium">
              {categoryLabels[badge.category] || badge.category}
            </div>
          </div>
          {isEarned && (
            <BadgeComponent className={`text-xs font-semibold ${currentTierStyle.badge}`}>
              {getTierLabel(badge.name)}
            </BadgeComponent>
          )}
        </div>
        
        {/* Nome e descrizione */}
        <div>
          <h3 className={cn(
            "font-semibold leading-tight",
            size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
          )}>
            {getBadgeBaseName(badge.name)}
          </h3>
          <p className={cn(
            "text-muted-foreground leading-relaxed",
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}>
            {badge.description}
          </p>
        </div>

        {/* Periodo e punti */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">
            {getPeriodLabel(badge.requirement_type)}
          </span>
          <span className="font-semibold text-primary">
            {badge.points} punti
          </span>
        </div>

        {/* Progress bar e status */}
        <div className="space-y-2">
          {!isEarned && (
            <div className="space-y-1">
              <Progress 
                value={progress} 
                className="h-2"
              />
              <div className="text-xs text-muted-foreground text-center">
                {getProgressText()}
              </div>
            </div>
          )}
          
          {isEarned && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 font-medium text-sm">
                <LucideIcons.CheckCircle2 className="h-4 w-4" />
                Completato
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}