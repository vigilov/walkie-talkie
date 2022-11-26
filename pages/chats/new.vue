<template>
  <div class="bg-gray-50 flex-1 flex flex-col">
    <div class="flex flex-col h-fit p-6 flex-1 max-md:p-0 border-gray-700 mx-auto max-w-7xl overflow-x-hidden w-full">
      <div
          class="flex flex-col items-stretch flex-shrink-0 rounded-md bg-white p-4 max-md:rounded-none max-md:p-0 bg-gray-100">

        <div class="mt-10 md:mt-0">
          <div class="md:grid md:grid-cols-3 md:gap-6">
            <div class="md:col-span-1">
              <div class="px-4 md:px-0">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Create new chat</h3>
                <p class="mt-1 text-sm text-gray-600">asd asd asda
                  da dasd asd masdmklasd asdf asdf asdf asdfa sd asfas fasdf asdf asd f af a sdf adfadsf a</p>
              </div>
            </div>
            <div class="mt-5 md:col-span-2 md:mt-0">
              <form action="#" @submit.prevent="create">
                <div class="shadow sm:overflow-hidden md:rounded-md">
                  <div class="space-y-6 bg-white px-4 py-5 sm:p-6">

                    <div>
                      <label for="about" class="block text-sm font-medium text-gray-700">Topic</label>
                      <div class="mt-1">
                        <input id="topic" type="text" name="topic" v-model="topic" placeholder="PS5"
                               class="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"/>
                      </div>
                      <p class="mt-2 text-sm text-gray-500">Short name of your future chat</p>
                    </div>

                    <div>
                      <label for="message" class="block text-sm font-medium text-gray-700">First message</label>
                      <div class="mt-1">
                        <textarea id="about" name="message" v-model="message"
                                  placeholder="Where are the Play Station 5 sold in Cyprus?" rows="3"
                                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"/>
                      </div>
                      <p class="mt-2 text-sm text-gray-500">What are you looking for?</p>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Cover photo. IN DEVELOPING</label>
                      <div
                          class="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                        <div class="space-y-1 text-center">
                          <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none"
                               viewBox="0 0 48 48" aria-hidden="true">
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          <div class="flex text-sm text-gray-600">
                            <label for="file-upload"
                                   class="relative cursor-pointer rounded-md bg-white font-medium text-teal-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 hover:text-teal-500">
                              <span>Upload a file</span>
                              <input id="file-upload" name="file-upload" type="file" class="sr-only"/>
                            </label>
                            <p class="pl-1">or drag and drop</p>
                          </div>
                          <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button type="submit"
                            class="inline-flex justify-center rounded-md border border-transparent bg-teal-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                      Create
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

import {navigateTo, ref, useUpdateUser, useCreateChat, useAuthUser, useSendMessage} from "#imports";

const topic = ref<string>()
const message = ref<string>()

async function create() {
  const authUser = await useAuthUser()
  if (!authUser || !topic.value) {
    return
  }

  const chatID = useCreateUUID()

  await useCreateChat({
    id: chatID,
    firstMessage: <string>message.value,
    createdAt: new Date().toISOString(),
    unMatchedParticipants: [],
    createdBy: authUser.uid,
    status: "pending",
    topic: topic.value,
  })
  await useSendMessage(<string>message.value, chatID)
  await useUpdateUser(authUser.uid, {activeChat: chatID})
  await navigateTo(`/chats/${chatID}`)
}
</script>
