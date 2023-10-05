<template>
  <div class="mt-5 container mx-auto lg:px-48 px-6">
  <div class="text-gray-800">
    <header class="mb-3 text-3xl font-bold">
      Welcome to Name X!
    </header>
    <span>Canada's most modern, semi-automated way to examine business name
      requests. Automated indicators show you:</span>

    <div class="ml-10 mb-5 space-y-1">
      <div>
        <header class="text-xl font-semibold">
          Conflicts
        </header>
        <p class="ml-6">Searches the name against related industry categories, synonyms,
          word substitutions (eg. 9 and nine), and more. The conflict search
          is only as good as the information in it, so if you don't see
          something come back in the search you should check the SOLR admin
          tool to see if it is in the correct industry category or other
          search options.</p>
      </div>

      <div>
        <header class="text-xl font-semibold">
          Condition
        </header>
        <p class="ml-6">This gives you the messages to clients and internal information
          based on condition of words or phrases, eg. 'Doctor', 'BC', and
          such.</p>
      </div>

      <div>
        <header class="text-xl font-semibold">
          Trademarks
        </header>
        <p class="ml-6">Searches the Canadian Trademarks database and shows you active
          trademarks related to the name request</p>
      </div>

      <div>
        <header class="text-xl font-semibold">
          History
        </header>
        <p class="ml-6">If a similar name has been approved or rejected previously (use
          this to tell you if they are holding a name too long).</p>
      </div>
    </div>

    <StatsBox />
  </div>
</div>
</template>

<script setup>
import StatsBox from '../components/StatsBox.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { Routes } from '../enums/routes'

const authModule = useAuthStore()
const router = useRouter()

const gotoHomePage = () => {
  router.push(Routes.HOME)
}

// Function called when the component is mounted
gotoHomePage()

// not authenticated? go back to login page

if (!authModule.isAuthenticated) {
  window.location.href = '/'
}
</script>
