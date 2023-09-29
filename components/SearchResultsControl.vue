<template>
  <div class="flex items-center">
    <a
      href="#"
      class="mr-4 font-semibold text-blue-800 transition duration-150 hover:text-blue-900"
      @click="search.$reset()"
      >Clear Filters</a
    >

    <ListSelect
      class="z-10 w-48"
      v-model="search.selectedColumns"
      :options="search.fixedColumns"
      multiple
    >
      Columns to Show
    </ListSelect>

    <div class="z-10 ml-auto flex items-center space-x-2">
      <span class="mr-4 font-semibold">Results: {{ search.resultNum }}</span>

      <span>Display: </span>
      <ListSelect v-model="search.selectedDisplay" :options="DISPLAY_OPTIONS">
        {{ search.selectedDisplay }}
      </ListSelect>

      <span>Page: </span>
      <ListSelect v-model="search.selectedPage" :options="pageOptions">
        {{ search.selectedPage }} of {{ search.lastPageNumber }}
      </ListSelect>
    </div>

    <div class="ml-4 space-x-2">
      <IconButton
        @click="search.goToPreviousPage()"
        :icon-path="mdiArrowLeft"
      />
      <IconButton @click="search.goToNextPage()" :icon-path="mdiArrowRight" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { mdiArrowLeft, mdiArrowRight } from '@mdi/js'
import { useSearchStore } from '~/store/search'

const search = useSearchStore()

// dropdown option values
const DISPLAY_OPTIONS = [5, 10, 20, 50, 100]

// create array of values in range [1, lastPageNumber]
const pageOptions = computed(() =>
  Array.from({ length: search.lastPageNumber }, (_, key) => key + 1)
)
</script>
