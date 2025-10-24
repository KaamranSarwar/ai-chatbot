"use client";

import { format } from "date-fns";

export default function MessageBubble({
  role,
  content,
  created_at,
}: {
  role: string;
  content: string;
  created_at?: string;
}) {
  const isUser = role === "user";

  const date = created_at ? new Date(created_at) : new Date();
  const formattedTime = format(date, "p");

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`relative min-w-13  max-w-xs sm:max-w-sm md:max-w-md p-3 rounded-2xl shadow-sm ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        <div></div>
        <p className="whitespace-pre-wrap mb-1 text-center wrap-break-words">
          {content}
        </p>

        <span
          className={`text-[10px] absolute bottom-1 right-2  ${
            isUser ? "text-blue-100" : "text-gray-600"
          }`}
        >
          {formattedTime}
        </span>
      </div>
    </div>
  );
}
