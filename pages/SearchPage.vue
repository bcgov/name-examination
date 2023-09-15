<template>
  <div v-if="authModule.isAuthenticated">
    <h1 class="ml-5 mt-5 text-2xl font-bold text-gray-700">Search</h1>
    <div class="ml-5 flex items-center">
      <a
        href="#"
        class="mr-5 font-semibold text-blue-800 transition duration-150 hover:text-blue-900"
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

      <div class="z-10 ml-auto flex items-center space-x-3">
        <span class="mr-5 font-semibold">Results: {{ numResults }}</span>

        <span>Display: </span>
        <ListSelect
          v-model="selectedDisplay"
          :options="displayOptions"
          class="w-20"
        >
          {{ selectedDisplay }}
        </ListSelect>

        <span>Page: </span>
        <ListSelect v-model="selectedPage" :options="pageOptions">
          {{ selectedPage }} of {{ pageOptions }}
        </ListSelect>
      </div>

      <div class="relative ml-5 mr-10 mt-1 flex space-x-2">
        <IconButton @click="previousPage()" :icon-path="mdiArrowLeft" />
        <IconButton @click="nextPage()" :icon-path="mdiArrowRight" />
      </div>
    </div>
    <SearchBox class="mx-5 mt-14 h-fit" />
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth'
import { searchFiltersStore } from '../store/searchfilters'
import { computed } from 'vue'
import SearchBox from '../components/SearchBox.vue'
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
