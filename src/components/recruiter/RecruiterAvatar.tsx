
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface RecruiterAvatarProps {
  avatarUrl?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function RecruiterAvatar({ avatarUrl, name, size = 'md' }: RecruiterAvatarProps) {
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
    <Avatar className={sizeClasses[size]}>
      {avatarUrl && (
        <AvatarImage 
          src={avatarUrl} 
          alt={name}
          className="object-cover"
        />
      )}
      <AvatarFallback className={`bg-blue-100 text-blue-600 font-semibold ${textSizeClasses[size]}`}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
