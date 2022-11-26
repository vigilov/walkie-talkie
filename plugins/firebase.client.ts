import {initializeApp} from "firebase/app";
import {useRuntimeConfig} from "#imports";

export default defineNuxtPlugin(nuxtApp => {
    const cfg = useRuntimeConfig()

    initializeApp(cfg.public.firebase);
})