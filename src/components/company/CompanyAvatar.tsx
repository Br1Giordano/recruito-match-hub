import { Building2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CompanyAvatarProps {
  logoUrl?: string | null;
  companyName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function CompanyAvatar({ 
  logoUrl, 
  companyName, 
  size = 'md', 
  className = '' 
}: CompanyAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const initials = companyName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {logoUrl ? (
        <AvatarImage src={logoUrl} alt={`${companyName} logo`} />
      ) : null}
      <AvatarFallback className="bg-recruito-teal text-white">
        {initials || <Building2 className={iconSizes[size]} />}
      </AvatarFallback>
    </Avatar>
  );
}