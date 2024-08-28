import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
// import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@client": resolve(__dirname, "./src"),
      "@icons": resolve(__dirname, "../src/assets/icons"),
      "@server": resolve(__dirname, "../server/src"),
    },
  },
  plugins: [react()],
  // server: {
  //   https: {
  //     key: fs.readFileSync("./.cert/key.pem"),
  //     cert: fs.readFileSync("./.cert/cert.pem"),
  //   },
  // },
});
