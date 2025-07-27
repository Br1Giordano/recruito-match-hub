-- Create messaging system tables

-- Table for conversations between companies and recruiters
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE,
  recruiter_email VARCHAR NOT NULL,
  company_email VARCHAR NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for individual messages
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_email VARCHAR NOT NULL,
  sender_type VARCHAR NOT NULL CHECK (sender_type IN ('recruiter', 'company')),
  message_content TEXT NOT NULL,
  attachment_url TEXT,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Users can view their own conversations"
ON public.conversations
FOR SELECT
USING (
  (auth.jwt() ->> 'email' = recruiter_email) OR 
  (auth.jwt() ->> 'email' = company_email)
);

CREATE POLICY "Users can create conversations for their proposals"
ON public.conversations
FOR INSERT
WITH CHECK (
  (auth.jwt() ->> 'email' = recruiter_email) OR 
  (auth.jwt() ->> 'email' = company_email)
);

CREATE POLICY "Users can update their own conversations"
ON public.conversations
FOR UPDATE
USING (
  (auth.jwt() ->> 'email' = recruiter_email) OR 
  (auth.jwt() ->> 'email' = company_email)
);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations"
ON public.messages
FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM public.conversations 
    WHERE (auth.jwt() ->> 'email' = recruiter_email) OR 
          (auth.jwt() ->> 'email' = company_email)
  )
);

CREATE POLICY "Users can send messages in their conversations"
ON public.messages
FOR INSERT
WITH CHECK (
  conversation_id IN (
    SELECT id FROM public.conversations 
    WHERE (auth.jwt() ->> 'email' = recruiter_email) OR 
          (auth.jwt() ->> 'email' = company_email)
  ) AND
  auth.jwt() ->> 'email' = sender_email
);

CREATE POLICY "Users can mark their messages as read"
ON public.messages
FOR UPDATE
USING (
  conversation_id IN (
    SELECT id FROM public.conversations 
    WHERE (auth.jwt() ->> 'email' = recruiter_email) OR 
          (auth.jwt() ->> 'email' = company_email)
  ) AND
  auth.jwt() ->> 'email' != sender_email
);

-- Create indexes for better performance
CREATE INDEX idx_conversations_proposal_id ON public.conversations(proposal_id);
CREATE INDEX idx_conversations_recruiter_email ON public.conversations(recruiter_email);
CREATE INDEX idx_conversations_company_email ON public.conversations(company_email);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_email ON public.messages(sender_email);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- Create function to update conversation last_message_at
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at,
      updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update conversation timestamp when a message is sent
CREATE TRIGGER update_conversation_on_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_last_message();