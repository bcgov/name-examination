<template id="app-header">
  <nav class="h-16 border-b border-gray-300">
    <div class="flex h-full w-full items-center justify-between">
      <div class="hidden h-full min-[1558px]:block">
        <nuxt-link :to="Route.Home">
          <img
            src="/images/top-nav.png"
            class="min-w-8 h-full"
            alt="Name Examination"
          >
        </nuxt-link>
      </div>

      <div
        v-if="isAuthenticated"
        class="ml-3 flex gap-10 text-bcgov-blue5"
      >
        <AppHeaderNavLink
          text="Admin"
          :route="Route.Admin"
        />
        <AppHeaderNavLink
          text="Examine Names"
          :route="Route.Examine"
        />
        <AppHeaderNavLink
          text="Search"
          :route="Route.Search"
        />
      </div>

      <div
        v-if="isAuthenticated"
        class="ml-auto flex items-center"
      >
        <SearchInput
          :value="ref('')"
          class="mx-3"
          placeholder="NR Number Lookup"
        />

        <nuxt-link
          to="/stats"
          class="mx-3 text-sm text-blue-800 underline"
        >
          <a>Stats</a>
        </nuxt-link>

        <div class="flex space-x-2 px-3">
          <ToggleSwitch
            v-model="examineOptions.classifyWords"
            label="Classify Words"
          />
          <ToggleSwitch
            v-model="examineOptions.priorityQueue"
            label="Priority Queue"
          />
        </div>

        <div class="flex flex-col border-l-2 border-gray-300 px-3">
          <span class="text-sm">{{ userName }}</span>
          <a
            class="text-sm text-blue-800"
            href="#"
            @click="logout"
          >
            Log Out
          </a>
        </div>
      </div>

      <div
        v-else
        class="mx-5"
      >
        <IconButton
          class="font-medium"
          @click="login"
        >
          <ArrowRightOnRectangleIcon
            class="h-6"
          />
          Login
        </IconButton>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/solid'
import { useExamineOptionsStore } from '~/store/examine-options'
import { useUserStore } from '~/store/user-cache'
import { Route } from '~/enums/routes'
import { logout, login } from '~/util/firebase-auth'
import { computed } from 'vue'

const examineOptions = useExamineOptionsStore()
const userStore = useUserStore()
const isAuthenticated = computed(() => userStore.authenticated)
const userName = computed(() => userStore.userName)

</script>
