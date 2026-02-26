export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss"],

  tailwindcss: {
    cssPath: "~/assets/css/main.css",
    configPath: "tailwind.config.js",
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      title: "QuizOxide",
      titleTemplate: "%s | QuizOxide",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "The reliable quiz platform with rich content, diverse question types, and a full API for SaaS integration. Built with Rust.",
        },
        { name: "theme-color", content: "#0d1117" },
        { property: "og:site_name", content: "QuizOxide" },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "en_US" },
        {
          property: "og:image",
          content: "https://quizoxide.soberdev.net/og-logo.png",
        },
        { property: "og:image:width", content: "600" },
        { property: "og:image:height", content: "600" },
        { property: "og:image:type", content: "image/png" },
        { name: "twitter:card", content: "summary" },
        {
          name: "twitter:image",
          content: "https://quizoxide.soberdev.net/og-logo.png",
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.css",
          crossorigin: "anonymous",
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || "http://localhost:8080",
      docsUrl: process.env.NUXT_PUBLIC_DOCS_URL || "http://localhost:3001",
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
    },
  },

  nitro: {
    externals: {
      external: ["@resvg/resvg-js"],
    },
  },
});
