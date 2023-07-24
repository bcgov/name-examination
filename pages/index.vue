<template>

<div class="w-10/12">

  <div class="text-2xl text-gray-800 font-semibold relative top-28 left-72" v-if="!authModule.isAuthenticated">
    <span>Your authorization is missing or has expired. Please login.</span>
  </div>

  <div class="text-2xl text-gray-800 relative top-10 left-72" v-else>
    <header class="font-bold text-5xl mb-10">Welcome to Name X!</header>
    <span>Canada's most modern, semi-automated way to examine business name requests. Automated indicators show you:</span>

    <div class="m-10">
      <div class=" my-10">
        <header class = "text-3xl font-semibold">Conflicts</header>
        <span class="mt-6">Searches the name against related industry categories, synonyms, word substitutions (eg. 9 and nine), and more. The conflict search is only as good as the information in it, so if you don't see something come back in the search you should check the SOLR admin tool to see if it is in the correct industry category or other search options.</span>
      </div>

      <div class="my-10">
        <header class = "text-3xl font-semibold">Condition</header>
        <span class="mt-6">This gives you the messages to clients and internal information based on condition of words or phrases, eg. 'Doctor', 'BC', and such.</span>
      </div>

      <div class="my-10">
        <header class = "text-3xl font-semibold">Trademarks</header>
        <span class="mt-6">Searches the Canadian Trademarks database and shows you active trademarks related to the name request</span>
      </div>

      <div class="my-10">
        <header class = "text-3xl font-semibold">History</header>
        <span class="mt-6">If a similar name has been approved or rejected previously (use this to tell you if they are holding a name too long).</span>
      </div>

    </div>

    <div class="stats-box shadow-lg mr-20">
      <div class="mt-2 mb-6 ml-2">Current status on {{ status.todayStr }}</div>
      <div class="my-6 ml-2">Not Examined: <span class=" font-bold">{{ status.notExaminedNum }}</span></div>
      <div class="mt-6 mb-2 ml-2">Hold: <span class=" font-bold">{{ status.holdNum }}</span></div>
    </div>
  
  </div>

</div>

</template>

<script setup>
import { Fetchstatus } from '~/store/fetchstatus';
import { useAuthStore } from '~/store/auth';

const status = Fetchstatus()
const authModule = useAuthStore()

// Watch for changes in the authentication status
watch(() => authModule.isAuthenticated, (newVal, oldVal) => {
  // newVal is the new authentication status
  // oldVal is the old authentication status
  if (newVal === true) { // if user is authenticated
    status.getHoldedNum()
    status.getExaminedNum()
  }
}, { immediate: false }) // 'immediate: false' ensures the watcher only triggers on changes, not on initialization

</script>