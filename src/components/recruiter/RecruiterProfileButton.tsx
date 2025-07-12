
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
import DeleteAccountDialog from '../account/DeleteAccountDialog';
import { useRecruiterProfile } from '@/hooks/useRecruiterProfile';
import { useAuth } from '@/hooks/useAuth';

export default function RecruiterProfileButton() {
  const [showProfile, setShowProfile] = useState(false);
  const { profile, loading } = useRecruiterProfile();
  const { signOut, userProfile } = useAuth();

  console.log('RecruiterProfileButton - profile:', profile, 'loading:', loading);

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  // Se non c'è profilo, mostra comunque un menu funzionale con i dati base dell'utente
  const displayName = profile ? `${profile.nome} ${profile.cognome}` : 'Recruiter';
  const displayCompany = profile?.azienda || 'Account Recruiter';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
            <RecruiterAvatar
              avatarUrl={profile?.avatar_url}
              name={displayName}
              size="sm"
            />
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium">
                {displayName}
              </div>
              <div className="text-xs text-gray-500">
                {displayCompany}
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
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleSignOut} 
            className="cursor-pointer hover:bg-gray-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Esci dall'account
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DeleteAccountDialog trigger={
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-red-50 text-red-600 focus:text-red-600"
              onSelect={(e) => e.preventDefault()}
            >
              <Settings className="mr-2 h-4 w-4" />
              Gestione account
            </DropdownMenuItem>
          } />
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mostra sempre il modal, anche se il profilo non esiste ancora */}
      <RecruiterProfileModal 
        open={showProfile} 
        onOpenChange={setShowProfile} 
      />
    </>
  );
}
