<template>
  <div class="bg-gray-100 flex-1 flex flex-col">
    <div class="flex flex-col h-fit p-6 flex-1 max-md:p-0 border-gray-700 mx-auto max-w-7xl overflow-x-hidden w-full">
      <div
          class="flex flex-col items-stretch flex-1 flex-shrink-0 rounded-md bg-white p-4 max-md:rounded-none max-md:p-0">
        <div ref="container" class="flex flex-col overflow-x-auto flex-1 m-4 p-2 max-md:p-2 relative">
          <div class="lg:flex lg:items-center lg:justify-between">
            <span class="sm:ml-3 pr-2">
              <NuxtLink to="/chats">
                <button
                    class="inline-flex items-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    type="button">
                  <Icon name="ic:baseline-arrow-back" />
                </button>
              </NuxtLink>
               </span>

            <div class="min-w-0 flex-1">
              <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                {{ chat?.topic }}</h2>
            </div>

            <div class="mt-5 flex lg:mt-0 lg:ml-4">
              <span class="block">
                <button
                    class="inline-flex items-center rounded-md border border-gray-300 bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    type="button">
                  <Icon name="ic:baseline-person-search" />
                  New Expert
                </button>
              </span>

              <span class="ml-3 block">
                <button
                    class="inline-flex items-center rounded-md border border-gray-300 bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    type="button">
                  <Icon name="material-symbols:delete-forever-outline"/>
                  Close Question
                </button>
               </span>
            </div>
          </div>
          <div class="flex flex-col flex-1 justify-end">
            <div class="grid grid-cols-12 gap-y-2 auto-rows-max">
              <div v-for="msg in messages"
                   :class="[msg.author.id !== authUser?.uid ? 'col-start-6 col-end-13 max-sm:col-start-2' : 'col-start-1 col-end-8 max-sm:col-end-12']"
                   class="p-3 rounded-md">
                <div class="flex flex-row items-center">
                  <div v-if="msg.author.avatarURL"
                       class="flex rounded-full bg-teal-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <img :src="msg.author.avatarURL" alt=""
                         class="h-8 w-8 rounded-full min-w-min"
                         referrerpolicy="no-referrer"/>
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

              <div v-if="chat?.status === 'pending'" class="p-3 rounded-md col-start-6 col-end-13 max-sm:col-start-2">
                <div class="flex flex-row items-center">
                  <div class="spinner">
                    <div class="double-bounce1"></div>
                    <div class="double-bounce2"></div>
                  </div>
                  <div class="relative ml-3 text-sm bg-teal-50 py-2 px-4 shadow w-fit w-full">
                    <div>We are looking for an expert</div>
                    <div class="text-gray-400 text-xs">{{
                        new Date().toISOString().split('.')[0].split("T")[1]
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
              action="#"
              class="flex flex-row self-end items-center h-16 rounded-md bg-teal-800 w-full px-4 max-md:rounded-none"
              @submit.prevent="send">
            <div class="flex-grow">
              <div class="relative w-full">
                <input
                    ref="input"
                    v-model="message"
                    class="flex w-full border rounded-md focus:outline-none focus:border-indigo-300 pl-4 h-10 bg-white"
                    type="text"/>
              </div>
            </div>
            <div class="ml-4">
              <button
                  class="flex items-center justify-center bg-teal-600 hover:bg-teal-700 rounded-full text-white w-10 h-10 flex-shrink-0"
                  type="submit">
                    <span class="ml-1">
                      <svg
                          class="w-4 h-4 transform rotate-45 -mt-px"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
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

<script lang="ts" setup>
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
import {useSendMessage, IMessage, IChat} from "~/composables/chats.client";

const container = ref()
const message = ref<string>()
const chatID = useState("chat_id", () => useRoute().params.id)
const messages = useState<Array<IMessage>>('counter', () => [])
const authUser = <IAuthUser>await useAuthUser()
const chat = ref<IChat>()

const user = await useUser(authUser.uid)
const input = ref()

let unsubscribe: Unsubscribe
let chatUnsubscribe: Unsubscribe

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

  await useDeleteChat(<string>chatID.value)
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

  const q = query(
      collection(getFirestore(), "messages"),
      where("chatID", "==", chatID.value),
      orderBy("timestamp", "asc"),
  );

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

  chatUnsubscribe = onSnapshot(doc(getFirestore(), "chats", <string>chatID.value), (snapshot) => {
    if (!snapshot.exists()) {
      return
    }
    chat.value = <IChat>snapshot.data()
  })

  scrollBottom()
});

onUnmounted(async () => {
  if (unsubscribe) {
    await unsubscribe()
  }

  if (chatUnsubscribe) {
    await chatUnsubscribe()
  }
})
</script>
