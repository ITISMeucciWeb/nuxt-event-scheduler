// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-headlessui',
    '@nuxtjs/color-mode',
    '@nuxt/image-edge',
    '@morev/vue-transitions/nuxt',
    '@sidebase/nuxt-auth',
    '@nuxtjs/robots',
    'nuxt-icon',
    '@pinia/nuxt'
  ],
  auth: {
    isEnabled: true,
    origin: 'https://forum.meucci.party',
    basePath: '/api/auth',
    enableGlobalAppMiddleware: true
  },
  appConfig: {
    TITLE: 'FORUM MEUCCI',
    LANG: 'it',
    DESCRIPTION: "Pagina di registrazione per il forum dell'ITIS Meucci 2023",
    DAYS: ['Martedì', 'Mercoledì', 'Giovedì'],
    HOURS: ['8:30', '11:00']
  },
  nitro: {
    compressPublicAssets: true
  },
  css: ['~/assets/main.scss'],
  components: { global: true, dirs: ['~/components'] },
  tailwindcss: {
    config: {
      darkMode: 'class',
      content: [],
      plugins: [require('daisyui')]
    }
  },
  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark'
  }
});
