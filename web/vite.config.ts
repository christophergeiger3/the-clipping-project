import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.PORT) || 4191,
  },
  resolve: {
    alias: {
      "@": "/src",
      "@utils": "/src/utils",
      "@components": "/src/components",
      "@hooks": "/src/hooks",
      "@providers": "/src/providers",
      "@reducers": "src/reducers",
    },
  },
});
