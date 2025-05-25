"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";

enum CallState {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Connecting = "CONNECTING",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallState>(CallState.Inactive);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallState.Active);
    const onCallEnd = () => setCallStatus(CallState.FINISHED);
    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          role: message.role,
          content: message.transcript,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };
    const onSpeachStart = () => {
      setIsSpeaking(true);
    };
    const onSpeachEnd = () => {
      setIsSpeaking(false);
    };
    const onError = (error: Error) => {
      console.error("Error:", error);
    };
    
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeachStart);
    vapi.on("speech-end", onSpeachEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeachStart);
      vapi.off("speech-end", onSpeachEnd);
      vapi.off("error", onError);
    };
  }, []);

  const handleCall = async () => {
    setCallStatus(CallState.Connecting);
    await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID);
  };

  const handleDisconnect = async () => {
    setCallStatus(CallState.FINISHED);
    vapi.stop();
  };

  const isCallInactiveOrFinished =
    callStatus === CallState.Inactive || callStatus === CallState.FINISHED;
  const latestMessage = messages[messages.length - 1]?.content;

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="AI Avatar"
              width={65}
              height={58}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Assistant</h3>
        </div>
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="User Avatar"
              width={120}
              height={120}
              className="rounded-full size-[120px] object-cover"
            />
            <h3>User</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={latestMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}
      
      <div className="w-full flex justify-center">
        {callStatus !== CallState.Active ? (
          <button className="btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== CallState.Connecting && "hidden"
              )}
            />
            <span>{isCallInactiveOrFinished ? "Start Chat" : ". . ."}</span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            END
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
