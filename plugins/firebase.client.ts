import {initializeApp} from "firebase/app";
import {useRuntimeConfig} from "#imports";
import {browserLocalPersistence, getAuth} from "firebase/auth";

export default defineNuxtPlugin(async _ => {
    initializeApp(useRuntimeConfig().public.firebase);

    await getAuth().setPersistence(browserLocalPersistence).catch(e => console.log(e))
})