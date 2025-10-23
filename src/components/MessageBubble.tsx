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

  // Format timestamp
  let formattedTime = "";
  if (created_at) {
    const date = new Date(created_at);
    formattedTime = format(date, "p"); // e.g. "3:25 PM"
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`relative max-w-xs sm:max-w-sm md:max-w-md p-3 rounded-2xl shadow-sm ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        <p className="whitespace-pre-wrap wrap-break-words">{content}</p>
        {/* {created_at && (
          <span
            className={`text-[10px] absolute bottom-1 right-2 ${
              isUser ? "text-blue-100" : "text-gray-600"
            }`}
          >
            {formattedTime}
          </span>
        )} */}
      </div>
    </div>
  );
}
