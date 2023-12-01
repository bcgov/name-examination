<template id="app-header">
  <nav class="h-16 border-b border-gray-300">
    <div class="flex h-full w-full items-center justify-between">
      <div class="hidden h-full min-[1558px]:block">
        <nuxt-link :to="Route.Home">
          <img
            src="/images/top-nav.png"
            class="min-w-8 h-full"
            alt="Name Examination"
          />
        </nuxt-link>
      </div>

      <div v-if="authenticated" class="ml-3 flex gap-10 text-bcgov-blue5">
        <AppHeaderNavLink text="Admin" :route="Route.Admin" />
        <AppHeaderNavLink text="Examine Names" :route="Route.Examine" />
        <AppHeaderNavLink text="Search" :route="Route.Search" />
      </div>

      <div v-if="authenticated" class="ml-auto flex items-center">
        <SearchInput
          :value="ref('')"
          class="mx-3"
          placeholder="NR Number Lookup"
        />

        <nuxt-link to="/stats" class="mx-3 text-sm text-blue-800 underline">
          <a>Stats</a>
        </nuxt-link>

        <div class="flex space-x-2 px-3">
          <ToggleSwitch
            label="Classify Words"
            v-model="examineOptions.classifyWords"
          />
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

      <div v-else class="mx-5">
        <IconButton class="font-medium">
          <ArrowRightOnRectangleIcon class="h-6" />
          Login
        </IconButton>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/solid'
import { useExamineOptionsStore } from '~/store/examine-options'
import { Route } from '~/enums/routes'

const { $auth, $userProfile } = useNuxtApp()

const authenticated = computed(() => $auth.authenticated)

const examineOptions = useExamineOptionsStore()
</script>
