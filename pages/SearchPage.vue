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
        @click="clearFilters()"
      >Clear Filters</a>
      <div class="relative columnsDropdown">
        <button
          class="transition ease-in-out delay-120 hover:-translate-y-2 hover:scale-115 duration-300
          px-4 py-2 border border-gray-300 bg-white text-black w-60 ml-5 mt-1"
          @click="toggleDropdown('columnsDropdown')"
        >
          <span class="mr-2">Columns to Show</span>
          <font-awesome-icon
            :icon="['fas', columnsDropdown ? 'arrow-up' : 'arrow-down']"
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
      <div class="text-lg ml-auto mr-10 flex">
        <span class="align-middle ml-10 font-semibold mt-3">Results: {{ results }}</span>
        <div class="relative displayDropdown ml-5">
          <button
            class="transition ease-in-out delay-120 hover:-translate-y-2 hover:scale-115 duration-300
            px-4 py-2 border border-gray-300 bg-white text-black w-60 mt-1"
            @click="toggleDropdown('displayDropdown')"
          >
            <span class="mr-2">Display</span>
            <font-awesome-icon
              :icon="['fas', displayDropdown ? 'arrow-up' : 'arrow-down']"
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

        <div class="relative pageDropdown ml-5">
          <button
            class="transition ease-in-out delay-120 hover:-translate-y-2 hover:scale-115 duration-300
            px-4 py-2 border border-gray-300 bg-white text-black w-60 mt-1"
            @click="toggleDropdown('pageDropdown')"
          >
            <span class="mr-2">Page</span>
            <font-awesome-icon
              :icon="['fas', pageDropdown ? 'arrow-up' : 'arrow-down']"
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
          class="w-20 transition ease-in-out delay-120 hover:-translate-y-2 hover:scale-115 duration-300 px-4 py-2
          text-white bg-blue-700 border
          border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
          dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-md"
          @click="previousPage"
        >
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </button>
        <button
          class="w-20 transition ease-in-out delay-120 hover:-translate-y-2 hover:scale-115 duration-300 px-4 py-2
          text-white bg-blue-700 border
          border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
          dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-md"
          @click="nextPage"
        >
          <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { faArrowDown, faArrowUp, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { useAuthStore } from '../store/auth'
import { ref, onMounted, onUnmounted, computed } from 'vue'

const authModule = useAuthStore()
library.add(faArrowDown, faArrowUp, faArrowRight, faArrowLeft)

// reactive values
const columnsDropdown = ref(false)
const displayDropdown = ref(false)
const pageDropdown = ref(false)
const selectedDisplay = ref(10)
const selectedPage = ref(1)
// all columns selected by defualt
const selectedColumns = ref(['Status', 'LastModifiedBy', 'NameRequestNumber', 'Names', 'ApplicantFirstName',
  'ApplicantLastName', 'NatureOfBusiness', 'ConsentRequired', 'Priority', 'ClientNotification', 'Submitted',
  'LastUpdate', 'LastComment'])

// dropdown option values
const displayOptions = [5, 10, 20, 50, 100]
const results = ref(1380) // need to set this based on actual results from api
const pageOptions = computed(() => Math.ceil(results.value / selectedDisplay.value))
const columns = [
  { name: 'Status', key: 'Status' },
  { name: 'LastModifiedBy', key: 'Modified By' },
  { name: 'NameRequestNumber', key: 'NR Number' },
  { name: 'Names', key: 'Names' },
  { name: 'ApplicantFirstName', key: 'Applicant First Name' },
  { name: 'ApplicantLastName', key: 'Applicant Last Name' },
  { name: 'NatureOfBusiness', key: 'Nature Of Business' },
  { name: 'ConsentRequired', key: 'Consent Required' },
  { name: 'Priority', key: 'Priority' },
  { name: 'ClientNotification', key: 'Notified' },
  { name: 'Submitted', key: 'Submitted' },
  { name: 'LastUpdate', key: 'Last Update' },
  { name: 'LastComment', key: 'Last Comment' }
]

// clear filters i.e return to orignal ref values

const clearFilters = () => {
  columnsDropdown.value = false
  displayDropdown.value = false
  pageDropdown.value = false
  selectedDisplay.value = 10
  selectedPage.value = 1
  selectedColumns.value = ['Status', 'LastModifiedBy', 'NameRequestNumber', 'Names', 'ApplicantFirstName',
    'ApplicantLastName', 'NatureOfBusiness', 'ConsentRequired', 'Priority', 'ClientNotification', 'Submitted',
    'LastUpdate', 'LastComment']
}

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

// not authenticated? go back to homepage

if (!authModule.isAuthenticated) {
  window.location.href = '/'
}
</script>

<style scoped>
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
</style>

<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.3/css/all.css">
