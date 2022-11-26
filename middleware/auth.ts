import {useAuthUser} from "~/composables/auth.cient";
import {navigateTo} from "#imports";

export default defineNuxtRouteMiddleware(async (to) => {
    const auth = await useAuthUser()
    if (!auth) {
        return navigateTo({path: "/login", query: to.query})
    }
})
