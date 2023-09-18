<template>
  <div
    v-if="authModule.isAuthenticated"
    class="mx-4 mt-4 flex h-[91vh] flex-col"
  >
    <h1 class="text-2xl font-bold text-gray-700">Search</h1>
    <div class="flex items-center">
      <a
        href="#"
        class="mr-4 font-semibold text-blue-800 transition duration-150 hover:text-blue-900"
        @click="filters.$reset()"
        >Clear Filters</a
      >

      <ListSelect
        class="z-10 w-48"
        v-model="filters.selectedColumns"
        :options="filters.fixedColumns"
        multiple
      >
        Columns to Show
      </ListSelect>

      <div class="z-10 ml-auto flex items-center space-x-2">
        <span class="mr-4 font-semibold">Results: {{ filters.resultNum }}</span>

        <span>Display: </span>
        <ListSelect v-model="filters.selectedDisplay" :options="displayOptions">
          {{ filters.selectedDisplay }}
        </ListSelect>

        <span>Page: </span>
        <ListSelect v-model="filters.selectedPage" :options="pageOptions">
          {{ filters.selectedPage }} of {{ lastPageNumber }}
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
import { useSearchFiltersStore } from '../store/searchfilters'
import { computed } from 'vue'
import { mdiArrowLeft, mdiArrowRight } from '@mdi/js'

const authModule = useAuthStore()
const filters = useSearchFiltersStore()

const previousPage = () => {
  if (filters.selectedPage > 1) {
    filters.selectedPage--
  }
}

const nextPage = () => {
  if (filters.selectedPage < lastPageNumber.value) {
    filters.selectedPage++
  }
}

// dropdown option values
const displayOptions = [5, 10, 20, 50, 100]
const lastPageNumber = computed(() =>
  Math.max(1, Math.ceil(filters.resultNum / filters.selectedDisplay))
)
const pageOptions = lastPageNumber

// not authenticated? go back to loginpage
if (!authModule.isAuthenticated) {
  window.location.href = '/'
}
</script>
