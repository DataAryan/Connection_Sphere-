import { useEffect, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWebSocket } from "@/lib/websocket";
import { useForm } from "react-hook-form";
import { type Message } from "@shared/schema";

interface ChatWindowProps {
  chatId: number;
  messages: Message[];
  currentUser: string;
}

export function ChatWindow({ chatId, messages, currentUser }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { sendMessage } = useWebSocket();
  const { register, handleSubmit, reset } = useForm<{ content: string }>();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = handleSubmit(({ content }) => {
    if (!content.trim()) return;
    
    sendMessage('send_message', {
      chatId,
      senderId: currentUser,
      content
    });
    
    reset();
  });

  return (
    <Card className="h-[600px] flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === currentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.senderId === currentUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <CardFooter className="border-t p-4">
        <form onSubmit={onSubmit} className="flex w-full gap-2">
          <Input {...register("content")} placeholder="Type a message..." />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
