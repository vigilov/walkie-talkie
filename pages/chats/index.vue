<template>
  <div class="bg-gray-100 flex-1 flex flex-col">
    <div class="flex flex-col h-fit p-6 flex-1 max-md:p-0 border-gray-700 mx-auto max-w-7xl overflow-x-hidden w-full">
      <div
          class="flex flex-col items-stretch flex-1 flex-shrink-0 rounded-md bg-white p-6 max-md:rounded-none max-md:p-4">

        <h2 class="text-2xl my-2 mb-4">
          Chats
        </h2>
        <p class="mb-3 font-light text-gray-500 dark:text-gray-400">Create a new chat to ask your question and find an
          expert.</p>


        <div class="my-8">
          <NuxtLink to="/chats/new"
                    class="bg-teal-800 text-white hover:bg-teal-700 px-3 py-2 my-4 rounded-md font-medium">
            Create Chat
          </NuxtLink>
        </div>

        <h3 class="mb-4 text-2xl text-base font-normal text-gray-500" v-if="myChats.length > 0">Your Chats</h3>

        <ol class="relative border-l border-gray-200 dark:border-gray-300">
          <li class="mb-10 ml-4" v-for="chat in myChats">

            <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
            <time class="mb-1 text-sm font-normal leading-none text-gray-400">
              {{ typeof (chat.createdAt) === "string" ? chat.createdAt.split('.')[0].replace('T', ' ') : '' }}
            </time>

            <NuxtLink :to="`/chats/${chat.id}`"
                      class="relative block w-full max-w-xl p-5 bg-white border border-gray-200 rounded-lg shadow-md flex flex-row justify-between">
              <div class="w-full">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{{ chat.topic }}</h5>
                <p class="font-normal text-gray-700"
                   :class="chat.status === ChatStatus.Closed || chat.status === ChatStatus.Resolved ? 'text-gray-400' : ''">
                  {{ chat.firstMessage }}</p>
              </div>
              <div class="w-fit flex flex-col items-end justify-between ml-2">
                <div
                    class="hover:bg-teal-600 text-gray-400 rounded-full h-8 w-8 flex justify-center items-center hover:text-white"
                    @click.prevent="removeChat(chat.id)">
                  <Icon name="uil:trash" class="text-2xl"/>
                </div>

                <div class="flex flex-row min-w-max  mt-4">
                  <ChatStatusPanel :id="chat.id"/>
                </div>
              </div>
            </NuxtLink>
          </li>
        </ol>

        <h3 class="mb-4 text-2xl text-base font-normal text-gray-500 mt-4q" v-if="othersChats.length > 0">Others
          Chats</h3>

        <ol class="relative border-l border-gray-200 dark:border-gray-300">
          <li class="mb-10 ml-4" v-for="chat in othersChats">

            <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
            <time class="mb-1 text-sm font-normal leading-none text-gray-400">
              {{ typeof (chat.createdAt) === "string" ? chat.createdAt.split('.')[0].replace('T', ' ') : '' }}
            </time>

            <NuxtLink :to="`/chats/${chat.id}`"
                      class="relative block w-full max-w-xl p-5 bg-white border border-gray-200 rounded-lg shadow-md flex flex-row justify-between">
              <div class="w-full">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">{{ chat.topic }}</h5>
                <p class="font-normal text-gray-700"
                   :class="chat.status === ChatStatus.Closed || chat.status === ChatStatus.Resolved ? 'text-gray-400' : ''">
                  {{ chat.firstMessage }}</p>
              </div>
              <div class="w-fit flex flex-col items-end justify-between ml-2">
                <div
                    class="hover:bg-teal-600 text-gray-400 rounded-full h-8 w-8 flex justify-center items-center hover:text-white"
                    @click.prevent="removeChat(chat.id)">
                  <Icon name="uil:trash" class="text-2xl"/>
                </div>

                <div class="flex flex-row min-w-max  mt-4">
                  <ChatStatusPanel :id="chat.id"/>
                </div>
              </div>
            </NuxtLink>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useMyChats, useDeleteChat, useOthersChats} from "#imports";
import {useAuthUser} from "~/composables/auth.cient";
import {IChat} from "~/composables/chats.client";

definePageMeta({
  middleware: ['auth']
})

const authUser = await useAuthUser()
const myChats = ref(<Array<IChat>>await useMyChats(authUser?.uid))

const othersChats = ref(<Array<IChat>>await useOthersChats(authUser?.uid))

async function removeChat(id: string) {
  await useDeleteChat(id)
  await navigateTo("/chats")

  myChats.value = await useMyChats(authUser?.uid)
  othersChats.value = await useOthersChats(authUser?.uid)
}
</script>
