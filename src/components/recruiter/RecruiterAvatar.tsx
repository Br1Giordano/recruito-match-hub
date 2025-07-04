
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecruiterAvatarProps {
  avatarUrl?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  onUpload?: (file: File) => void;
  isUploading?: boolean;
  editable?: boolean;
}

export default function RecruiterAvatar({ 
  avatarUrl, 
  name, 
  size = 'md', 
  onUpload, 
  isUploading = false,
  editable = false 
}: RecruiterAvatarProps) {
  const [dragActive, setDragActive] = useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-24 w-24'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  if (!editable) {
    return (
      <Avatar className={cn(sizeClasses[size])}>
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback className="bg-recruito-blue text-white">
          {avatarUrl ? <User className="h-4 w-4" /> : getInitials(name)}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className="relative group">
      <div
        className={cn(
          "relative rounded-full overflow-hidden border-2 border-dashed border-transparent transition-all",
          dragActive && "border-recruito-blue bg-recruito-blue/5"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <Avatar className={cn(sizeClasses[size])}>
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-recruito-blue text-white">
            {avatarUrl ? <User className="h-4 w-4" /> : getInitials(name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="h-6 w-6 text-white" />
        </div>
      </div>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        disabled={isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
        </div>
      )}
    </div>
  );
}
