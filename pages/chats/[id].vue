<template>
  <div class="bg-gray-100 flex-1 flex flex-col">
    <div class="flex flex-col h-fit p-6 flex-1 max-md:p-0 border-gray-700 mx-auto max-w-7xl overflow-x-hidden w-full">
      <div
          class="flex flex-col items-stretch flex-1 flex-shrink-0 rounded-md bg-white max-md:rounded-none max-md:p-0 w-full">
        <div ref="container" class="flex flex-col overflow-x-auto flex-1 relative">
          <div
              class="fixed top-16 pt-3 left-0 shadow-md pb-2 bg-white z-10 flex w-full lg:flex justify-center">
            <div class="justify-between w-full max-w-7xl flex items-center flex-row px-6 max-sm:px-2">
            <span class="pr-2">
              <NuxtLink to="/chats">
                <button
                    class="inline-flex items-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    type="button">
                  <Icon name="ic:baseline-arrow-back"/>
                </button>
              </NuxtLink>
             </span>

              <div class="min-w-0 flex-1">
                <span class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  {{ chat.topic }}
                </span>
              </div>

              <div class="flex">

                <img class="w-10 h-10 rounded-full inline mr-2" referrerpolicy="no-referrer"
                     v-if="chat.responser?.photoURL"
                     :src="chat.responser?.photoURL"
                     :alt="chat.responser?.name">

                <ChatStatusPanel :id="chatID" class="mr-2"
                                 v-if="[ChatStatus.Resolved, ChatStatus.Closed].includes(chat.status)"/>

                <span class="block" v-if="IsPanelEnabled()">
                  <button @click="newExpert"
                          class="inline-flex items-center rounded-md border border-gray-300 bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                          type="button">
                   <Icon class="text-xl" name="ic:baseline-person-search"/>
                  </button>
                </span>

                <span class="ml-3 block" v-if="IsPanelEnabled()">
                  <button @click="abortChat"
                          class="inline-flex items-center rounded-md border border-gray-300 bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                          type="button">
                    <Icon class="text-xl" name="material-symbols:delete-forever-outline"/>
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col flex-1 justify-end p-4">
            <div class="grid grid-cols-12 gap-y-2 auto-rows-max">
              <div v-for="msg in messages"
                   :class="[IsSystemMessage(msg) || IsAuthUserMessage(msg) ? 'col-start-6 col-end-13 max-sm:col-start-2' : 'col-start-1 col-end-8 max-sm:col-end-12']"
                   class="p-3 rounded-md">
                <div class="flex flex-row items-center"
                     :class="[IsSystemMessage(msg) || IsAuthUserMessage(msg) ? 'flex-row-reverse' : '']">
                  <div v-if="IsSystemMessage(msg)"
                       class="flex items-center justify-center h-10 w-10 rounded-full bg-white flex-shrink-0 text-white">
                    <img alt="WT" src="/logo_chat.png" class="h-8 w-8 rounded-r-full min-w-min"
                         referrerpolicy="no-referrer"/>
                  </div>
                  <div v-else
                       class="flex rounded-full bg-teal-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <template v-if="msg.author.avatarURL">
                      <img :src="msg.author.avatarURL" alt=""
                           class="h-8 w-8 rounded-full min-w-min"
                           referrerpolicy="no-referrer"/>
                    </template>
                    <template v-else>
                      {{ chatAuthorName(msg.author.name) }}
                    </template>
                  </div>
                  <div class="relative mx-3 text-sm py-2 px-4 shadow w-fit w-full"
                       :class="[IsSystemMessage(msg) ? 'bg-teal-50' : 'bg-gray-100']">
                    <div>{{ msg.text }}</div>
                    <div class="text-gray-400 text-xs">{{
                        msg.timestamp.split('.')[0].split("T")[1]
                      }}
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="chat.status === ChatStatus.Pending"
                   class="p-3 rounded-md col-start-6 col-end-13 max-sm:col-start-2">
                <div class="flex flex-row-reverse flex-row items-center">
                  <div class="spinner">
                    <div class="double-bounce1"></div>
                    <div class="double-bounce2"></div>
                  </div>
                  <div class="relative mx-3 text-sm bg-teal-50 py-2 px-4 shadow w-fit w-full">
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

        <div class="flex" v-if="chat.status !== ChatStatus.Resolved">
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

        <div v-else-if="chat.status === ChatStatus.Resolved" class="w-full p-4">
          <h4 class="text-gray-500">
            Summary:
          </h4>
          <textarea rows="4"
                    class="block mt-2 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Write your thoughts here..."
                    v-model="summary"></textarea>
          <button @click.prevent="updateSummary"
                  class="inline-flex mt-4 items-center rounded-md border border-gray-300 bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  type="button">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {IAuthUser} from "~/composables/auth.cient";
