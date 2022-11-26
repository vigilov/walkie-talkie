import {useAuthUser} from "~/composables/auth.cient";
import {navigateTo} from "#imports";

export default defineNuxtRouteMiddleware(async () => {
    const auth = await useAuthUser()
    if (!auth) {
        return navigateTo('/login')
    }
})
