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
  const [clearing, setClearing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sendMessageMutation = trpc.chat.send.useMutation();

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadMessages() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) console.error("Error loading messages:", error);
    else setMessages(data || []);
  }

  async function saveMessage(role: string, content: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("messages").insert([
      {
        user_id: user.id,
        role,
        content,
      },
    ]);

    if (error) console.error("Error saving message:", error);
  }

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
      // ✅ Call tRPC mutation and wait for reply
      const { reply } = await sendMessageMutation.mutateAsync(newMessage);

      // ✅ Add AI reply to UI immediately after getting result
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

    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error("Error clearing chat:", error);
    } else {
      setMessages([]);
    }

    // Small delay for smooth UX
    setTimeout(() => setClearing(false), 600);
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
          messages.length === 0 ? "flex items-center justify-center" : ""
        } px-4 py-3 bg-gray-50`}
      >
        {messages.length === 0 && (
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
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
