
import { useAuth } from "@/hooks/useAuth";
import AuthPage from "./AuthPage";
import DashboardMaintenancePage from "../DashboardMaintenancePage";
import { DASHBOARD_MAINTENANCE_MODE } from "@/App";

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

  // Se la manutenzione delle dashboard è attiva, mostra la pagina di manutenzione
  if (DASHBOARD_MAINTENANCE_MODE) {
    return <DashboardMaintenancePage />;
  }

  if (!user) {
    return <AuthPage onBack={onBack} />;
  }

  return <>{children}</>;
}
