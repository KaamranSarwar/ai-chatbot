"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseclient";
import { trpc } from "../../utils/trpcclient"; // 👈 import tRPC hook
import ChatWindow from "@/components/ChatWindow";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ChatPage() {
  const router = useRouter();
  const { data: models, isLoading: modelsLoading } =
    trpc.models.getAvailable.useQuery();

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth");
      }
    }

    checkSession();
  }, [router]);

  // ✅ Show loading state (for both auth + models)
  if (modelsLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <ChatWindow models={models ?? []} />
    </div>
  );
}
