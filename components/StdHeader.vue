<template>
  <nav class="flex h-20 bg-white text-lg font-medium shadow-2xl">
    <div class="flex min-w-full">
      <div class="image">
        <img
          src="../public/images/top-nav.png"
          alt="Name Examination"
          class="h-full"
        >
      </div>

      <div
        v-if="authModule.isAuthenticated"
        class="mt-6 flex gap-24 text-blue-800"
      >
        <a
          href=""
          class="ml-16 text-2xl"
        >Admin</a>
        <a
          href=""
          class="text-2xl"
        >Examine</a>
        <a
          href=""
          class="text-2xl"
        ><nuxt-link to="/search">Search</nuxt-link></a>
      </div>

      <div
        v-if="authModule.isAuthenticated"
        class="ml-auto flex"
      >
        <form class="flex items-center">
          <label
            for="allowWordClassificationModal"
            class="sr-only"
          >NR Number Lookup</label>
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg-icon
                type="mdi"
                :path="path"
                class="h-6"
              />
            </div>
            <input
              id="allowWordClassificationModal"
              type="text"
              class="w-72 h-13 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500
             focus:border-blue-500 block pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600
             dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-lg"
              placeholder="NR Number Lookup"
              required
            >
          </div>
          <button
            type="submit"
            class="p-2.5 ml-3 h-12 text-white bg-blue-700 rounded-lg border
            border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
            dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg-icon
              type="mdi"
              :path="path"
            />
          </button>
        </form>

        <span class="mx-10 mt-7 underline">Stats</span>

        <label class="relative mt-2 inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            value=""
            class="peer sr-only"
          >
          <div
            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
          dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full
          peer-checked:after:border-white after:content-[''] after:absolute after:left-[2px] after:top-[25px]
          after:bg-white after:border-gray-300
          after:border after:rounded-full after:h-5 after:w-5 after:transition-all
         dark:border-gray-600 peer-checked:bg-blue-600"
          />
          <span class="ml-3 font-medium text-gray-500 dark:text-gray-300">Classify Words</span>
        </label>

        <label class="relative mt-2 inline-flex cursor-pointer items-center ml-5">
          <input
            type="checkbox"
            value=""
            class="peer sr-only"
          >
          <div
            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
          dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full
          peer-checked:after:border-white after:content-[''] after:absolute after:left-[2px] after:top-[25px]
          after:bg-white after:border-gray-300
          after:border after:rounded-full after:h-5 after:w-5 after:transition-all
         dark:border-gray-600 peer-checked:bg-blue-600"
          />
          <span class="ml-3 font-medium text-gray-500 dark:text-gray-300">Priority Queue</span>
        </label>

        <span class="mx-10 mt-7 flex text-gray-800">{{ KeycloakService.getUserInfo().fullName }}</span>

        <div class="divider" />

        <div class="mx-10 mt-7 text-blue-800">
          <a
            href="#"
            @click="logout"
          >Log Out</a>
        </div>
      </div>

      <div
        v-if="!authModule.isAuthenticated"
        class="mx-10 ml-auto mt-7 flex text-blue-800"
      >
        <a
          href="#"
          @click="login"
        >Login</a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import '@jamescoyle/vue-icon'
import { mdiMagnify } from '@mdi/js'
import { useAuthStore } from '~/store/auth'
import KeycloakService from '~/public/keycloak/keycloak'

const authModule = useAuthStore()
const path = mdiMagnify

const login = async () => {
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

const logout = async () => {
  // If the user is already logged out, do nothing
  if (!authModule.isAuthenticated) return

  try {
    await KeycloakService.logout(import.meta.env.VITE_APP_BASE_URL)
  } catch (err) {
    if (err?.message !== 'LOGOUT FAILED') {
      console.error(err)
      // Handle the error appropriately, possibly by showing an error message to the user
    }
  }
}
</script>
