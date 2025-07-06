
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp } from "lucide-react";

interface RecruiterAvatarProps {
  avatarUrl?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  stats?: {
    interestedProposals: number;
    averageRating: number;
    totalReviews: number;
  };
  showStats?: boolean;
}

export default function RecruiterAvatar({ 
  avatarUrl, 
  name, 
  size = 'md', 
  stats,
  showStats = false 
}: RecruiterAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-2xl'
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className={`bg-blue-100 text-blue-600 font-semibold ${textSizeClasses[size]}`}>
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        
        {showStats && stats && stats.averageRating > 0 && (
          <Badge 
            variant="secondary" 
            className="absolute -bottom-1 -right-1 px-1 py-0 text-xs bg-yellow-100 text-yellow-800"
          >
            <Star className="h-3 w-3 fill-current mr-0.5" />
            {stats.averageRating.toFixed(1)}
          </Badge>
        )}
      </div>
      
      {showStats && stats && (
        <div className="flex gap-2">
          {stats.interestedProposals > 0 && (
            <Badge variant="outline" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats.interestedProposals} interessati
            </Badge>
          )}
          
          {stats.totalReviews > 0 && (
            <Badge variant="outline" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              {stats.totalReviews} recensioni
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
