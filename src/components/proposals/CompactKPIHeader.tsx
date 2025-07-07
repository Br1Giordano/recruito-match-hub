
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Clock, FileText, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPI {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  color: string;
}

interface CompactKPIHeaderProps {
  totalProposals: number;
  activeProposals: number;
  avgResponseTime: number; // in hours
  className?: string;
}

export default function CompactKPIHeader({ 
  totalProposals, 
  activeProposals, 
  avgResponseTime,
  className 
}: CompactKPIHeaderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const formatResponseTime = (hours: number) => {
    if (hours < 24) {
      return `${Math.round(hours)}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return remainingHours > 0 ? `${days}g ${remainingHours}h` : `${days}g`;
  };

  const kpis: KPI[] = [
    {
      label: "Tempo Risposta",
      value: formatResponseTime(avgResponseTime),
      icon: Clock,
      trend: avgResponseTime < 24 ? "Ottimo" : avgResponseTime < 48 ? "Buono" : "Da migliorare",
      color: avgResponseTime < 24 ? "text-green-600" : avgResponseTime < 48 ? "text-yellow-600" : "text-red-600"
    },
    {
      label: "Proposte Attive",
      value: activeProposals.toString(),
      icon: Inbox,
      color: "text-blue-600"
    },
    {
      label: "Totale Ricevute",
      value: totalProposals.toString(),
      icon: FileText,
      color: "text-gray-600"
    }
  ];

  if (isCollapsed) {
    return (
      <div className={cn("border-b bg-white", className)}>
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {kpis.map((kpi, index) => (
                <div key={index} className="flex items-center gap-2">
                  <kpi.icon className={cn("h-4 w-4", kpi.color)} />
                  <span className="text-sm font-medium">{kpi.value}</span>
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
    <div className={cn("border-b bg-white", className)}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Panoramica Proposte</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
            className="h-8 px-2"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kpis.map((kpi, index) => (
            <Card key={index} className="border-0 shadow-sm bg-gray-50/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg bg-white", kpi.color)}>
                      <kpi.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{kpi.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                      {kpi.trend && (
                        <p className={cn("text-xs", kpi.color)}>{kpi.trend}</p>
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
