import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Conversation {
  id: string;
  proposal_id?: string;
  recruiter_email: string;
  company_email: string;
  last_message_at: string;
  created_at: string;
  unread_count?: number;
  other_party_name?: string;
  proposal_title?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_email: string;
  sender_type: 'recruiter' | 'company';
  message_content: string;
  attachment_url?: string;
  read_at?: string;
  created_at: string;
}

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const fetchConversations = async () => {
    if (!user?.email) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          proposals!inner(
            candidate_name,
            job_offers(title)
          )
        `)
        .or(`recruiter_email.eq.${user.email},company_email.eq.${user.email}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Get unread message counts for each conversation
      const conversationsWithUnread = await Promise.all(
        (data || []).map(async (conv) => {
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .neq('sender_email', user.email)
            .is('read_at', null);

          return {
            ...conv,
            unread_count: count || 0,
            other_party_name: conv.recruiter_email === user.email 
              ? conv.company_email 
              : conv.recruiter_email,
            proposal_title: conv.proposals?.job_offers?.title || conv.proposals?.candidate_name
          };
        })
      );

      setConversations(conversationsWithUnread);
      
      // Calculate total unread count
      const totalUnread = conversationsWithUnread.reduce(
        (total, conv) => total + (conv.unread_count || 0), 
        0
      );
      setUnreadCount(totalUnread);

    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le conversazioni",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const typedMessages: Message[] = (data || []).map(msg => ({
        id: msg.id,
        conversation_id: msg.conversation_id,
        sender_email: msg.sender_email,
        sender_type: msg.sender_type as 'recruiter' | 'company',
        message_content: msg.message_content,
        attachment_url: msg.attachment_url || undefined,
        read_at: msg.read_at || undefined,
        created_at: msg.created_at
      }));

      setMessages(prev => ({
        ...prev,
        [conversationId]: typedMessages
      }));

      // Mark messages as read if they're from the other party
      if (user?.email) {
        await supabase
          .from('messages')
          .update({ read_at: new Date().toISOString() })
          .eq('conversation_id', conversationId)
          .neq('sender_email', user.email)
          .is('read_at', null);

        // Refresh conversations to update unread counts
        fetchConversations();
      }

    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i messaggi",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (conversationId: string, content: string) => {
    if (!user?.email || !content.trim()) return false;

    try {
      // Get conversation details and user profile
      const [conversationResponse, userProfileResponse] = await Promise.all([
        supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .single(),
        supabase
          .from('user_profiles')
          .select('user_type')
          .eq('auth_user_id', user.id)
          .single()
      ]);

      if (conversationResponse.error || userProfileResponse.error) {
        throw new Error('Failed to get conversation or user details');
      }

      const conversation = conversationResponse.data;
      const userProfile = userProfileResponse.data;
      const senderType = userProfile?.user_type === 'recruiter' ? 'recruiter' : 'company';

      // Check if recruiter is trying to send the first message
      if (senderType === 'recruiter') {
        const { data: existingMessages } = await supabase
          .from('messages')
          .select('id')
          .eq('conversation_id', conversationId)
          .limit(1);

        if (!existingMessages || existingMessages.length === 0) {
          toast({
            title: "Azione non consentita",
            description: "Puoi rispondere solo dopo che l'azienda ti ha contattato",
            variant: "destructive",
          });
          return false;
        }
      }

      // Check if this is the first message from company to send notification
      const { data: existingMessages } = await supabase
        .from('messages')
        .select('id, sender_type')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      const isFirstMessage = !existingMessages || existingMessages.length === 0;
      const isFirstCompanyMessage = isFirstMessage && senderType === 'company';

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_email: user.email,
          sender_type: senderType,
          message_content: content.trim()
        });

      if (error) throw error;

      // Send notification only for first company message
      if (isFirstCompanyMessage) {
        try {
          await supabase.functions.invoke('send-proposal-notification', {
            body: {
              type: 'first_message',
              recruiter_email: conversation.recruiter_email,
              company_email: conversation.company_email,
              conversation_id: conversationId,
              message_content: content.trim()
            }
          });
        } catch (notificationError) {
          console.warn('Failed to send notification:', notificationError);
        }
      }

      // Refresh messages for this conversation
      await fetchMessages(conversationId);
      
      toast({
        title: "Messaggio inviato",
        description: "Il tuo messaggio è stato inviato con successo",
      });

      return true;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Errore",
        description: "Impossibile inviare il messaggio",
        variant: "destructive",
      });
      return false;
    }
  };

  const createConversation = async (proposalId: string, recruiterEmail: string, companyEmail: string) => {
    if (!user?.email) return null;

    try {
      // Check if conversation already exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('*')
        .eq('proposal_id', proposalId)
        .single();

      if (existing) {
        return existing.id;
      }

      // Verify user is a company (only companies can create conversations)
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('user_type')
        .eq('auth_user_id', user.id)
        .single();

      if (userProfile?.user_type !== 'company') {
        toast({
          title: "Accesso negato",
          description: "Solo le aziende possono avviare conversazioni",
          variant: "destructive",
        });
        return null;
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          proposal_id: proposalId,
          recruiter_email: recruiterEmail,
          company_email: companyEmail
        })
        .select()
        .single();

      if (error) throw error;

      await fetchConversations();
      return data.id;

    } catch (error: any) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Errore",
        description: "Impossibile creare la conversazione",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user?.email]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user?.email) return;

    const messagesChannel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const rawMessage = payload.new as any;
          const newMessage: Message = {
            id: rawMessage.id,
            conversation_id: rawMessage.conversation_id,
            sender_email: rawMessage.sender_email,
            sender_type: rawMessage.sender_type as 'recruiter' | 'company',
            message_content: rawMessage.message_content,
            attachment_url: rawMessage.attachment_url,
            read_at: rawMessage.read_at,
            created_at: rawMessage.created_at
          };
          
          setMessages(prev => ({
            ...prev,
            [newMessage.conversation_id]: [
              ...(prev[newMessage.conversation_id] || []),
              newMessage
            ]
          }));
          
          // Refresh conversations to update last message time
          fetchConversations();
        }
      )
      .subscribe();

    const conversationsChannel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(conversationsChannel);
    };
  }, [user?.email]);

  return {
    conversations,
    messages,
    isLoading,
    unreadCount,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation
  };
};