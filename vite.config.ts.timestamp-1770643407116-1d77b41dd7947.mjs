// vite.config.ts
import { defineConfig } from "file:///C:/Users/eberv/Downloads/poker-gold-control-hub/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/eberv/Downloads/poker-gold-control-hub/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///C:/Users/eberv/Downloads/poker-gold-control-hub/node_modules/lovable-tagger/dist/index.js";
import { VitePWA } from "file:///C:/Users/eberv/Downloads/poker-gold-control-hub/node_modules/vite-plugin-pwa/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\eberv\\Downloads\\poker-gold-control-hub";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "icons/pwa-192.png",
        "icons/pwa-512.png"
      ],
      manifest: {
        name: "POKER CONTROL",
        short_name: "PokerControl",
        description: "Gest\xE3o de poker, torneios e finan\xE7as.",
        theme_color: "#d4af37",
        background_color: "#0b0f1a",
        display: "standalone",
        start_url: "/",
        scope: "/",
        lang: "pt-BR",
        icons: [
          { src: "/icons/pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/pwa-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[^/]*supabase\.co\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 3
            }
          },
          {
            urlPattern: ({ request, url }) => request.destination === "image" || url.pathname.startsWith("/lovable-uploads/"),
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 }
            }
          },
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "pages-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }
            }
          }
        ]
      }
    }),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-popover"
          ],
          charts: ["recharts"],
          query: ["@tanstack/react-query"],
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          utils: ["date-fns", "clsx", "class-variance-authority", "tailwind-merge"],
          supabase: ["@supabase/supabase-js"]
        }
      }
    },
    chunkSizeWarningLimit: 1e3,
    target: "esnext",
    minify: "esbuild"
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxlYmVydlxcXFxEb3dubG9hZHNcXFxccG9rZXItZ29sZC1jb250cm9sLWh1YlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZWJlcnZcXFxcRG93bmxvYWRzXFxcXHBva2VyLWdvbGQtY29udHJvbC1odWJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2ViZXJ2L0Rvd25sb2Fkcy9wb2tlci1nb2xkLWNvbnRyb2wtaHViL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiBcIjo6XCIsXHJcbiAgICBwb3J0OiA4MDgwLFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIFZpdGVQV0Eoe1xyXG4gICAgICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxyXG4gICAgICBpbmplY3RSZWdpc3RlcjogXCJhdXRvXCIsXHJcbiAgICAgIGluY2x1ZGVBc3NldHM6IFtcclxuICAgICAgICBcImZhdmljb24uaWNvXCIsXHJcbiAgICAgICAgXCJyb2JvdHMudHh0XCIsXHJcbiAgICAgICAgXCJpY29ucy9wd2EtMTkyLnBuZ1wiLFxyXG4gICAgICAgIFwiaWNvbnMvcHdhLTUxMi5wbmdcIixcclxuICAgICAgXSxcclxuICAgICAgbWFuaWZlc3Q6IHtcclxuICAgICAgICBuYW1lOiBcIlBPS0VSIENPTlRST0xcIixcclxuICAgICAgICBzaG9ydF9uYW1lOiBcIlBva2VyQ29udHJvbFwiLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkdlc3RcdTAwRTNvIGRlIHBva2VyLCB0b3JuZWlvcyBlIGZpbmFuXHUwMEU3YXMuXCIsXHJcbiAgICAgICAgdGhlbWVfY29sb3I6IFwiI2Q0YWYzN1wiLFxyXG4gICAgICAgIGJhY2tncm91bmRfY29sb3I6IFwiIzBiMGYxYVwiLFxyXG4gICAgICAgIGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiLFxyXG4gICAgICAgIHN0YXJ0X3VybDogXCIvXCIsXHJcbiAgICAgICAgc2NvcGU6IFwiL1wiLFxyXG4gICAgICAgIGxhbmc6IFwicHQtQlJcIixcclxuICAgICAgICBpY29uczogW1xyXG4gICAgICAgICAgeyBzcmM6IFwiL2ljb25zL3B3YS0xOTIucG5nXCIsIHNpemVzOiBcIjE5MngxOTJcIiwgdHlwZTogXCJpbWFnZS9wbmdcIiB9LFxyXG4gICAgICAgICAgeyBzcmM6IFwiL2ljb25zL3B3YS01MTIucG5nXCIsIHNpemVzOiBcIjUxMng1MTJcIiwgdHlwZTogXCJpbWFnZS9wbmdcIiB9LFxyXG4gICAgICAgICAgeyBzcmM6IFwiL2ljb25zL3B3YS01MTIucG5nXCIsIHNpemVzOiBcIjUxMng1MTJcIiwgdHlwZTogXCJpbWFnZS9wbmdcIiwgcHVycG9zZTogXCJhbnkgbWFza2FibGVcIiB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHdvcmtib3g6IHtcclxuICAgICAgICBnbG9iUGF0dGVybnM6IFtcIioqLyoue2pzLGNzcyxodG1sLGljbyxwbmcsc3ZnLGpwZyxqcGVnLHdlYnB9XCJdICxcclxuICAgICAgICBuYXZpZ2F0ZUZhbGxiYWNrOiBcIi9pbmRleC5odG1sXCIsXHJcbiAgICAgICAgcnVudGltZUNhY2hpbmc6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9bXi9dKnN1cGFiYXNlXFwuY29cXC8uKi9pLFxyXG4gICAgICAgICAgICBoYW5kbGVyOiBcIk5ldHdvcmtGaXJzdFwiLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiBcInN1cGFiYXNlLWNhY2hlXCIsXHJcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjogeyBtYXhFbnRyaWVzOiA1MCwgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0IH0sXHJcbiAgICAgICAgICAgICAgbmV0d29ya1RpbWVvdXRTZWNvbmRzOiAzLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdXJsUGF0dGVybjogKHsgcmVxdWVzdCwgdXJsIH0pID0+IHJlcXVlc3QuZGVzdGluYXRpb24gPT09IFwiaW1hZ2VcIiB8fCB1cmwucGF0aG5hbWUuc3RhcnRzV2l0aChcIi9sb3ZhYmxlLXVwbG9hZHMvXCIpLFxyXG4gICAgICAgICAgICBoYW5kbGVyOiBcIkNhY2hlRmlyc3RcIixcclxuICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgIGNhY2hlTmFtZTogXCJpbWFnZS1jYWNoZVwiLFxyXG4gICAgICAgICAgICAgIGV4cGlyYXRpb246IHsgbWF4RW50cmllczogMTAwLCBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiA3IH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAoeyByZXF1ZXN0IH0pID0+IHJlcXVlc3QubW9kZSA9PT0gXCJuYXZpZ2F0ZVwiLFxyXG4gICAgICAgICAgICBoYW5kbGVyOiBcIk5ldHdvcmtGaXJzdFwiLFxyXG4gICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiBcInBhZ2VzLWNhY2hlXCIsXHJcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjogeyBtYXhFbnRyaWVzOiA1MCwgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0IH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICAgIG1vZGUgPT09ICdkZXZlbG9wbWVudCcgJiZcclxuICAgIGNvbXBvbmVudFRhZ2dlcigpLFxyXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rczoge1xyXG4gICAgICAgICAgdmVuZG9yOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXHJcbiAgICAgICAgICB1aTogW1xyXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LWRpYWxvZycsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3Qtc2VsZWN0JywgXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtdGFicycsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtZHJvcGRvd24tbWVudScsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtcG9wb3ZlcidcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICBjaGFydHM6IFsncmVjaGFydHMnXSxcclxuICAgICAgICAgIHF1ZXJ5OiBbJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSddLFxyXG4gICAgICAgICAgZm9ybXM6IFsncmVhY3QtaG9vay1mb3JtJywgJ0Bob29rZm9ybS9yZXNvbHZlcnMnLCAnem9kJ10sXHJcbiAgICAgICAgICB1dGlsczogWydkYXRlLWZucycsICdjbHN4JywgJ2NsYXNzLXZhcmlhbmNlLWF1dGhvcml0eScsICd0YWlsd2luZC1tZXJnZSddLFxyXG4gICAgICAgICAgc3VwYWJhc2U6IFsnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJ11cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXHJcbiAgICB0YXJnZXQ6ICdlc25leHQnLFxyXG4gICAgbWluaWZ5OiAnZXNidWlsZCdcclxuICB9XHJcbn0pKTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5VSxTQUFTLG9CQUFvQjtBQUN0VyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBQ2hDLFNBQVMsZUFBZTtBQUp4QixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDTixjQUFjO0FBQUEsTUFDZCxnQkFBZ0I7QUFBQSxNQUNoQixlQUFlO0FBQUEsUUFDYjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFVBQVU7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUNaLGFBQWE7QUFBQSxRQUNiLGFBQWE7QUFBQSxRQUNiLGtCQUFr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
