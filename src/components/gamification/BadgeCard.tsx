import { Badge } from '@/hooks/useRecruiterGamification';
import { Card, CardContent } from '@/components/ui/card';
import { Badge as BadgeComponent } from '@/components/ui/badge';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeCardProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
}

export default function BadgeCard({ badge, size = 'md' }: BadgeCardProps) {
  const IconComponent = (LucideIcons as any)[badge.icon] || LucideIcons.Award;
  const isEarned = !!badge.earned_at;

  const rarityColors = {
    common: 'border-gray-300 bg-gray-50',
    rare: 'border-blue-300 bg-blue-50',
    epic: 'border-purple-300 bg-purple-50',
    legendary: 'border-yellow-300 bg-yellow-50'
  };

  const iconColors = {
    common: 'text-gray-600',
    rare: 'text-blue-600',
    epic: 'text-purple-600',
    legendary: 'text-yellow-600'
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 32
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:scale-105",
      isEarned ? rarityColors[badge.rarity] : "border-gray-200 bg-gray-100",
      !isEarned && "opacity-50 grayscale",
      sizeClasses[size]
    )}>
      <CardContent className="p-0 space-y-2">
        <div className="flex items-center justify-between">
          <IconComponent 
            size={iconSizes[size]} 
            className={cn(
              isEarned ? iconColors[badge.rarity] : "text-gray-400"
            )}
          />
          <BadgeComponent 
            variant={isEarned ? "default" : "secondary"}
            className={cn(
              "text-xs capitalize",
              isEarned && badge.rarity === 'legendary' && "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
              isEarned && badge.rarity === 'epic' && "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
              isEarned && badge.rarity === 'rare' && "bg-blue-500 text-white"
            )}
          >
            {badge.rarity}
          </BadgeComponent>
        </div>
        
        <div>
          <h3 className={cn(
            "font-semibold",
            size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
          )}>
            {badge.name}
          </h3>
          <p className={cn(
            "text-muted-foreground",
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}>
            {badge.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {badge.points} punti
          </span>
          {isEarned && (
            <span className="text-green-600 font-medium">
              ✓ Ottenuto
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}