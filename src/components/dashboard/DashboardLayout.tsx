import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  ChevronDown, 
  LogOut, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Inbox,
  BarChart3,
  List,
  Layout
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface KPIData {
  conversionRate: number;
  avgResponseTime: number;
  activeProposals: number;
  totalReceived: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  kpiData: KPIData;
  currentView: 'kanban' | 'list';
  onViewChange: (view: 'kanban' | 'list') => void;
  onNewJobOffer: () => void;
  showProposals: boolean;
  onToggleSection: (section: 'proposals' | 'offers') => void;
}

export default function DashboardLayout({
  children,
  kpiData,
  currentView,
  onViewChange,
  onNewJobOffer,
  showProposals,
  onToggleSection
}: DashboardLayoutProps) {
  const [kpiCollapsed, setKpiCollapsed] = useState(false);
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-kpi-bg">
      {/* HEADER - Sticky 64px */}
      <header className="sticky top-0 z-50 h-16 bg-white border-b border-gray-200 px-6">
        <div className="flex items-center justify-between h-full">
          {/* Logo + Breadcrumb */}
          <div className="flex items-center space-x-4">
            <div className="text-xl font-bold text-gradient">Recruito</div>
            <div className="text-gray-400">/</div>
            <div className="text-sm text-gray-600">Dashboard Azienda</div>
          </div>

          {/* Switch Section */}
          <div className="flex items-center space-x-2">
            <Button
              variant={showProposals ? "default" : "ghost"}
              size="sm"
              onClick={() => onToggleSection('proposals')}
            >
              Proposte
            </Button>
            <Button
              variant={!showProposals ? "default" : "ghost"}
              size="sm"
              onClick={() => onToggleSection('offers')}
            >
              Le mie Offerte
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewJobOffer}
              className="text-gray-600 hover:text-gray-900"
            >
              <Plus className="w-4 h-4 mr-2" />
              Pubblica nuova offerta
            </Button>
            
            <Avatar className="w-8 h-8 cursor-pointer" onClick={handleLogout}>
              <AvatarImage src="" />
              <AvatarFallback className="text-xs">
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* KPI STRIP - Collapsible */}
      <div className={cn(
        "bg-kpi-bg border-b border-gray-200 transition-all duration-300",
        kpiCollapsed ? "h-12" : "h-24"
      )}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-700">Panoramica</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setKpiCollapsed(!kpiCollapsed)}
            >
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                kpiCollapsed && "rotate-180"
              )} />
            </Button>
          </div>
          
          {!kpiCollapsed && (
            <div className="grid grid-cols-4 gap-6">
              {/* Tasso Conversione */}
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tasso Conversione</p>
                    <p className="text-2xl font-semibold">{kpiData.conversionRate}%</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Tempo Risposta */}
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tempo Risposta</p>
                    <p className="text-2xl font-semibold">{kpiData.avgResponseTime}h</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Proposte Attive */}
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Proposte Attive</p>
                    <p className="text-2xl font-semibold">{kpiData.activeProposals}</p>
                  </div>
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Totale Ricevute */}
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Totale Ricevute</p>
                    <p className="text-2xl font-semibold">{kpiData.totalReceived}</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Inbox className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TOGGLE VISTA */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center space-x-2">
          <Button
            variant={currentView === 'kanban' ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange('kanban')}
            className="hidden md:flex"
          >
            <Layout className="w-4 h-4 mr-2" />
            Kanban
          </Button>
          <Button
            variant={currentView === 'list' ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange('list')}
          >
            <List className="w-4 h-4 mr-2" />
            Lista compatta
          </Button>
        </div>
      </div>

      {/* CONTENT */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}