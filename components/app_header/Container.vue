<template>
  <nav
    id="app-header"
    class="sticky top-0 z-50 h-16 border-b border-gray-300 bg-white"
  >
    <div class="flex h-full w-full items-center justify-between">
      <div class="hidden h-full lg:block">
        <nuxt-link :to="Route.Home">
          <img
            src="/images/top-nav.png"
            class="h-full min-w-8"
            alt="Name Examination"
          />
        </nuxt-link>
      </div>

      <div class="ml-3 flex gap-10 text-bcgov-blue5">
        <AppHeaderNavLink text="Admin" :route="Route.Admin" />
        <AppHeaderNavLink text="Examine Names" :route="Route.Examine" />
        <AppHeaderNavLink text="Search" :route="Route.Search" />
      </div>

      <div class="ml-auto flex items-center">
        <SearchInput
          v-model="searchText"
          class="mx-3"
          placeholder="Search NR Number"
          input-required
          @submit.prevent="onSearchSubmit"
        />

        <nuxt-link to="/stats" class="mx-3 text-sm text-blue-800 underline">
          <a>Stats</a>
        </nuxt-link>

        <div class="flex space-x-2 px-3">
          <ToggleSwitch
            label="Priority Queue"
            v-model="examineOptions.priorityQueue"
          />
        </div>

        <div class="flex flex-col border-l-2 border-gray-300 px-3">
          <span class="text-sm">{{ $userProfile.username }}</span>
          <a class="text-sm text-blue-800" href="#" @click="$auth.logout()">
            Log Out
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useExaminationOptions } from '~/store/examine/options'
import { Route } from '~/enums/routes'
import { useExamination } from '~/store/examine'

const { $auth, $userProfile } = useNuxtApp()

const examine = useExamination()
const examineOptions = useExaminationOptions()

const searchText = ref('')

async function onSearchSubmit(_: Event) {
  let nrNumber = searchText.value.trim()
  try {
    await examine.initialize(nrNumber)
    searchText.value = ''
  } catch (e) {}
}
</script>
