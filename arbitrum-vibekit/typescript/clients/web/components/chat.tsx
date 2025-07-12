'use client';

import type { Attachment, UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';
import { useState, useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { ChatHeader } from '@/components/chat-header';
import type { Vote } from '@/lib/db/schema';
import { fetcher, generateUUID } from '@/lib/utils';
import { Artifact } from './artifact';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import type { VisibilityType } from './visibility-selector';
import { useArtifactSelector } from '@/hooks/use-artifact';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';
import { useSession } from 'next-auth/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { AgeVerificationModal, isAgeVerificationValid } from './age-verification-modal';

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  selectedVisibilityType,
  isReadonly,
  selectedChatAgent: initialChatAgent,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  selectedChatModel: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
  selectedChatAgent: string;
}) {
  const { mutate } = useSWRConfig();
  const { address } = useAccount();
  const { data: session } = useSession();

  const [selectedChatAgent, _setSelectedChatAgent] = useState(initialChatAgent);
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(false);
  const [showAgeVerification, setShowAgeVerification] = useState<boolean>(false);

  // Check age verification status on component mount and when session changes
  useEffect(() => {
    if (session?.user && address) {
      const isVerified = isAgeVerificationValid();
      setIsAgeVerified(isVerified);
      setShowAgeVerification(!isVerified);
    }
  }, [session, address]);

  const handleAgeVerificationComplete = (verified: boolean) => {
    setIsAgeVerified(verified);
    setShowAgeVerification(false);
    if (verified) {
      toast.success('Welcome! You can now access Ember Agents.');
    }
  };

  const { messages, setMessages, handleSubmit, input, setInput, append, status, stop, reload } =
    useChat({
      id,
      body: {
        id,
        selectedChatModel,
        context: {
          walletAddress: address,
        },
      },
      initialMessages,
      experimental_throttle: 100,
      sendExtraMessageFields: true,
      generateId: generateUUID,
      onFinish: () => {
        mutate('/api/history');
      },
      onError: () => {
        toast.error('An error occured, please try again!');
      },
    });

  const { data: votes } = useSWR<Array<Vote>>(
    messages.length >= 2 ? `/api/vote?chatId=${id}` : null,
    fetcher
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isArtifactVisible = useArtifactSelector(state => state.isVisible);

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        {/* Wallet Connection Layer */}
        {(!session || !session?.user) && (
          <div className="fixed inset-0 backdrop-blur-sm bg-background/70 z-50 flex flex-col items-center justify-center gap-4">
            <h2 className="text-xl font-semibold">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-4">
              Authentication required to chat with Ember Agents
            </p>
            <ConnectButton />
          </div>
        )}

        {/* Age Verification Layer */}
        {session?.user && address && showAgeVerification && (
          <AgeVerificationModal onVerificationComplete={handleAgeVerificationComplete} />
        )}
        <ChatHeader />

        <Messages
          chatId={id}
          status={status}
          votes={votes}
          messages={messages as UIMessage[]}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={isArtifactVisible}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && session?.user && address && isAgeVerified && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              status={status}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages as UIMessage[]}  
              setMessages={setMessages}
              append={append}
              selectedAgentId={selectedChatAgent}
            />
          )}
        </form>
      </div>

      {session?.user && address && isAgeVerified && (
        <Artifact
          chatId={id}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          status={status}
          stop={stop}
          attachments={attachments}
          setAttachments={setAttachments}
          append={append}
          messages={messages as UIMessage[]}
          setMessages={setMessages}
          reload={reload}
          votes={votes}
          isReadonly={isReadonly}
          selectedAgentId={selectedChatAgent}
        />
      )}
    </>
  );
}
