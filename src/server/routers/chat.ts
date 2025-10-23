import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { supabase } from "../../server/supabase";

export const chatRouter = router({
  send: publicProcedure
    .input(z.object({ modelTag: z.string(), msg: z.string(), userId: z.string() }))
    .mutation(async ({ input }) => {
      const { modelTag, msg, userId } = input;

      await supabase.from("messages").insert({
        user_id: userId,
        model_tag: modelTag,
        role: "user",
        content: msg,
      });

      const reply = `You said: ${msg}`;
      await supabase.from("messages").insert({
        user_id: userId,
        model_tag: modelTag,
        role: "ai",
        content: reply,
      });

      return { reply };
    }),

  history: publicProcedure
    .input(z.object({ userId: z.string(), modelTag: z.string() }))
    .query(async ({ input }) => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", input.userId)
        .eq("model_tag", input.modelTag)
        .order("created_at", { ascending: true });
      return data ?? [];
    }),
});
