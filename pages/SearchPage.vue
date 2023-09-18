<template>
  <div v-if="authModule.isAuthenticated" class="flex flex-col h-[91vh] mx-4 mt-4">
    <h1 class="text-2xl font-bold text-gray-700">Search</h1>
    <div class="flex items-center">
      <a
        href="#"
        class="mr-4 font-semibold text-blue-800 transition duration-150 hover:text-blue-900"
        @click="filters.resetFilters()"
        >Clear Filters</a
      >

      <ListSelect
        class="z-10 w-48"
        v-model="selectedColumns"
        :options="filters.fixedColumns"
        multiple
        is-object
      >
        Columns to Show
      </ListSelect>

      <div class="z-10 ml-auto flex items-center space-x-2">
        <span class="mr-4 font-semibold">Results: {{ numResults }}</span>

        <span>Display: </span>
        <ListSelect
          v-model="selectedDisplay"
          :options="displayOptions"
        >
          {{ selectedDisplay }}
        </ListSelect>

        <span>Page: </span>
        <ListSelect v-model="selectedPage" :options="pageOptions">
          {{ selectedPage }} of {{ pageOptions }}
        </ListSelect>
      </div>

      <div class="ml-4 space-x-2">
        <IconButton @click="previousPage()" :icon-path="mdiArrowLeft" />
        <IconButton @click="nextPage()" :icon-path="mdiArrowRight" />
      </div>
    </div>
    <SearchResultsBox class="my-4" />
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth'
import { searchFiltersStore } from '../store/searchfilters'
import { computed } from 'vue'
import { mdiArrowLeft, mdiArrowRight } from '@mdi/js'

const authModule = useAuthStore()
const filters = searchFiltersStore()

// Values selected form the dropdown, also being updated in the pinia store
const selectedColumns = computed({
  get: () => filters.selectedColumns,
  set: (newValue) => {
    filters.setSelectedColumns(newValue)
  },
})

const selectedDisplay = computed({
  get: () => filters.selectedDisplay,
  set: (newValue) => {
    filters.setSelectedDisplay(newValue)
  },
})

const selectedPage = computed({
  get: () => filters.selectedPage,
  set: (newValue) => {
    filters.setSelectedPage(newValue)
  },
})

// page change functions
const previousPage = () => {
  if (selectedPage.value > 1) {
    selectedPage.value--
  }
}

const nextPage = () => {
  if (selectedPage.value < pageOptions.value) {
    selectedPage.value++
  }
}

// dropdown option values
const numResults = computed(() => filters.resultNum)
const displayOptions = [5, 10, 20, 50, 100]
const lastPageNumber = computed(() =>
  Math.ceil(numResults.value / selectedDisplay.value)
)
// const pageOptions = computed(() => [...Array(lastPageNumber+1).keys()])
const pageOptions = lastPageNumber

// not authenticated? go back to loginpage
if (!authModule.isAuthenticated) {
  window.location.href = '/'
}
</script>
