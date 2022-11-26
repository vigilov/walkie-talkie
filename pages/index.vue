<template>
  <div class="relative px-6 lg:px-8">
    <div class="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
      <div>
        <div class="hidden sm:mb-8 sm:flex sm:justify-center">
          <div class="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                <span class="text-gray-600">
                  How does it work? <NuxtLink to="/features" class="font-semibold text-indigo-600"><span class="absolute inset-0" aria-hidden="true" />Read more <span aria-hidden="true">&rarr;</span></NuxtLink>
                </span>
          </div>
        </div>
        <div>
          <h1 class="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">Walkie-Talkie</h1>
          <p class="mt-6 text-lg leading-8 text-gray-600 sm:text-center"><ContentDoc /></p>
          <div class="mt-8 flex gap-x-4 sm:justify-center">
            <a href="#" class="inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700">
              Become a customer
              <span class="text-indigo-200" aria-hidden="true">&rarr;</span>
            </a>
            <a href="#" class="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 text-gray-900 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Become an expert
              <span class="text-gray-400" aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
definePageMeta({
  layout: "landing"
})
</script>

<style scoped>

</style>