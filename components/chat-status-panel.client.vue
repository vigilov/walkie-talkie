<template>
  <div class="px-2 py-1 pr-3 border border-gray-400 rounded-full">
    <template v-if="chat?.status === ChatStatus.Opened">
      <Icon name="ph:chat-centered-light" class="text-xl text-teal-700"/>
      {{ unReadCount }} new messages
    </template>
    <template v-else-if="chat?.status === ChatStatus.Pending">
      <Icon name="line-md:loading-loop" class="text-xl text-teal-700"/>
      Finding expert
    </template>
    <template v-else-if="chat?.status === ChatStatus.Resolved">
      <Icon name="material-symbols:check-small" class="text-xl text-teal-700"/>
      Solved
    </template>
    <template v-else-if="chat?.status === ChatStatus.Closed">
      <Icon name="iconoir:cancel" class="text-red-700 text-xl"/>
      Not solved
    </template>
  </div>
</template>

<script setup lang="ts">
import {ChatStatus, onMounted, useAuthUser} from "#imports";
import {doc, getFirestore, onSnapshot, Unsubscribe} from "firebase/firestore";
import {IChat} from "~/composables/chats.client";
import {awaitExpression} from "@babel/types";

const props = defineProps(['id'])
const chat = ref<IChat>(<IChat>{status: ChatStatus.Off})
const unReadCount = ref<number>(0)
const authUser = await useAuthUser()

let unsubscribe: Unsubscribe

onMounted(() => {
  unsubscribe = onSnapshot(doc(getFirestore(), "chats", <string>props.id), (snapshot) => {
    if (!snapshot.exists() || !authUser) {
      return
    }
    chat.value = <IChat>snapshot.data()

    const amIResolver = chat.value.createdBy != authUser.uid
    if (!amIResolver) {
      unReadCount.value = chat.value.newMessages
    } else if (chat.value.responser) {
      unReadCount.value = chat.value.responser.newMessages
    }
  })
})

</script>

<style scoped>

</style>