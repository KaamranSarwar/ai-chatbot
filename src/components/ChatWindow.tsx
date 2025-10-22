"use client";

import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import HeaderBar from "./HeaderBar";

export default function ChatWindow({ models }: any) {
  const [selectedModel, setSelectedModel] = useState(models[0]?.tag || "");
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    // Temporary AI echo
    setTimeout(() => {
      const reply = { role: "ai", content: `You said: ${newMessage.content}` };
      setMessages((prev) => [...prev, reply]);
      setLoading(false);
    }, 800);
  }

  return (
  <div className="flex flex-col w-full max-w-3xl h-[80vh] mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
    {/* Header Bar */}
    <HeaderBar
      selectedModel={selectedModel}
      models={models}
      onModelChange={setSelectedModel}
    />

    {/* Chat Body */}
    <div className={`flex-1 overflow-y-auto ${messages.length === 0 ? "justify-center items-center" : ""} px-4 py-3 bg-gray-50 scroll-smooth`}>
      {messages.length === 0 && (
        <p className="text-center text-gray-400 mt-20">
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
