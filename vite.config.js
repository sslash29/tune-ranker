import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import fs from "fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if certificate files exist
const certKeyPath = resolve(__dirname, "cert.key");
const certCrtPath = resolve(__dirname, "cert.crt");
const certFilesExist = fs.existsSync(certKeyPath) && fs.existsSync(certCrtPath);

export default defineConfig({
  plugins: [react(), tailwindcss(), mkcert()],
  server: {
    open: "/",
    https: certFilesExist
      ? {
          key: fs.readFileSync(certKeyPath),
          cert: fs.readFileSync(certCrtPath),
        }
      : true,
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
});

//https:backend:5000/apiT/spotify-token
