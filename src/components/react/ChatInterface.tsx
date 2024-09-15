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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedSessions = localStorage.getItem("chatSessions");
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions);
      setChatSessions(sessions);
      if (sessions.length > 0) {
        setCurrentSessionId(sessions[sessions.length - 1].id);
      }
    } else {
      createNewSession();
    }
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
    hljs.highlightAll();
  }, [currentSessionId, chatSessions]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      messages: [],
      timestamp: Date.now(),
    };
    setChatSessions((prev) => {
      const updatedSessions = [...prev, newSession].sort(
        (a, b) => b.timestamp - a.timestamp
      );
      if (updatedSessions.length > MAX_SESSIONS) {
        updatedSessions.pop(); // Remove the oldest session
      }
      return updatedSessions;
    });
    setCurrentSessionId(newSession.id);
    updateLocalStorage();
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
      const newUpdatedMessages = [...updatedMessages, assistantMessage];
      updateSession(currentSession.id, newUpdatedMessages);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSession = (sessionId: string, messages: Message[]) => {
    setChatSessions((prev) =>
      prev
        .map((session) =>
          session.id === sessionId
            ? { ...session, messages, timestamp: Date.now() }
            : session
        )
        .sort((a, b) => b.timestamp - a.timestamp)
    );
    updateLocalStorage();
  };

  const switchToSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const deleteSession = (sessionId: string) => {
    setChatSessions((prev) => {
      const updatedSessions = prev.filter(
        (session) => session.id !== sessionId
      );
      if (currentSessionId === sessionId && updatedSessions.length > 0) {
        setCurrentSessionId(updatedSessions[0].id);
      } else if (updatedSessions.length === 0) {
        createNewSession();
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
                className={`flex items-start sm:max-w-[80%] max-w-full ${
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
                  className={`p-3 rounded-lg overflow-hidden ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white dark:bg-gray-600 dark:text-white"
                  }`}
                >
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={
                      {
                        // ... (ReactMarkdown components remain unchanged)
                      }
                    }
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
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
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
              {chatSessions.map((session) => (
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
                      {session.messages.length > 0
                        ? `${session.messages[0].content.substring(0, 50)}...`
                        : "Empty chat"}
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
            </div>
            <Button onClick={createNewSession} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> New Chat
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ChatInterface;
