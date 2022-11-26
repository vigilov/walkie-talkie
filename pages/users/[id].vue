<template>
  <div class="bg-gray-100 flex-1 flex flex-col">
    <div class="flex flex-col h-fit p-6 flex-1 max-md:p-0 border-gray-700 mx-auto max-w-7xl overflow-x-hidden w-full">
      <div
          class="flex flex-col flex-1 items-stretch flex-shrink-0 rounded-md bg-white p-4 max-md:rounded-none max-md:p-0 bg-gray-50">

        <div class="mt-10 sm:mt-0">
          <div class="md:grid md:grid-cols-3 md:gap-6">
            <div class="md:col-span-1">
              <div class="px-4 sm:px-0">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Profile</h3>
                <p class="mt-1 text-sm text-gray-600">Decide which communications you'd like to receive and how.</p>
              </div>
            </div>
            <div class="mt-5 md:col-span-2 md:mt-0">
              <form action="#" method="POST">
                <div class="overflow-hidden shadow sm:rounded-md">
                  <div class="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <fieldset>
                      <legend class="sr-only">Roles</legend>
                      <div class="text-base font-medium text-gray-900" aria-hidden="true">Roles</div>
                      <div class="mt-4 space-y-4">
                        <div class="flex items-start">
                          <div class="flex h-5 items-center">
                            <input id="comments" name="comments" type="checkbox"
                                   class="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"/>
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="comments" class="font-medium text-gray-700">Expert</label>
                            <p class="text-gray-500">Get notified when someones posts a comment on a posting.</p>
                          </div>
                        </div>
                        <div class="flex items-start">
                          <div class="flex h-5 items-center">
                            <input id="candidates" name="candidates" type="checkbox"
                                   class="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"/>
                          </div>
                          <div class="ml-3 text-sm">
                            <label for="candidates" class="font-medium text-gray-700">Business</label>
                            <p class="text-gray-500">Get notified when a candidate applies for a job.</p>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    <TagsInput @newTag="newTag">

                    </TagsInput>

                    <div class="flex flex-wrap">
                      <div class="m-2 px-2 bg-teal-800 rounded text-white" v-for="tag in tags">{{tag}}</div>
                    </div>
                  </div>


                  <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button type="submit"
                            class="inline-flex justify-center rounded-md border border-transparent bg-teal-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        </div>
        <div class="flex w-full h-full justify-center">
          <WordCloud
              :words="[['Car.Toyota.Yaris.Filter.Buy', 12], ['Food.Dumplings.Buy', 6], ['Yanmar.1gm10', 10], ['baz', 2]]"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WordCloud from "~/components/tagcloud.client";
import TagsInput from "~/components/tagsinput.client"

const tags = ref<Array<string>>([])

function newTag(newTag: string) {
  if (!tags.value || tags.value.includes(newTag)) {
    return
  }
  tags.value.push(newTag)
}

</script>

<style scoped>

</style>