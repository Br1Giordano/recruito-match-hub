import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Eye, 
  Mail, 
  StickyNote,
  Copy,
  CheckCircle2,
  Clock,
  XCircle,
  MoreHorizontal,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import ProposalDetailsDrawer from "./ProposalDetailsDrawer";
import { useRecruiterProfileByEmail } from "@/hooks/useRecruiterProfileByEmail";
import RecruiterProfileViewModal from "@/components/recruiter/RecruiterProfileViewModal";
import { useJobOfferInterestCounts } from "@/hooks/useJobOfferInterestCounts";

interface CompactRecruiterProposalCardProps {
  proposal: {
    id: string;
    candidate_name: string;
    candidate_email: string;
    candidate_phone?: string;
    candidate_linkedin?: string;
    candidate_cv_url?: string;
    proposal_description: string;
    years_experience?: number;
    expected_salary?: number;
    availability_weeks?: number;
    recruiter_fee_percentage?: number;
    status: string;
    created_at: string;
    recruiter_email?: string;
    recruiter_name?: string;
    job_offers?: {
      id?: string;
      title: string;
      company_name?: string;
    };
  };
}

export default function CompactRecruiterProposalCard({ proposal }: CompactRecruiterProposalCardProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [notes, setNotes] = useState("");
  const [showRecruiterProfile, setShowRecruiterProfile] = useState(false);
  const { profile: recruiterProfile, fetchProfileByEmail } = useRecruiterProfileByEmail();
  
  // Get interest count for the job offer
  const jobOfferId = proposal.job_offers?.id;
  const { getInterestCount } = useJobOfferInterestCounts(jobOfferId ? [jobOfferId] : []);

  const handleShowRecruiterProfile = async () => {
    if (proposal.recruiter_email) {
      await fetchProfileByEmail(proposal.recruiter_email);
      setShowRecruiterProfile(true);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const statusMap: { [key: string]: { label: string; color: string; bgColor: string; icon: any } } = {
    pending: { label: 'In Attesa', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: Clock },
    under_review: { label: 'In Revisione', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: Clock },
    approved: { label: 'Approvata', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle2 },
    rejected: { label: 'Rifiutata', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
    hired: { label: 'Assunto', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle2 },
  };

  const currentStatus = statusMap[proposal.status] || { 
    label: proposal.status, 
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: Clock 
  };

  const StatusIcon = currentStatus.icon;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(proposal.candidate_email);
      toast({
        description: "Email copiata",
      });
    } catch (err) {
      toast({
        description: "Errore nella copia dell'email",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const truncateDescription = (text: string | null | undefined, limit: number = 140) => {
    if (!text) return '';
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
  };

  // Extract tags from description (simplified approach)
  const extractTags = (description: string | null | undefined) => {
    if (!description) return [];
    const skills = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'PHP', 'Angular', 'Vue', 'CSS', 'HTML'];
    const foundSkills = skills.filter(skill => 
      description.toLowerCase().includes(skill.toLowerCase())
    );
    return foundSkills.slice(0, 2);
  };

  const tags = extractTags(proposal.proposal_description);
  const remainingTags = tags.length > 2 ? tags.length - 2 : 0;

  return (
    <>
      <Card className="p-3 hover:shadow-md hover:border-[#D9D9D9] transition-all duration-200 group">
        <CardContent className="p-0 space-y-2">
          {/* Riga 1: Avatar, Nome, Ruolo, Stato */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {getInitials(proposal.candidate_name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base leading-tight truncate max-w-[180px]">
                  {proposal.candidate_name}
                </h3>
              </div>

              {proposal.job_offers?.title && (
                <div className="hidden sm:block flex-shrink-0 max-w-[120px]">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 truncate">
                    {proposal.job_offers.title}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0 ml-2">
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${currentStatus.bgColor} ${currentStatus.color} whitespace-nowrap`}>
                <StatusIcon className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{currentStatus.label}</span>
              </div>
            </div>
          </div>

          {/* Riga 2: Email, Fee, Data, Tags */}
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={copyEmail}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors min-w-0 flex-shrink-0"
                  >
                    <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="text-xs truncate max-w-[150px]">{proposal.candidate_email}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clicca per copiare</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="h-3 w-px bg-[#EAEAEA] flex-shrink-0" />

            {proposal.recruiter_fee_percentage && (
              <>
                <span className="text-xs text-gray-600 flex-shrink-0 whitespace-nowrap">
                  🏷️ Fee {proposal.recruiter_fee_percentage}%
                </span>
                <div className="h-3 w-px bg-[#EAEAEA] flex-shrink-0" />
              </>
            )}

            <span className="text-xs text-gray-600 flex-shrink-0 whitespace-nowrap">
              🗓️ {formatDate(proposal.created_at)}
            </span>

            {jobOfferId && getInterestCount(jobOfferId) > 0 && (
              <>
                <div className="h-3 w-px bg-[#EAEAEA] flex-shrink-0" />
                <span className="text-xs text-blue-600 flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
                  <Users className="h-3 w-3" />
                  {getInterestCount(jobOfferId)} recruiter
                </span>
              </>
            )}

            {tags.length > 0 && (
              <>
                <div className="h-3 w-px bg-[#EAEAEA] flex-shrink-0" />
                <div className="flex items-center gap-1 flex-shrink-0">
                  {tags.slice(0, 1).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700 whitespace-nowrap">
                      🧩 {tag}
                    </span>
                  ))}
                  {(tags.length > 1 || remainingTags > 0) && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-5 px-1 text-xs flex-shrink-0">
                          +{tags.length - 1}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-2">
                        <div className="space-y-1">
                          {tags.slice(1).map((tag, index) => (
                            <div key={index} className="text-xs">{tag}</div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Riga 3: Descrizione e Azioni */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 break-words">
                {showFullDescription 
                  ? proposal.proposal_description 
                  : truncateDescription(proposal.proposal_description)
                }
                {proposal.proposal_description && proposal.proposal_description.length > 140 && (
                  <button 
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="ml-1 text-primary hover:text-primary/80 font-medium whitespace-nowrap"
                  >
                    {showFullDescription ? 'Chiudi' : 'Altro'}
                  </button>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0"
                      onClick={() => setIsDrawerOpen(true)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Dettagli</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0"
                      asChild
                    >
                      <a href={`mailto:${proposal.candidate_email}`}>
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Contatta</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <StickyNote className="h-3.5 w-3.5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3 bg-white border border-gray-200 shadow-lg z-50">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Note</h4>
                          <textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full h-20 p-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Aggiungi note per questo candidato..."
                          />
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              // TODO: Save notes to database
                              toast({
                                description: "Note salvate",
                              });
                            }}
                          >
                            Salva
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Note</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProposalDetailsDrawer 
        proposal={proposal}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <RecruiterProfileViewModal
        open={showRecruiterProfile}
        onOpenChange={setShowRecruiterProfile}
        profile={recruiterProfile}
      />
    </>
  );
}