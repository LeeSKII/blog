import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import CodeBlock from "@components/react/CodeBlock";
import avatarImg from "@/assets/images/avatar.png";
import { Clock, Plus, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  messages: Message[];
  timestamp: number;
}

const MAX_SESSIONS = 50;

const ChatInterface: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedSessions = localStorage.getItem("chatSessions");
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions);
      setChatSessions(sessions);
    }
    const newSession = createNewSession();
    setCurrentSessionId(newSession.id);
  }, []);

  useEffect(() => {
    const currentSession = chatSessions.find(
      (session) => session.id === currentSessionId
    );
    if (scrollAreaRef.current && currentSession) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
    setTimeout(() => {
      hljs.highlightAll();
    }, 0);
  }, [chatSessions, currentSessionId]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      messages: [],
      timestamp: Date.now(),
    };
    setChatSessions((prev) => {
      const updatedSessions = [newSession, ...prev].sort(
        (a, b) => b.timestamp - a.timestamp
      );
      if (updatedSessions.length > MAX_SESSIONS) {
        updatedSessions.pop(); // Remove the oldest session
      }
      localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));
      return updatedSessions;
    });
    setIsSheetOpen(false);
    return newSession; // Return the new session
  };

  const getCurrentSession = () => {
    return (
      chatSessions.find((session) => session.id === currentSessionId) ||
      chatSessions[chatSessions.length - 1]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentSession = getCurrentSession();
    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...currentSession.messages, userMessage];

    // 立即更新界面显示用户消息
    updateSession(currentSession.id, updatedMessages);

    setInput("");
    setIsLoading(true);

    // Reset textarea height
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "auto";
    }

    try {
      const response = await fetch("https://api.gptapi.us/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": window.localStorage.getItem("key")!,
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20240620",
          messages: [{ role: "user", content: userMessage.content }],
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
      const newUpdatedMessages = [...updatedMessages, assistantMessage];
      updateSession(currentSession.id, newUpdatedMessages);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSession = (sessionId: string, messages: Message[]) => {
    setChatSessions((prev) => {
      const updatedSessions = prev
        .map((session) =>
          session.id === sessionId
            ? { ...session, messages, timestamp: Date.now() }
            : session
        )
        .filter((session) => session.messages.length > 0)
        .sort((a, b) => b.timestamp - a.timestamp);

      if (
        messages.length === 0 &&
        updatedSessions.length > 0 &&
        sessionId === currentSessionId
      ) {
        setCurrentSessionId(updatedSessions[0].id);
      }

      localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));
      return updatedSessions;
    });
  };

  const switchToSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setIsSheetOpen(false);
  };

  const deleteSession = (sessionId: string) => {
    setChatSessions((prev) => {
      const updatedSessions = prev.filter(
        (session) => session.id !== sessionId
      );
      if (currentSessionId === sessionId) {
        if (updatedSessions.length > 0) {
          setCurrentSessionId(updatedSessions[0].id);
        } else {
          // 如果删除了最后一个会话，创建一个新的空会话
          const newSession = {
            id: Date.now().toString(),
            messages: [],
            timestamp: Date.now(),
          };
          setCurrentSessionId(newSession.id);
          return [newSession];
        }
      }
      return updatedSessions;
    });
    updateLocalStorage();
  };

  const updateLocalStorage = () => {
    localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
  };

  const currentSession = getCurrentSession();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto bg-gray-100 rounded-lg shadow-lg overflow-hidden dark:bg-zinc-900 relative">
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {currentSession &&
          currentSession.messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`flex items-start max-w-full ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar
                  className={`w-8 h-8 sm:w-10 sm:h-10 ${
                    message.role === "user" ? "ml-2" : "mr-2"
                  }`}
                >
                  <AvatarImage src={avatarImg.src} alt="@shadcn" />
                  <AvatarFallback>
                    {message.role === "user" ? "U" : "C"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`prose dark:prose-invert p-3 rounded-lg overflow-hidden max-w-64 md:max-w-5xl break-words ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white dark:bg-gray-600 dark:text-white"
                  }`}
                >
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                      code: ({ node, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || "");
                        return match ? (
                          <CodeBlock
                            language={match[1]}
                            value={String(children).replace(/\n$/, "")}
                          />
                        ) : (
                          <span className="bg-zinc-800 text-white dark:bg-zinc-900 dark:text-gray-100 p-1 rounded">
                            {children}
                          </span>
                        );
                      },
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
        <div className="flex space-x-2 items-end">
          <textarea
            placeholder="Type your message..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="flex-grow resize-none overflow-y-auto min-h-[40px] max-h-[200px] p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={1}
          />
          <Button type="submit" disabled={isLoading} className="mb-1">
            Send
          </Button>
        </div>
      </form>
      <div className="absolute bottom-20 right-4">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full"
              onClick={() => setIsSheetOpen(true)}
            >
              <Clock className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Chat History</SheetTitle>
              <SheetDescription>
                Your chat sessions. (Max {MAX_SESSIONS})
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4">
              {chatSessions
                .filter((session) => session.messages.length > 0)
                .map((session) => (
                  <div
                    key={session.id}
                    className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded flex justify-between items-center"
                  >
                    <div
                      className="flex-grow cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={() => switchToSession(session.id)}
                    >
                      <p className="font-bold">
                        {new Date(session.timestamp).toLocaleString()}
                      </p>
                      <p className="text-sm">
                        {session.messages[0].content.substring(0, 50)}...
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteSession(session.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              {chatSessions.filter((session) => session.messages.length > 0)
                .length === 0 && <p>No saved chats yet.</p>}
            </div>
            <Button
              onClick={() => {
                const newSession = createNewSession();
                setCurrentSessionId(newSession.id);
              }}
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" /> New Chat
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ChatInterface;
