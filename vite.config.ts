import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const fallbackRepositoryName = "gestao-contratos-iguape";
const repositoryName =
  process.env.GITHUB_REPOSITORY?.split("/")[1] ?? fallbackRepositoryName;

export default defineConfig({
  base: `/${repositoryName}/`,
  plugins: [react(), tailwindcss()],
  server: {
    host: "127.0.0.1",
    port: 4173,
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
  },
});
