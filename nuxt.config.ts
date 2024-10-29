// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss' ],
  nitro: {
    routeRules: {
      '/api/upload': { cors: true }
    }
  },
  runtimeConfig: {
    
    public: {
      apiBase: process.env.Request_IT_API,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY
    }
  }
})