
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, Target, Users } from "lucide-react";

interface ProposalKPIHeaderProps {
  proposals: any[];
}

export default function ProposalKPIHeader({ proposals }: ProposalKPIHeaderProps) {
  const totalProposals = proposals.length;
  const pendingProposals = proposals.filter(p => p.status === 'pending').length;
  const acceptedProposals = proposals.filter(p => p.status === 'accepted').length;
  const conversionRate = totalProposals > 0 ? ((acceptedProposals / totalProposals) * 100).toFixed(1) : '0';
  
  // Calcola tempo medio di risposta (simulato)
  const avgResponseTime = '2.3';
  
  const kpis = [
    {
      title: "Tasso Conversione",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Tempo Medio Risposta",
      value: `${avgResponseTime}gg`,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Proposte Attive",
      value: pendingProposals.toString(),
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Totale Ricevute",
      value: totalProposals.toString(),
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
