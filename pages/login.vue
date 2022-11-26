<template>
  <div class="flex h-screen items-center justify-center py-12 px-4 max-sm:px-0 max-sm:w-full lg:px-8 bg-gray-50">
    <div class="w-full max-w-md space-y-8 max-sm:max-w-full">
      <div>
        <img class="mx-auto h-12 w-auto " src="/logo.webp" alt="Walkie-Talkie"/>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          {{ ' ' }}
          <a href="#" class="font-medium text-teal-600 hover:text-teal-500">sign up. in development. use google auth</a>
        </p>
      </div>
      <div class="shadow p-6  bg-white rounded max-sm:rounded-none">
        <form action="#" class="space-y-6" method="POST">
          <div class="-space-y-px rounded-md">
            <div class="py-2">
              <label for="email-address">Email address</label>
              <input id="email-address" name="email" type="email" autocomplete="email" required=""
                     class="mt-2 relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                     placeholder="Email address"/>
            </div>
            <div class="py-2">
              <label for="password">Password</label>
              <input id="password" name="password" type="password" autocomplete="current-password" required=""
                     class="mt-2 relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                     placeholder="Password"/>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox"
                     class="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"/>
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-teal-600 hover:text-teal-500">Forgot your password?</a>
            </div>
          </div>

          <div>
            <button type="submit" class="
          group
          relative
          flex w-full
          justify-center
          rounded-md
          py-2
          px-4
          text-sm
          border-teal-500
          border
          font-medium
          text-teal-700
          focus:outline-none
          focus:ring-2
          focus:ring-teal-500
          focus:ring-offset-2">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            </span>
              Sign in
            </button>
          </div>
        </form>

        <div class="w-full border-t mt-6"></div>
        <span class="text-gray-500 text-xs">or sign with</span>
        <div>
          <div @click="signInWithGoogle"
               class="p-4 py-3 my-2 rounded cursor-pointer text-teal-600 border border-teal-500 w-fit hover:bg-teal-600 hover:text-white">
            Google
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "",
})

import {useSignInWithGoogle} from "~/composables/useUser"
import {navigateTo} from "#imports"

async function signInWithGoogle() {
  try {
    await useSignInWithGoogle()

    navigateTo("/chats")
  } catch (e) {
    console.log("can't auth with google", e)
  }
}
</script>
