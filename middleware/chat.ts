export default defineNuxtRouteMiddleware(async (to) => {
    if (process.client) {
        const chatID = useState("chat_id", () => to.params.id)
        chatID.value = to.params.id
    }
})