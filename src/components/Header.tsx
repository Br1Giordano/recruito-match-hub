import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import MobileMenu from "./MobileMenu";
import RecruiterProfileButton from "./recruiter/RecruiterProfileButton";
import { MessageIcon } from "./messaging/MessageIcon";
import { MessageCenter } from "./messaging/MessageCenter";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import { Building2 } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onShowAuth?: () => void;
  onShowDashboard?: () => void;
}

const Header = ({ onShowAuth, onShowDashboard }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [isMessageCenterOpen, setIsMessageCenterOpen] = useState(false);
  const { hasNewMessages, clearMessageNotifications } = useRealTimeNotifications();

  const handleOpenMessageCenter = () => {
    setIsMessageCenterOpen(true);
    clearMessageNotifications();
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img 
              src="/lovable-uploads/2b14001c-d6fa-47cf-84de-a64fba53c4fb.png" 
              alt="Recruito Logo" 
              className="h-12 w-auto cursor-pointer"
            />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => navigate('/')} 
            className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            Home
          </button>
          <button 
            onClick={() => navigate('/recruiter')} 
            className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            Per Recruiter
          </button>
          <button 
            onClick={() => navigate('/aziende')} 
            className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            Per Aziende
          </button>
          
          <div className="flex items-center space-x-4 ml-8">
            {/* Se l'utente è autenticato, mostra il profilo o i pulsanti in base al tipo utente */}
            {user && userProfile ? (
              <>
                <MessageIcon onClick={handleOpenMessageCenter} hasNotification={hasNewMessages} />
                {userProfile.user_type === 'recruiter' ? (
                  <RecruiterProfileButton />
                ) : (
                  <Button
                    onClick={onShowDashboard}
                    size="sm"
                    className="gradient-recruito text-white border-0 hover:opacity-90 flex items-center gap-2"
                  >
                    <Building2 className="h-4 w-4" />
                    Dashboard Azienda
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  onClick={user ? onShowDashboard : onShowAuth}
                  size="sm"
                  className="gradient-primary text-white border-0 hover:opacity-90"
                >
                  {user ? "Dashboard" : "Registrati"}
                </Button>
              </>
            )}
          </div>
        </nav>

        <div className="flex items-center space-x-2">
          <MobileMenu />
        </div>
      </div>
      
      {user && userProfile && (
        <MessageCenter
          isOpen={isMessageCenterOpen}
          onClose={() => setIsMessageCenterOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
