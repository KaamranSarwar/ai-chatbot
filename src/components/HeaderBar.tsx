"use client";

import { supabase } from "../lib/supabaseclient";
import { useRouter } from "next/navigation";

export default function HeaderBar({
  selectedModel,
  models,
  onModelChange,
  onClearChat,
  clearing = false,
  msglength,
}: {
  selectedModel: string;
  models: any[];
  onModelChange: (value: string) => void;
  onClearChat: () => void;
  clearing?: boolean;
  msglength?: number;
}) {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  return (
    <header className="flex flex-col gap-2 md:0 md:flex-row  items-center justify-between w-full px-5 py-3 bg-white border-b border-gray-200 shadow-sm rounded-t-2xl">
      {/* Left side - App title */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold text-gray-800">🤖 AI Chat</span>
      </div>

      {/* Middle - Model selector */}
      <div className="flex items-center gap-2">
        <label htmlFor="model" className="text-md font-bold text-gray-800">
          Model:
        </label>
        <select
          id="model"
          value={selectedModel}
          onChange={(e) => onModelChange(e.target.value)}
          className="border border-gray-300 rounded-md p-1 text-sm bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          disabled={clearing}
        >
          {models.map((m: any) => (
            <option key={m.tag} value={m.tag}>
              {m.tag}
            </option>
          ))}
        </select>
      </div>

      {/* Right side - Buttons */}
      <div className="flex gap-2 items-center">
        <button
          onClick={onClearChat}
          disabled={clearing}
          className={`bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded-md text-sm transition ${
            msglength === 0 ? "opacity-0 pointer-events-none" : ""
          } `}
        >
          Delete Chat
        </button>

        <button
          onClick={handleLogout}
          disabled={clearing}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