import {
  ChatStatus,
  navigateTo,
  onUnmounted,
  onUpdated,
  ref,
  useAbortChat,
  useAuthUser,
  useNewExpert,
  useRoute,
  useRuntimeConfig,
  useState,
  useUpdateChat,
  useUpdateUser,
  useUser
} from "#imports";
import {
  collection,
  doc,
  getFirestore,
  increment,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
  where
} from "firebase/firestore";
import {getMessaging, getToken} from "@firebase/messaging";
import {IChat, IMessage, useGetChat, useSendMessage, useSendSystemMessage} from "~/composables/chats.client";

definePageMeta({
  middleware: ['auth', 'chat']
})

const container = ref()
const message = ref<string>()
const chatID = useState("chat_id", () => useRoute().params.id)
const messages = useState<Array<IMessage>>('counter', () => [])
const authUser = <IAuthUser>await useAuthUser()
const user = await useUser(authUser.uid)
const summary = ref<string>()
const input = ref()

let chat = ref<IChat>(await useGetChat(<string>chatID.value))

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
})

async function newExpert() {
  await useNewExpert(<string>chatID.value)
}

async function updateSummary() {
  if (!chat) {
    return
  }

  await useUpdateChat(chat.value.id, {
    summary: summary.value
  })

  await navigateTo("/chats")
}

async function send() {
  input.value.focus()
  if (message.value == "") {
    return
  }

  await useSendMessage(<string>chatID.value, <string>message.value)

  const amIResolver = chat.value.createdBy != authUser.uid
  if (amIResolver) {
    if (!chat.value.newMessages) {
      chat.value.newMessages = 1
    } else {
      chat.value.newMessages += 1
    }
    await useUpdateChat(chat.value.id, {
      newMessages: chat.value.newMessages
    })
  } else if (chat.value.responser) {
    await useUpdateChat(chat.value.id, {
      "responser.newMessages": increment(1)
    })
  }

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

function abortChat() {
  useAbortChat(<string>chatID.value)
}

function IsPanelEnabled(): boolean {
  const c = chat.value

  if (!c) {
    return false
  }

  return ![ChatStatus.Closed, ChatStatus.Resolved].includes(c.status) && c.createdBy === authUser.uid
}

function IsSystemMessage(msg: IMessage): boolean {
  return !msg.author
}

function IsAuthUserMessage(msg: IMessage): boolean {
  return msg.author?.id !== authUser?.uid
}

async function unCountMessages() {
  const amIResolver = chat.value.createdBy != authUser.uid

  const responser = chat.value.responser
  if (amIResolver) {
    if (responser)
      responser.newMessages = 0
    await useUpdateChat(chat.value.id, {
      responser: responser
    })
  } else if (responser) {
    await useUpdateChat(chat.value.id, {
      newMessages: 0
    })
  }
}

onUpdated(() => {
  scrollBottom()
})

onMounted(async () => {
  messages.value = [];

  if (!authUser) {
    return
  }

  await unCountMessages()

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
      const m = <IMessage>change.doc.data()
      if (!m.author && chat.value.createdBy != authUser.uid) {
        return
      }
      messages.value.push(m);
      if (messages.value.length > 10) {
        messages.value.shift()
      }
    });
  });

  chatUnsubscribe = onSnapshot(doc(getFirestore(), "chats", <string>chatID.value), (snapshot) => {
    if (!snapshot.exists()) {
      return
    }

    const lastStatus = chat.value.status

    chat.value = <IChat>snapshot.data()
    summary.value = chat.value.summary

    if (chat.value.createdBy != authUser.uid && [ChatStatus.Resolved, ChatStatus.Pending, ChatStatus.Closed].includes(chat.value.status)) {
      navigateTo("/chats")
      return;
    }

    if (lastStatus == ChatStatus.Pending && chat.value.status == ChatStatus.Opened && chat.value.responser) {
      useSendSystemMessage(chat.value.responser.name + " was founded. He'll answer as soon as possible.", <string>chatID.value)
    }
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

  await unCountMessages()
})
</script>
