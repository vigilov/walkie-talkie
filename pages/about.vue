<template>
  <div class="relative px-6 lg:px-8">
    <div class="mx-auto max-w-3xl pt-15 pb-32 sm:pt-28 sm:pb-20">
      <div>
        <div>
          <ContentDoc class="prose"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "about"
}

definePageMeta({
  layout: "landing"
})

</script>

<style scoped>

</style>