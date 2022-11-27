import {navigateTo, useAuthUser, useChat} from "#imports";

export default defineNuxtRouteMiddleware(async (to) => {
    if (process.client) {
        try {
            const chatID = useState("chat_id", () => to.params.id)
            chatID.value = to.params.id

            const authUser = await useAuthUser()
            const chat = await useChat(<string>to.params.id)

            if (!authUser) {
                navigateTo("/login")
            }

            if (chat.createdBy != authUser?.uid && (!chat.responser || chat.responser.id != authUser?.uid)) {
                navigateTo("/chats")
            }
        } catch (e) {
            console.log("middleware error", e)
        }
    }
})