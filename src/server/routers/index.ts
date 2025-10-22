import { router } from "../trpc";
import { chatRouter } from "./chat";
import { modelsRouter } from "./models";

export const appRouter = router({
  chat: chatRouter,
  models: modelsRouter,
});
export type AppRouter = typeof appRouter;
