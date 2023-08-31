<template>
  <div v-if="authModule.isAuthenticated">
    <h1 class="text-4xl font-bold text-gray-700 mt-10 ml-10">
      Search
    </h1>
    <div
      id=""
      class="ml-10 mt-6 flex items-center text-lg"
    >
      <a
        href="#"
        class="text-blue-800 mr-5 font-semibold align-middle hover:text-blue-900 transition duration-150"
        @click="filters.resetFilters()"
      >Clear Filters</a>
      <div class="relative columnsDropdown z-10">
        <button
          class="transition ease-in-out delay-120 hover:-translate-y-2 hover:scale-115 duration-300
          px-4 py-2 border border-gray-300 bg-white text-black w-60 ml-5 mt-1"
          @click="toggleDropdown('columnsDropdown')"
        >
          <span class="mr-2">Columns to Show</span>
          <font-awesome-icon
            :icon="['fas', 'arrow-down']"
            :class="columnsDropdown ? 'rotate-180' : 'rotate-0'"
            class=""
          />
        </button>
        <transition name="fade">
          <div
            v-show="columnsDropdown"
            class="absolute left-0 mt-2 ml-5 py-2 px-3 bg-white rounded shadow-xl w-60 duration-500"
          >
            <label
              v-for="(column, index) in columns"
              :key="index"
              class="block px-4 py-2"
            >
              <input
                v-model="selectedColumns"
                type="checkbox"
                :value="column.name"
                class="mr-2"
              >
              {{ column.key }}
            </label>
          </div>
        </transition>
      </div>
      <div class="text-lg ml-auto mr-10 flex z-10">
        <span class="align-middle ml-10 font-semibold mt-3">Results: {{ numResults }}</span>
        <div class="relative displayDropdown ml-5">
          <button
            class="transition ease-in-out delay-120 hover:-translate-y-2 hover:scale-115 duration-300
            px-4 py-2 border border-gray-300 bg-white text-black w-60 mt-1"
            @click="toggleDropdown('displayDropdown')"
          >
            <span class="mr-2">Display</span>
            <font-awesome-icon
              :icon="['fas', 'arrow-down']"
              :class="displayDropdown ? 'rotate-180' : 'rotate-0'"
            />
          </button>
          <transition name="fade">
            <div
              v-show="displayDropdown"
              class="absolute left-0 mt-2 py-2 px-3 bg-white rounded shadow-xl w-60 duration-500"
            >
              <label
                v-for="display in displayOptions"
                :key="display"
                class="block px-4 py-2"
              >
                <input
                  v-model="selectedDisplay"
                  type="radio"
                  :value="display"
                  class="mr-2"
                >
                {{ display }}
              </label>
            </div>
          </transition>
        </div>

        <div class="relative pageDropdown ml-5 z-10">
          <button
            class="transition ease-in-out delay-120 hover:-translate-y-2 hover:scale-115 duration-300
            px-4 py-2 border border-gray-300 bg-white text-black w-60 mt-1"
            @click="toggleDropdown('pageDropdown')"
          >
            <span class="mr-2">Page</span>
            <font-awesome-icon
              :icon="['fas', 'arrow-down']"
              :class="pageDropdown ? 'rotate-180' : 'rotate-0'"
            />
          </button>
          <transition name="fade">
            <div
              v-show="pageDropdown"
              class="absolute left-0 mt-2 py-2 px-3 bg-white rounded shadow-xl w-60 h-72 duration-500 overflow-y-auto"
            >
              <label
                v-for="page in pageOptions"
                :key="page"
                class="block px-4 py-2"
              >
                <input
                  v-model="selectedPage"
                  type="radio"
                  :value="page"
                  class="mr-2"
                >
                {{ page }}
              </label>
            </div>
          </transition>
        </div>
      </div>
      <div class="relative ml-5 mr-10 mt-1 flex space-x-2">
        <button
          class="bcgovblue-btn w-20 transition ease-in-out delay-120 hover:-translate-y-2
   hover:scale-115 duration-300 px-4 py-2 text-white border
   rounded-lg focus:ring-4 focus:outline-none
   focus:ring-amber-300 dark:bg-amber-200 dark:hover:bg-amber-400 dark:focus:ring-amber-200"
          @click="previousPage()"
        >
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </button>
        <button
          class="bcgovblue-btn w-20 transition ease-in-out delay-120 hover:-translate-y-2
   hover:scale-115 duration-300 px-4 py-2 text-white border
   rounded-lg focus:ring-4 focus:outline-none
   focus:ring-amber-300 dark:bg-amber-200 dark:hover:bg-amber-400 dark:focus:ring-amber-200"
          @click="nextPage()"
        >
          <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </button>
      </div>
    </div>
    <SearchBox class="mx-10 mt-14 search-box" />
  </div>
