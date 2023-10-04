<template id="app-header">
  <nav class="h-16 border-b border-gray-300">
    <div class="flex h-full w-full items-center justify-between">
      <div class="hidden h-full 2xl:block">
        <nuxt-link to="/HomePage">
          <img
            src="/images/top-nav.png"
            class="min-w-8 h-full"
            alt="Name Examination"
          />
        </nuxt-link>
      </div>

      <div
        v-if="authModule.isAuthenticated"
        class="ml-3 flex gap-10 text-bcgov-blue5"
      >
        <AppHeaderNavLink text="Admin" :route="NavbarLink.Admin" />
        <AppHeaderNavLink text="Examine Names" :route="NavbarLink.Examine" />
        <AppHeaderNavLink text="Search" :route="NavbarLink.Search" />
      </div>

      <div v-if="authModule.isAuthenticated" class="ml-auto flex items-center">
        <SearchInput />

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
          <span class="text-sm">{{
            KeycloakService.getUserInfo().fullName
          }}</span>
          <a class="text-sm text-blue-800" href="#" @click="logout">Log Out</a>
        </div>
      </div>

      <div v-if="!authModule.isAuthenticated" class="mx-5">
        <IconButton class="font-medium" @click="login">
          <ArrowRightOnRectangleIcon class="h-6" />
          Login
        </IconButton>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '../store/auth'
import KeycloakService from '../public/keycloak/keycloak'
import { useRuntimeConfig } from '#imports'
import { NavbarLink } from '../enums/dropdownEnums'
import { ArrowRightOnRectangleIcon } from '@heroicons/vue/24/solid'
import { useExamineOptionsStore } from '~/store/examine-options'
/* eslint-disable require-jsdoc */

const authModule = useAuthStore()
const config = useRuntimeConfig()
const examineOptions = useExamineOptionsStore()

async function login() {
  // If the user is already authenticated, do nothing
  if (authModule.isAuthenticated) return

  try {
    // Start the token initialization process and wait for it to finish
    await KeycloakService.initializeToken(
      authModule,
      true,
      !authModule.isAuthenticated
    )

    // Token should now be generated
    await KeycloakService.initSession()
  } catch (err) {
    if ((err as any)?.message !== 'NOT_AUTHENTICATED') {
      console.error(err)
      // Handle the error appropriately, possibly by showing an error message to the user
    }
  }
}

async function logout() {
  // If the user is already logged out, do nothing
  if (!authModule.isAuthenticated) return

  try {
    await KeycloakService.logout(config.app.baseURL)
  } catch (err) {
    if ((err as any)?.message !== 'LOGOUT FAILED') {
      console.error(err)
      // Handle the error appropriately, possibly by showing an error message to the user
    }
  }
}
</script>
