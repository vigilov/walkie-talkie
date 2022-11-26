<template>
  <div>
    <label for="tag" class="text-gray-600">Interested Keywords</label>
    <div class="flex my-2">
      <input id="tag" name="tag" type="text" v-model="text"
             class="flex-1 relative block w-full appearance-none rounded-l-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
      />
      <button type="button" @click="add"
              class="inline-flex justify-center rounded-r-md border border-transparent bg-teal-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-r-offset-2">
        Add
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const text = ref<string>()

const emit = defineEmits(["newTag"])

function add() {
  if (text.value && text.value.replaceAll(" ", "") != "") {
    emit('newTag', text.value)
    text.value = ""
  }
}

</script>
