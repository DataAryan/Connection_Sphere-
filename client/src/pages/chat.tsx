import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChatWindow } from "@/components/chat/chat-window";
import { type Message, type Chat } from "@shared/schema";
import { useWebSocket } from "@/lib/websocket";

export default function ChatPage() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const chatId = parseInt(location.split('/')[2]);
  const userAlias = params.get('alias');

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['/api/chats', chatId, 'messages']
  });

  const { connect } = useWebSocket();

  useEffect(() => {
    connect();
  }, []);

  if (!chatId || !userAlias) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <ChatWindow
          chatId={chatId}
          messages={messages}
          currentUser={userAlias}
        />
      </div>
    </div>
  );
}
