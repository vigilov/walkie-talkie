// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    runtimeConfig: {
        public: {
            firebase: {
                apiKey: process.env.FIREBASE_API_KEY,
                authDomain: process.env.FIREBASE_AUTH_DOMAIN,
                projectId: process.env.FIREBASE_PROJECT_ID,
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
                messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.FIREBASE_APP_ID,
                measurementId: process.env.FIREBASE_MEASUREMENT_ID
            },
            webPushKey: process.env.FIREBASE_WEB_PUSH_KEY
        }
    },
    modules: [
        '@nuxt/content',
        '@nuxtjs/tailwindcss',
        'nuxt-headlessui',
        'nuxt-icon',
    ],
    tailwindcss: {
        config: {
            content: [
                `components/**/*.{vue,js,ts}`,
                `layouts/**/*.vue`,
                `pages/**/*.vue`,
                `composables/**/*.{js,ts}`,
                `plugins/**/*.{js,ts}`,
                `App.{js,ts,vue}`,
                `app.{js,ts,vue}`,
                `Error.{js,ts,vue}`,
                `error.{js,ts,vue}`
            ],
            plugins: [
                require('@tailwindcss/forms')
            ]
        },
    },
    headlessui: {
        prefix: 'Headless'
    }
})
