"use client";

import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import HeaderBar from "./HeaderBar";
import { supabase } from "../lib/supabaseclient";
import { trpc } from "../utils/trpcclient";
export default function ChatWindow({ models }: any) {
  const [selectedModel, setSelectedModel] = useState<string>(
    models[0]?.tag || ""
  );
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState<boolean>(false);

  const [clearing, setClearing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sendMessageMutation = trpc.chat.send.useMutation();
  const clearChatMutation = trpc.chat.clear.useMutation();

  const { data, isLoading, refetch } = trpc.chat.history.useQuery(
    { userId: userId ?? "", modelTag: selectedModel },
    { enabled: !!userId } // don't run until we know the user
  );
  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
  }
  useEffect(() => {
    setUserLoading(true);
    getUser();
    setUserLoading(false);
  }, []);

  useEffect(() => {
    if (data) setMessages(data);
  }, [data]);
  useEffect(() => {
    setMessages
  if (userId) refetch();
}, [selectedModel]);


  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  async function handleSend() {
    if (!input.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const newMessage = {
      modelTag: selectedModel,
      msg: input,
      userId: user.id,
    };

    // Add user message locally
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input, modelTag: selectedModel },
    ]);

    setInput("");
    setLoading(true);

    try {
      const { reply } = await sendMessageMutation.mutateAsync(newMessage);

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: reply, modelTag: selectedModel },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleClearChat() {
    if (messages.length === 0) return;
    setClearing(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setClearing(false);
      return;
    }

    try {
      const { success } = await clearChatMutation.mutateAsync({
        userId: user.id,
        modelTag: selectedModel,
      });
      if (success) {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error clearing chat:", error);
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="flex flex-col w-full max-w-3xl h-[80vh] mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
      <HeaderBar
        selectedModel={selectedModel}
        models={models}
        onModelChange={setSelectedModel}
        onClearChat={handleClearChat}
        clearing={clearing}
        msglength={messages.length}
      />

      {/* Chat Body */}
      <div
        className={`flex-1 overflow-y-auto ${
          messages.length === 0 || isLoading
            ? "flex items-center justify-center"
            : ""
        } px-4 py-3 bg-gray-50`}
      >
        {isLoading ? (
          <p className="text-center text-black">Loading chat history...</p>
        ) : null}
        {messages.length === 0 && !isLoading && !userLoading && (
          <p className="text-center text-black">
            Start chatting by typing below 👇
          </p>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} {...msg} />
        ))}
        {loading && (
          <div className="text-sm text-gray-500 italic mt-2">
            AI is thinking...
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>

      {/* Input */}
      <div className="flex items-center border-t bg-white px-4 py-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // prevent newline
              handleSend(); // send message
            }
          }}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-gray-700 
             focus:outline-none focus:ring-2 focus:ring-blue-500 
             resize-none overflow-y-auto"
          rows={1}
        />

        <button
          onClick={handleSend}
          className="ml-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
