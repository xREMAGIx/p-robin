import store from "@client/stores/store";
import { treaty } from "@elysiajs/eden";
import type { App } from "@server";

export const server = treaty<App>(import.meta.env.VITE_API_SERVER, {
  fetch: {
    credentials: "include",
  },
  async onResponse(response) {
    if (response.status === 401) {
      const error: ApiError = await response.json();
      if (error.code === "UNAUTHORIZED_ERROR_INVALID_TOKEN") {
        try {
          await fetch(
            `${import.meta.env.VITE_API_SERVER}/api/auth/refresh-token`,
            { method: "POST", credentials: "include" }
          );
          const res = await fetch(response.url, {
            credentials: "include",
          });
          return res.ok ? res.json() : Promise.reject(res);
        } catch (error) {
          store.setState({ authProfile: undefined });
          Promise.reject(error);
        }
      }
    }

    return response.ok ? response.json() : Promise.reject(response);
  },
});
