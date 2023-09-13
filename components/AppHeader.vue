<template id="app-header">
  <nav class="h-16 border-b border-gray-300">
    <div class="flex h-full w-full items-center justify-between">
      <div class="h-full invisible xl:visible">
        <nuxt-link to="/HomePage">
          <img
            src="../images/top-nav.png"
            class="min-w-8 h-full"
            alt="Name Examination"
            @click="selectedLink = '/'"
          />
        </nuxt-link>
      </div>

      <div v-if="authModule.isAuthenticated" class="flex gap-10 text-blue-800">
        <a
          href=""
          class="ml-8"
          :class="{ 'text-amber-400': selectedLink === SelectedLink.Admin }"
          @click="selectedLink = SelectedLink.Admin"
          >Admin</a
        >

        <a
          href=""
          :class="{ 'text-amber-400': selectedLink === SelectedLink.Examine }"
          @click="selectedLink = SelectedLink.Examine"
          >Examine</a
        >

        <nuxt-link to="/SearchPage">
          <span
            :class="{ 'text-amber-400': selectedLink === SelectedLink.Search }"
            @click="selectedLink = SelectedLink.Search"
          >
            Search
          </span>
        </nuxt-link>

        <nuxt-link to="/stats">
          <span
            :class="{ 'text-amber-400': selectedLink === SelectedLink.Stats }"
            @click="selectedLink = SelectedLink.Stats"
          >
            Stats
          </span>
        </nuxt-link>
      </div>

      <div v-if="authModule.isAuthenticated" class="ml-auto flex items-center">
        <form class="mr-5 flex items-center">
          <label for="allowWordClassificationModal" class="sr-only"
            >NR Number Lookup</label
          >
          <div>
            <input
              id="allowWordClassificationModal"
              type="text"
              class="block w-48 rounded-l-md border border-gray-300 p-2 text-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="NR Number Lookup"
              required
            />
          </div>
          <button
            type="submit"
            class="bg-bcgov-blue5 hover:bg-bcgov-gold5 delay-120 flex items-center rounded-r-md p-2 text-white transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-amber-300"
          >
            <svg-icon type="mdi" viewBox="0 -4 24 24" :path="mdiMagnify" />
          </button>
        </form>

        <Dropdown class="mr-5" />
      </div>

      <div v-if="!authModule.isAuthenticated" class="mx-5">
        <button
          class="inline-flex w-full items-center justify-between rounded-md border-2 border-gray-300 px-4 py-2 font-medium hover:bg-gray-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          @click="login"
        >
          Login
          <svg-icon type="mdi" viewBox="0 -2 24 24" :path="mdiLogin" />
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import '@jamescoyle/vue-icon'
import { ref } from 'vue'
import { mdiLogin, mdiMagnify } from '@mdi/js'
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
