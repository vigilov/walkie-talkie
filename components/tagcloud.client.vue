<template>
  <div class="w-full h-full bg-transparent" ref="cloudBox">
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "#imports"
import WordCloud from "wordcloud";

const cloudBox = ref()
const props = defineProps(['words'])

onMounted(() => {
  if (cloudBox.value) {
    WordCloud(cloudBox.value, {
      list: props.words,
      gridSize: Math.round(16 * cloudBox.value.clientWidth / 1024),
      weightFactor: function (size) {
        return Math.pow(size, 2.3) / 10 * cloudBox.value.clientWidth / 1024;
      },
      fontFamily: 'Average, Times, serif',
      color: function() {
        return (['#d0d0d0', '#e11', '#44f'])[Math.floor(Math.random() * 3)]
      },
      rotateRatio: 0.5,
      backgroundColor: 'rgba(0,0,0,0)'
    });
  }

})

</script>
