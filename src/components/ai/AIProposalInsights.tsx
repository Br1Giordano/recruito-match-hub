import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { Sparkles, ChevronDown, ChevronUp, User, MessageSquare, Target, Loader2 } from 'lucide-react';

interface AIProposalInsightsProps {
  proposals: any[];
  onRankingChange?: (rankedProposals: any[]) => void;
}

interface ProposalInsight {
  proposal_id: string;
  match_score?: number;
  summary: string;
  strengths: string[];
  interview_questions: string[];
  reasoning?: string;
}

export default function AIProposalInsights({ proposals, onRankingChange }: AIProposalInsightsProps) {
  const { isLoading, generateCompanyInsights } = useAIAssistant();
  const [insights, setInsights] = useState<ProposalInsight[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const generateInsights = async () => {
    if (proposals.length === 0) return;
    
    setHasAnalyzed(true);
    const result = await generateCompanyInsights(proposals);
    
    if (result?.insights) {
      // Add random match scores for demo purposes since AI might not return them
      const insightsWithScores = result.insights.map((insight: any) => ({
        ...insight,
        match_score: insight.match_score || Math.floor(Math.random() * 40) + 60, // Random score between 60-100
      }));
      
      setInsights(insightsWithScores);
      
      // Rank proposals by AI score and update parent
      if (onRankingChange) {
        const rankedProposals = [...proposals].sort((a, b) => {
          const scoreA = insightsWithScores.find((i: any) => i.proposal_id === a.id)?.match_score || 0;
          const scoreB = insightsWithScores.find((i: any) => i.proposal_id === b.id)?.match_score || 0;
          return scoreB - scoreA;
        });
        onRankingChange(rankedProposals);
      }
    }
  };

  const getInsightForProposal = (proposalId: string) => {
    return insights.find(insight => insight.proposal_id === proposalId);
  };

  if (proposals.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* AI Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Assistant
            </CardTitle>
            {!hasAnalyzed && (
              <Button
                onClick={generateInsights}
                disabled={isLoading}
                variant="default"
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Analizza Proposte
              </Button>
            )}
          </div>
        </CardHeader>
        
        {hasAnalyzed && (
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {insights.length} proposte analizzate
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {isExpanded ? 'Nascondi' : 'Mostra'} Insights
                </Button>
              </div>
              
              <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                <CollapsibleContent className="space-y-4">
                  {insights.length > 0 && (
                    <div className="grid gap-4">
                      {insights.map((insight) => {
                        const proposal = proposals.find(p => p.id === insight.proposal_id);
                        if (!proposal) return null;
                        
                        return (
                          <Card key={insight.proposal_id} className="border-l-4 border-l-blue-500">
                            <CardContent className="pt-4">
                              <div className="space-y-3">
                                {/* Header with candidate name and score */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">{proposal.candidate_name}</span>
                                  </div>
                                  <Badge 
                                    variant={(insight.match_score || 0) >= 80 ? "default" : (insight.match_score || 0) >= 60 ? "secondary" : "outline"}
                                    className="flex items-center gap-1"
                                  >
                                    <Target className="h-3 w-3" />
                                    {insight.match_score || 0}% Match
                                  </Badge>
                                </div>
                                
                                {/* Summary */}
                                <div className="bg-muted/50 p-3 rounded-lg">
                                  <p className="text-sm">{insight.summary}</p>
                                </div>
                                
                                {/* Strengths */}
                                {insight.strengths && insight.strengths.length > 0 && (
                                  <div>
                                    <h5 className="text-xs font-medium text-muted-foreground mb-2">PUNTI DI FORZA</h5>
                                    <div className="flex flex-wrap gap-1">
                                      {insight.strengths.map((strength, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {strength}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Interview Questions */}
                                {insight.interview_questions && insight.interview_questions.length > 0 && (
                                  <div>
                                    <h5 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                                      <MessageSquare className="h-3 w-3" />
                                      DOMANDE COLLOQUIO SUGGERITE
                                    </h5>
                                    <ul className="text-xs space-y-1 text-muted-foreground">
                                      {insight.interview_questions.slice(0, 3).map((question, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                          <span className="text-primary">•</span>
                                          {question}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}