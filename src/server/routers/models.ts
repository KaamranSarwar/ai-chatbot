import { router, publicProcedure } from "../trpc";
import { supabase } from "../../lib/supabaseclient";

export const modelsRouter = router({
  getAvailable: publicProcedure.query(async () => {
    const { data } = await supabase.from("models").select("tag");
    return data ?? [];
  }),
});
