<template>
  <div class="bg-gray-100 flex-1 flex flex-col">
    <div class="flex flex-col h-fit p-6 flex-1 max-md:p-0 border-gray-700 mx-auto max-w-7xl overflow-x-hidden w-full">
      <div
          class="flex flex-col items-stretch flex-1 flex-shrink-0 rounded-md bg-white p-4 max-md:rounded-none max-md:p-0">
        <div class="flex flex-col overflow-x-auto mb-4 flex-1 m-0 max-md:p-2 relative" ref="container">
          <div class="absolute right-0 m-1 p-1" @click="deleteChat">
            <Icon name="material-symbols:close"
                  class="h-6 p-1 w-6 bg-teal-700 rounded-full text-white cursor-pointer hover:bg-teal-800"
                  aria-hidden="true"/>
          </div>
          <div class="flex flex-col flex-1 justify-end">
            <div class="grid grid-cols-12 gap-y-2 auto-rows-max">
              <div class="p-3 rounded-md" v-for="msg in messages"
                   :class="[msg.author.id !== authUser?.uid ? 'col-start-6 col-end-13 max-sm:col-start-2' : 'col-start-1 col-end-8 max-sm:col-end-12']">
                <div class="flex flex-row items-center">
                  <div v-if="msg.author.avatarURL"
                       class="flex rounded-full bg-teal-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <img class="h-8 w-8 rounded-full min-w-min" referrerpolicy="no-referrer"
                         :src="msg.author.avatarURL"
                         alt=""/>
                  </div>
                  <div v-else
                       class="flex items-center justify-center h-10 w-10 rounded-full bg-teal-600 flex-shrink-0 text-white">
                    {{ chatAuthorName(msg.author.name) }}
                  </div>
                  <div class="relative ml-3 text-sm bg-gray-100 py-2 px-4 shadow w-fit w-full">
                    <div>{{ msg.text }}</div>
                    <div class="text-gray-400 text-xs">{{
                        new Date(msg.timestamp).toISOString().split('.')[0].split("T")[1]
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex">
          <form
              class="flex flex-row self-end items-center h-16 rounded-md bg-teal-800 w-full px-4 max-md:rounded-none"
              action="#"
              @submit.prevent="send">
            <div class="flex-grow">
              <div class="relative w-full">
                <input
                    ref="input"
                    type="text" v-model="message"
                    class="flex w-full border rounded-md focus:outline-none focus:border-indigo-300 pl-4 h-10 bg-white"/>

              </div>
            </div>
            <div class="ml-4">
              <button type="submit"
                      class="flex items-center justify-center bg-teal-600 hover:bg-teal-700 rounded-full text-white w-10 h-10 flex-shrink-0">
                    <span class="ml-1">
                      <svg
                          class="w-4 h-4 transform rotate-45 -mt-px"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        ></path>
                      </svg>
                    </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {IAuthUser} from "~/composables/auth.cient";

definePageMeta({
  middleware: ['auth', 'chat']
})

import {
  onUnmounted,
  onUpdated,
  ref,
  useState,
  useUser,
  useRuntimeConfig,
  useDeleteChat,
  useRoute,
  navigateTo, useAuthUser, useUpdateUser
} from "#imports";
import {collection, where, query, onSnapshot, orderBy, doc, Unsubscribe, getFirestore} from "firebase/firestore";
import {getMessaging, getToken} from "@firebase/messaging";
import {useSendMessage, IMessage} from "~/composables/chats.client";

const container = ref()
const message = ref<string>()
const chatID = useState("chat_id", () => useRoute().params.id)
const messages = useState<Array<IMessage>>('counter', () => [])
const authUser = <IAuthUser>await useAuthUser()

const user = await useUser(authUser.uid)
const input = ref()

let unsubscribe: Unsubscribe
let userUnsubscribe: Unsubscribe

Notification.requestPermission().then(async (perms: string) => {
  if (!user) {
    return
  }
  if (perms === 'granted') {
    const m = await getMessaging()
    const t = await getToken(m, {vapidKey: useRuntimeConfig().public.webPushKey});

    if (!user.devices.includes(t)) {
      user.devices.push(t)
    }
    try {
      await useUpdateUser(user.id, {
        devices: user.devices
      })
    } catch (e) {
      console.log("can't update user", e)
    }

  }
  console.log(perms)
})

async function deleteChat() {
  if (!authUser) {
    return
  }

  await useDeleteChat(authUser.uid, <string>chatID.value)
  await navigateTo("/chats")
}

async function send() {
  input.value.focus()
  if (message.value == "") {
    return
  }

  await useSendMessage(<string>message.value, <string>chatID.value)
  message.value = "";
}

function scrollBottom() {
  window.scrollBy(0, 1000);
}

function chatAuthorName(name: string): string {
  if (!name || name === "") {
    return "A"
  }
  return name.substring(0, 1)
}

onUpdated(() => {
  scrollBottom()
})

onMounted(async () => {
  messages.value = [];

  if (!authUser) {
    return
  }

  userUnsubscribe = onSnapshot(doc(getFirestore(), "users", authUser.uid), (snap) => {
    if (!snap.exists()) {
      return
    }

    const q = query(
        collection(getFirestore(), "messages"),
        where("chatID", "==", chatID.value),
        orderBy("timestamp", "asc"),
    );

    if (unsubscribe) {
      unsubscribe()
    }
    messages.value = []
    unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type !== "added") {
          return
        }
        messages.value.push(<IMessage>change.doc.data());
        if (messages.value.length > 10) {
          messages.value.shift()
        }
      });
    });
  })

  scrollBottom()
});

onUnmounted(async () => {
  if (unsubscribe) {
    await unsubscribe()
  }
  if (userUnsubscribe) {
    await userUnsubscribe()
  }
})
</script>
