"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useParams } from "next/navigation";
import ChatSidebar from "@/components/ChatSideBar";
import ChatWindow from "@/components/ChatWindow";
import { Conversation, Message } from "@/models/Message";
import { io, Socket } from "socket.io-client";

export default function ConversationPage() {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const conversationId = params.conversationId as string;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      redirect("/sign-in");
    }
  }, [isLoaded, user]);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(
      process.env.NODE_ENV === "production"
        ? undefined
        : "http://localhost:3000",
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
      }
    );

    socketInstance.on("connect", () => {
      console.log("Connected to socket");
      if (conversationId) {
        socketInstance.emit("join-conversation", conversationId);
      }
    });

    socketInstance.on("receive-message", (newMessage) => {
      // Only add message if it's not from the current user
      // (to avoid duplicates since we already add it locally in sendMessage)
      if (newMessage.senderId._id !== user?.id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [conversationId, user?.id]);

  useEffect(() => {
    if (user) {
      fetchConversations();
      if (conversationId) {
        fetchMessages();
        markMessagesAsRead();
      }
    }
  }, [conversationId, user]);

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data);

        // Find current conversation
        const current = data.find(
          (conv: Conversation) => String(conv._id) === conversationId
        );
        setCurrentConversation(current || null);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await fetch(
        `/api/conversations/${conversationId}/messages/mark-read`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const sendMessage = async (content: string, images?: string[]) => {
    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, images }),
        }
      );

      if (response.ok) {
        const newMessage = await response.json();
        
        // Add to local state immediately for the sender to see their message
        setMessages((prev) => [...prev, newMessage]);
        
        // Emit to socket for other participants
        if (socket) {
          socket.emit("send-message", {
            ...newMessage,
            conversationId: conversationId
          });
        }

        fetchConversations(); // Update last message in sidebar
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        conversations={conversations}
        activeConversationId={conversationId}
        onConversationUpdate={fetchConversations}
      />

      {currentConversation ? (
        <ChatWindow
          conversation={currentConversation}
          messages={messages}
          onSendMessage={sendMessage}
          currentUserId={user.id}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Conversation not found
            </h2>
            <p className="text-gray-500">
              This conversation may have been deleted or you don't have access to it
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
