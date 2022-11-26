<template>
  <div class="bg-gray-100 flex-1 flex flex-col">
    <div class="flex flex-col h-fit p-6 flex-1 max-md:p-0 border-gray-700 mx-auto max-w-7xl overflow-x-hidden w-full">
      <div
          class="flex flex-col items-stretch flex-1 flex-shrink-0 rounded-md bg-white p-6 max-md:rounded-none max-md:p-4">

        <h2 class="text-2xl my-2 mb-4">
          Chats
        </h2>
        <p class="mb-3 font-light text-gray-500 dark:text-gray-400">Some sescription what is chats. Link issues across
          Jira and ingest data from other software development tools, so your IT support and operations teams have
          richer contextual information to rapidly respond to requests, incidents, and changes.</p>
        <p class="font-light text-gray-500 dark:text-gray-400">Deliver great service experiences fast - without the
          complexity of traditional ITSM solutions.Accelerate critical development work, eliminate toil, and deploy
          changes with ease, with a complete audit trail for every change.</p>


        <div class="my-8">
          <NuxtLink to="/chats/new"
                    class="bg-teal-800 text-white hover:bg-teal-700 px-3 py-2 my-4 rounded-md font-medium">
            Create Chat
          </NuxtLink>
        </div>

        <h3 class="mb-4 text-base font-normal text-gray-500 text-xl">Chats chronology</h3>

        <ol class="relative border-l border-gray-200 dark:border-gray-300">
          <li class="mb-10 ml-4" v-for="chat in chats">
            <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
            <time class="mb-1 text-sm font-normal leading-none text-gray-400">
              {{ chat.createdAt.split('.')[0].replace('T', ' ') }}
            </time>
            <p>
              <NuxtLink :to="`chats/${chat.id}`" class="text-lg font-semibold text-gray-900">{{ chat.topic }}</NuxtLink>
            </p>
            <p class="mb-4 text-base font-normal text-gray-500">{{ chat.firstMessage }}</p>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useChats} from "~/composables/chats.client";
import {useAuthUser} from "~/composables/auth.cient";

definePageMeta({
  middleware: ['auth']
})

const authUser = await useAuthUser()
const chats = await useChats(authUser?.uid)
</script>
