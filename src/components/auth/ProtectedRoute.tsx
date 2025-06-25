
import { useAuth } from "@/hooks/useAuth";
import AuthPage from "./AuthPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  onBack?: () => void;
}

export default function ProtectedRoute({ children, onBack }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Caricamento...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onBack={onBack} />;
  }

  return <>{children}</>;
}
</ProtectedRoute>
