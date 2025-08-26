import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Edit,
  Pause,
  Play,
  Trash2,
  MapPin,
  Euro,
  Clock,
  Briefcase,
  Users,
  Calendar
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useJobOfferInterestCounts } from "@/hooks/useJobOfferInterestCounts";
import CompanyOfferDetailsDrawer from "./CompanyOfferDetailsDrawer";
import { Database } from "@/integrations/supabase/types";

type CompanyJobOffer = Database['public']['Tables']['job_offers']['Row'];

interface CompactCompanyOfferCardProps {
  offer: CompanyJobOffer;
  onEdit: (offer: CompanyJobOffer) => void;
  onDeactivate: (offerId: string, title: string) => void;
  onReactivate: (offerId: string, title: string) => void;
  onDelete: (offerId: string, title: string) => void;
  isAdmin?: boolean;
}

export default function CompactCompanyOfferCard({ 
  offer, 
  onEdit, 
  onDeactivate, 
  onReactivate, 
  onDelete, 
  isAdmin = false 
}: CompactCompanyOfferCardProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const { getInterestCount } = useJobOfferInterestCounts([offer.id]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "closed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Attiva";
      case "paused":
        return "In Pausa";
      case "closed":
        return "Chiusa";
      default:
        return status;
    }
  };

  const getEmploymentTypeText = (type?: string) => {
    switch (type) {
      case "full-time":
        return "Tempo Pieno";
      case "part-time":
        return "Part-time";
      case "contract":
        return "Contratto";
      case "internship":
        return "Stage";
      default:
        return type || "Non specificato";
    }
  };

  const getSalaryText = () => {
    if (offer.salary_min && offer.salary_max) {
      return `€${offer.salary_min.toLocaleString()} - €${offer.salary_max.toLocaleString()}`;
    } else if (offer.salary_min) {
      return `Da €${offer.salary_min.toLocaleString()}`;
    } else if (offer.salary_max) {
      return `Fino a €${offer.salary_max.toLocaleString()}`;
    }
    return null;
  };

  const interestCount = getInterestCount(offer.id);

  return (
    <TooltipProvider>
      <Card className="relative overflow-hidden border border-gray-200 hover:border-primary/20 hover:shadow-md transition-all duration-200 bg-white">
        <CardContent className="p-4">
          {/* Prima riga: Titolo e Badge Status */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base leading-tight text-gray-900 truncate">
                {offer.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {offer.company_name && (
                  <span className="text-sm text-gray-600">{offer.company_name}</span>
                )}
                {isAdmin && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                    Admin
                  </Badge>
                )}
              </div>
            </div>
            <Badge className={`${getStatusColor(offer.status || 'active')} text-xs font-medium`}>
              {getStatusText(offer.status || 'active')}
            </Badge>
          </div>

          {/* Seconda riga: Informazioni chiave */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            {offer.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{offer.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{getEmploymentTypeText(offer.employment_type)}</span>
            </div>
            {interestCount > 0 && (
              <div className="flex items-center gap-1 text-blue-600">
                <Users className="h-4 w-4" />
                <span>{interestCount} interessat{interestCount !== 1 ? 'i' : 'o'}</span>
              </div>
            )}
          </div>

          {/* Terza riga: Salary e data */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm">
              {getSalaryText() && (
                <div className="flex items-center gap-1 text-green-700 font-medium">
                  <Euro className="h-4 w-4" />
                  <span>{getSalaryText()}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{new Date(offer.created_at).toLocaleDateString('it-IT')}</span>
              </div>
            </div>
          </div>

          {/* Descrizione (se disponibile) */}
          {offer.description && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {offer.description}
              </p>
            </div>
          )}

          {/* Azioni */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDrawerOpen(true)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Dettagli
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Visualizza dettagli completi</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(offer)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Modifica
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Modifica offerta</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center gap-1">
              {offer.status === 'active' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDeactivate(offer.id, offer.title)}
                      className="border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      <Pause className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Metti in pausa</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {offer.status === 'paused' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onReactivate(offer.id, offer.title)}
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Riattiva</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDelete(offer.id, offer.title)}
                    className="border-red-200 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Elimina offerta</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drawer per i dettagli */}
      <CompanyOfferDetailsDrawer
        offer={offer}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        interestCount={interestCount}
        isAdmin={isAdmin}
      />
    </TooltipProvider>
  );
}