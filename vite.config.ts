import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { fetchNowPlaying } from "./api/_spotify";

/**
 * Serves /api/spotify during `npm run dev`.
 *
 * In production that route is a Vercel function; Vite's dev server doesn't run
 * those, so without this the tile would only work on a deployed build.
 *
 * Credentials come from `loadEnv` with an empty prefix, which reads unprefixed
 * vars out of .env into this Node process only — unlike VITE_* vars, they are
 * never inlined into client code.
 */
const spotifyDevApi = (mode: string): Plugin => ({
  name: "spotify-dev-api",
  apply: "serve",
  configureServer(server) {
    const env = loadEnv(mode, process.cwd(), "");

    server.middlewares.use("/api/spotify", async (_req, res) => {
      try {
        const result = await fetchNowPlaying(env);

        if (result.status !== "ok") {
          res.statusCode = 204;
          res.end();
          return;
        }

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(result.track));
      } catch (error) {
        console.error("Spotify dev proxy failed:", error);
        res.statusCode = 503;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "spotify_unavailable" }));
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [
    react(),
    spotifyDevApi(mode),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