</template>

<script setup>
import { faArrowDown, faArrowUp, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { useAuthStore } from '../store/auth'
import { searchFiltersStore } from '../store/searchfilters'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import SearchBox from '../components/SearchBox.vue'
library.add(faArrowDown, faArrowUp, faArrowRight, faArrowLeft)

const authModule = useAuthStore()
const filters = searchFiltersStore()

// reactive values

// Ref for which dropdowns to toggle
const columnsDropdown = ref(false)
const displayDropdown = ref(false)
const pageDropdown = ref(false)

// Values selected form the dropdown, also being updated in the pinia store
const selectedColumns = computed({
  get: () => filters.selectedColumns,
  set: (newValue) => { filters.setSelectedColumns(newValue) }
})

const selectedDisplay = computed({
  get: () => filters.selectedDisplay,
  set: (newValue) => { filters.setSelectedDisplay(newValue) }
})

const selectedPage = computed({
  get: () => filters.selectedPage,
  set: (newValue) => { filters.setSelectedPage(newValue) }
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
const displayOptions = [5, 10, 20, 50, 100]
const numResults = computed(() => filters.resultNum)
const pageOptions = computed(() => Math.ceil(numResults.value / selectedDisplay.value)) // last page number
const columns = filters.fixedColumns

// to close dropdown when click triggered outside of it OR when it's itself clicked

const toggleDropdown = (dropdownName, event = null) => {
  if (event) {
    if (columnsDropdown.value && !event.target.closest('.columnsDropdown')) columnsDropdown.value = false
    if (displayDropdown.value && !event.target.closest('.displayDropdown')) displayDropdown.value = false
    if (pageDropdown.value && !event.target.closest('.pageDropdown')) pageDropdown.value = false
    return
  }

  if (dropdownName === 'columnsDropdown') columnsDropdown.value = !columnsDropdown.value
  if (dropdownName === 'displayDropdown') displayDropdown.value = !displayDropdown.value
  if (dropdownName === 'pageDropdown') pageDropdown.value = !pageDropdown.value
}

onMounted(() => {
  document.addEventListener('click', (event) => {
    toggleDropdown(null, event)
  })
})

onUnmounted(() => {
  document.removeEventListener('click', (event) => {
    toggleDropdown(null, event)
  })
})

// not authenticated? go back to loginpage

if (!authModule.isAuthenticated) {
  window.location.href = '/'
}
</script>

<style lang ='scss' scoped>
@import '../assets/theme.scss';
/*cool transitions for when the dropdowns are opened or closed */
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s, transform .5s;
}

.rotate-180 {
  transition: transform 0.3s;
  transform: rotate(180deg);
}

.rotate-0 {
  transition: transform 0.3s;
  transform: rotate(0deg);
}

.search-box{
  max-height: 60rem;
}
.bcgovblue-btn {
  background-color: $BCgovBlue5;
  &:hover {
    background-color: $BCgovGold5;
  }
}
</style>

<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.3/css/all.css">
