<template id="app-header">
  <nav class="h-16 border-b border-gray-300">
    <div class="flex h-full w-full items-center justify-between">
      <div class="h-full">
        <nuxt-link to="/HomePage">
          <img
            src="../images/top-nav.png"
            class="min-w-8 h-full"
            alt="Name Examination"
          />
        </nuxt-link>
      </div>

      <div v-if="authModule.isAuthenticated" class="flex gap-12 text-blue-800">
        <a
          href=""
          class="ml-8"
          :class="{ 'text-amber-400': selectedLink === SelectedLink.Admin }"
          @click="selectedLink = 'admin'"
          >Admin</a
        >

        <a
          href=""
          :class="{ 'text-amber-400': selectedLink === SelectedLink.Examine }"
          @click="selectedLink = 'examine'"
          >Examine</a
        >

        <nuxt-link to="/SearchPage">
          <span
            :class="{ 'text-amber-400': selectedLink === SelectedLink.Search }"
            @click="selectedLink = 'search'"
          >
            Search
          </span>
        </nuxt-link>
      </div>

      <div v-if="authModule.isAuthenticated" class="ml-auto flex items-center">

  <form class="flex items-center">
    <label for="allowWordClassificationModal" class="sr-only">NR Number Lookup</label>
    <div>
      <input
        id="allowWordClassificationModal"
        type="text"
        class="block w-48 rounded-l-md border border-gray-300 bg-gray-100 p-1.5 text-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        placeholder="NR Number Lookup"
        required
      />
    </div>
    <button
      type="submit"
      class="bcgovblue-btn delay-120 flex items-center rounded-r-md p-1.5 text-white transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-amber-300"
    >
      <svg-icon type="mdi" viewBox="0 -4 24 24" :path="mdiMagnify" />
    </button>
  </form>

        <span class="mx-10 underline">Stats</span>

        <ToggleSwitch
          class="mr-3"
          input-id="classifyWords"
          display="Classify Words"
        />

        <ToggleSwitch input-id="priorityQueue" display="Priority Queue" />

        <span class="mx-10 text-gray-800">{{
          KeycloakService.getUserInfo().fullName
        }}</span>

        <div class="divider" />

        <div class="mx-10 text-blue-800">
          <a id="logout-button" href="#" @click="logout()"
            >Log Out</a
          >
        </div>
      </div>

      <div v-if="!authModule.isAuthenticated" class="mx-10 text-blue-800">
        <a href="#" @click="login()">Login</a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import '@jamescoyle/vue-icon'
import { ref } from 'vue'
import { mdiMagnify } from '@mdi/js'
import { useAuthStore } from '../store/auth'
import KeycloakService from '../public/keycloak/keycloak'
import { SelectedLink } from '../enums/dropdownEnums'
import { useRuntimeConfig } from '#imports'
/* eslint-disable require-jsdoc */

const authModule = useAuthStore()
const config = useRuntimeConfig()

const selectedLink = ref('/')

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
    if (err?.message !== 'NOT_AUTHENTICATED') {
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
    if (err?.message !== 'LOGOUT FAILED') {
      console.error(err)
      // Handle the error appropriately, possibly by showing an error message to the user
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/theme.scss';
.bcgovblue-btn {
  background-color: $BCgovBlue5;
  &:hover {
    background-color: $BCgovGold5;
  }
}
</style>
