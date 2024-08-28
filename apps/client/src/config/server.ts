import { treaty } from "@elysiajs/eden";
import type { App } from "@server";

export const server = treaty<App>("localhost:9000", {
  fetch: {
    credentials: "include",
  },
});
