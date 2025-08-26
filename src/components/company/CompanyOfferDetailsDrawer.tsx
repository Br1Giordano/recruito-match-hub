import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription 
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin,
  Euro,
  Clock,
  Briefcase,
  Users,
  Calendar,
  Building2,
  Mail,
  Shield
} from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type CompanyJobOffer = Database['public']['Tables']['job_offers']['Row'];

interface CompanyOfferDetailsDrawerProps {
  offer: CompanyJobOffer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interestCount: number;
  isAdmin?: boolean;
}

export default function CompanyOfferDetailsDrawer({ 
  offer, 
  open, 
  onOpenChange, 
  interestCount,
  isAdmin = false 
}: CompanyOfferDetailsDrawerProps) {
  
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
    return "Non specificato";
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b bg-gray-50/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DrawerTitle className="text-xl font-semibold text-left">
                {offer.title}
              </DrawerTitle>
              <DrawerDescription className="text-left mt-1">
                <div className="flex items-center gap-4 text-sm">
                  {offer.company_name && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {offer.company_name}
                    </span>
                  )}
                  {offer.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {offer.location}
                    </span>
                  )}
                  {isAdmin && offer.contact_email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {offer.contact_email}
                    </span>
                  )}
                </div>
              </DrawerDescription>
            </div>
            <div className="flex items-center gap-2 ml-4">
              {isAdmin && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
              <Badge className={`${getStatusColor(offer.status || 'active')} font-medium`}>
                {getStatusText(offer.status || 'active')}
              </Badge>
            </div>
          </div>
        </DrawerHeader>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Informazioni base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Dettagli Posizione</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium">{getEmploymentTypeText(offer.employment_type)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Euro className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Retribuzione:</span>
                      <span className="font-medium text-green-700">{getSalaryText()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Recruiter interessati:</span>
                      <span className="font-medium text-blue-600">
                        {interestCount} {interestCount !== 1 ? 'interessati' : 'interessato'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Informazioni Pubblicazione</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Pubblicata:</span>
                      <span className="font-medium">
                        {new Date(offer.created_at).toLocaleDateString('it-IT')}
                      </span>
                    </div>
                    {offer.updated_at !== offer.created_at && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Aggiornata:</span>
                        <span className="font-medium">
                          {new Date(offer.updated_at).toLocaleDateString('it-IT')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Descrizione */}
            {offer.description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Descrizione</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {offer.description}
                  </p>
                </div>
              </div>
            )}

            {/* Requisiti */}
            {offer.requirements && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Requisiti</h3>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-sm text-blue-900 leading-relaxed whitespace-pre-wrap">
                    {offer.requirements}
                  </p>
                </div>
              </div>
            )}

            {/* Benefici */}
            {offer.benefits && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Benefici</h3>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <p className="text-sm text-green-900 leading-relaxed whitespace-pre-wrap">
                    {offer.benefits}
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}