
import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-recruito-blue/10 via-recruito-teal/10 to-recruito-green/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-recruito-blue/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-recruito-teal/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-recruito-green/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Recruito</h1>
          <p className="text-muted-foreground text-lg">Connecting talent with opportunity</p>
        </div>
        
        {/* Modern Loading Animation */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="w-20 h-20 border-4 border-recruito-blue/20 rounded-full animate-spin"></div>
            {/* Inner rotating ring */}
            <div className="absolute inset-2 w-16 h-16 border-4 border-t-recruito-teal border-r-recruito-green border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-recruito-blue animate-spin" style={{ animationDuration: '2s' }} />
            </div>
          </div>
          
          {/* Loading text with dots animation */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-gray-700">Caricamento</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-recruito-blue rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-recruito-teal rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-recruito-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
        
        {/* Progress indicators */}
        <div className="mt-8 space-y-3">
          <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full gradient-recruito rounded-full animate-[slide-in_2s_ease-in-out_infinite]"></div>
          </div>
          <p className="text-sm text-muted-foreground">Preparazione dell'ambiente...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
