<template>
  <div class="relative left-72 top-10 text-2xl text-gray-800">
    <header class="mb-10 text-5xl font-bold">
      Welcome to Name X!
    </header>
    <span>Canada's most modern, semi-automated way to examine business name
      requests. Automated indicators show you:</span>

    <div class="m-10">
      <div class="my-10">
        <header class="text-3xl font-semibold">
          Conflicts
        </header>
        <span class="mt-6">Searches the name against related industry categories, synonyms,
          word substitutions (eg. 9 and nine), and more. The conflict search
          is only as good as the information in it, so if you don't see
          something come back in the search you should check the SOLR admin
          tool to see if it is in the correct industry category or other
          search options.</span>
      </div>

      <div class="my-10">
        <header class="text-3xl font-semibold">
          Condition
        </header>
        <span class="mt-6">This gives you the messages to clients and internal information
          based on condition of words or phrases, eg. 'Doctor', 'BC', and
          such.</span>
      </div>

      <div class="my-10">
        <header class="text-3xl font-semibold">
          Trademarks
        </header>
        <span class="mt-6">Searches the Canadian Trademarks database and shows you active
          trademarks related to the name request</span>
      </div>

      <div class="my-10">
        <header class="text-3xl font-semibold">
          History
        </header>
        <span class="mt-6">If a similar name has been approved or rejected previously (use
          this to tell you if they are holding a name too long).</span>
      </div>
    </div>

    <StatsBox />
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
