import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // 或者选择其他样式
import CodeBlock from "@components/react/CodeBlock";
import avatarImg from "@/assets/images/avatar.png";

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

  useEffect(() => {
    hljs.highlightAll();
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
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto bg-gray-100 rounded-lg shadow-lg overflow-hidden dark:bg-zinc-900">
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
          >
            <div
              className={`flex items-start sm:max-w-[80%] max-w-full ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <Avatar
                className={`w-8 h-8 sm:w-10 sm:h-10 ${message.role === "user" ? "ml-2" : "mr-2"}`}
              >
                <AvatarImage src={avatarImg.src} alt="@shadcn" />
                <AvatarFallback>
                  {" "}
                  {message.role === "user" ? "U" : "C"}
                </AvatarFallback>
              </Avatar>
              <div
                className={`p-3 rounded-lg overflow-hidden ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-gray-600 dark:text-white"
                }`}
              >
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{
                    p: ({ node, ...props }) => (
                      <p className="mb-2 text-sm sm:text-base" {...props} />
                    ),
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-xl sm:text-2xl font-bold mb-2"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-lg sm:text-xl font-bold mb-2"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-base sm:text-lg font-bold mb-2"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc list-inside mb-2 text-sm sm:text-base"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal list-inside mb-2 text-sm sm:text-base"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-1 text-sm sm:text-base" {...props} />
                    ),
                    code: ({ node, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <pre className="rounded mb-2">
                          <CodeBlock
                            language={match[1]}
                            value={String(children).replace(/\n$/, "")}
                          />
                        </pre>
                      ) : (
                        <code
                          className="bg-gray-200 dark:bg-gray-700 px-1 rounded"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    pre: ({ node, ...props }) => (
                      <pre
                        className=" p-2 rounded mb-2 overflow-x-auto"
                        {...props}
                      />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-center p-3 rounded-lg">
              <div className="animate-pulse">Claude is typing...</div>
            </div>
          </div>
        )}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t">
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
