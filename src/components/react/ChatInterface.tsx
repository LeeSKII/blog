import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://api.gptapi.us/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": window.localStorage.getItem("key")!,
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20240620",
          messages: [{ role: "user", content: input }],
          max_tokens: 1000,
        }),
      });

      if (!response.ok)
        throw new Error("Failed to fetch response from Claude API");

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.content[0].text,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      // 处理错误（例如，向用户显示错误消息）
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto bg-gray-100 rounded-lg shadow-lg overflow-hidden dark:bg-zinc-900 dark:text-white">
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
          >
            <div
              className={`flex items-start max-w-[70%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <Avatar
                className={`w-10 h-10 ${message.role === "user" ? "ml-2" : "mr-2"}`}
              >
                {message.role === "user" ? "U" : "C"}
              </Avatar>
              <div
                className={`p-3 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-white"}`}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-center bg-white p-3 rounded-lg">
              <div className="animate-pulse">Claude is typing...</div>
            </div>
          </div>
        )}
      </ScrollArea>
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white dark:bg-gray-900 border-t"
      >
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
