
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import RecruiterAvatar from './RecruiterAvatar';
import RecruiterProfileModal from './RecruiterProfileModal';
import { useRecruiterProfile } from '@/hooks/useRecruiterProfile';
import { useAuth } from '@/hooks/useAuth';

export default function RecruiterProfileButton() {
  const [showProfile, setShowProfile] = useState(false);
  const { profile, loading } = useRecruiterProfile();
  const { signOut } = useAuth();

  console.log('RecruiterProfileButton - profile:', profile, 'loading:', loading);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!profile) {
    console.log('No profile found for recruiter');
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-gray-500" />
        </div>
        <span className="text-sm text-gray-500">Caricamento profilo...</span>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
            <RecruiterAvatar
              avatarUrl={profile.avatar_url}
              name={`${profile.nome} ${profile.cognome}`}
              size="sm"
            />
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium">
                {profile.nome} {profile.cognome}
              </div>
              <div className="text-xs text-gray-500">
                {profile.azienda || 'Recruiter'}
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setShowProfile(true)}>
            <User className="mr-2 h-4 w-4" />
            Il mio profilo
          </DropdownMenuItem>
          
          <DropdownMenuItem disabled>
            <Settings className="mr-2 h-4 w-4" />
            Impostazioni
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Esci dall'account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RecruiterProfileModal 
        open={showProfile} 
        onOpenChange={setShowProfile} 
      />
    </>
  );
}
