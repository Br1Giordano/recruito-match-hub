
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Clock, Inbox, FileText, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ATSKPIHeaderProps {
  totalProposals: number;
  activeProposals: number;
  avgResponseTime: number; // in hours
  conversionRate: number; // percentage
  className?: string;
}

export default function ATSKPIHeader({ 
  totalProposals, 
  activeProposals, 
  avgResponseTime,
  conversionRate,
  className 
}: ATSKPIHeaderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const formatResponseTime = (hours: number) => {
    if (hours < 24) {
      return `${Math.round(hours)}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return remainingHours > 0 ? `${days}g ${remainingHours}h` : `${days}g`;
  };

  const kpis = [
    {
      label: "Tempo Risposta",
      value: formatResponseTime(avgResponseTime),
      icon: Clock,
      trend: avgResponseTime < 24 ? "Ottimo" : avgResponseTime < 48 ? "Buono" : "Da migliorare",
      color: avgResponseTime < 24 ? "text-green-600" : avgResponseTime < 48 ? "text-yellow-600" : "text-red-600",
      bgColor: avgResponseTime < 24 ? "bg-green-50" : avgResponseTime < 48 ? "bg-yellow-50" : "bg-red-50"
    },
    {
      label: "Proposte Attive",
      value: activeProposals.toString(),
      icon: Inbox,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Totale Ricevute",
      value: totalProposals.toString(),
      icon: FileText,
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    },
    {
      label: "Tasso Conversione",
      value: `${conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      trend: conversionRate > 20 ? "Eccellente" : conversionRate > 10 ? "Buono" : "Da migliorare",
      color: conversionRate > 20 ? "text-green-600" : conversionRate > 10 ? "text-yellow-600" : "text-red-600",
      bgColor: conversionRate > 20 ? "bg-green-50" : conversionRate > 10 ? "bg-yellow-50" : "bg-red-50"
    }
  ];

  if (isCollapsed) {
    return (
      <div className={cn("border-b bg-white shadow-sm", className)}>
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {kpis.map((kpi, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={cn("p-1.5 rounded-lg", kpi.bgColor)}>
                    <kpi.icon className={cn("h-4 w-4", kpi.color)} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{kpi.value}</span>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(false)}
              className="h-8 px-2"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("border-b bg-white shadow-sm", className)}>
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard Candidature</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
            className="h-8 px-2"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", kpi.bgColor)}>
                      <kpi.icon className={cn("h-5 w-5", kpi.color)} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{kpi.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                      {kpi.trend && (
                        <p className={cn("text-xs font-medium", kpi.color)}>{kpi.trend}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
