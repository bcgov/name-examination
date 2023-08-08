<!--eslint-disable -->
<template>
  <div class="w-10/12">
    <div
      v-if="!authModule.isAuthenticated"
      class="relative left-72 top-28 text-2xl font-semibold text-gray-800"
    >
      <p>Your authorization is missing or has expired. Please login.</p>
    </div>

    <div
      v-else
      class="relative left-72 top-10 text-2xl text-gray-800"
    >
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
  </div>
</template>

<script setup>
/* eslint-disable vue/multi-word-component-names */

import { useAuthStore } from '../store/auth'
import StatsBox from '../components/StatsBox.vue'
const authModule = useAuthStore()

</script>
