<template>
  <Menu as="div" class="relative inline-block text-left" v-slot="{ open }">
    <div>
      <MenuButton
        class="inline-flex w-full items-center justify-between rounded-md border-2 border-gray-300 px-4 py-2 font-medium hover:bg-gray-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        {{ KeycloakService.getUserInfo().fullName }}

        <svg-icon v-if="!open" type="mdi" viewBox="0 -3 24 24" :path="mdiChevronDown" />
        <svg-icon v-else type="mdi" viewBox="0 -3 24 24" :path="mdiChevronUp" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="p-1">
            <DropdownToggleSwitch label="Classify Words" store-field-name="classifyWords"/>
            <DropdownToggleSwitch label="Priority Queue" store-field-name="priorityQueue"/>
        </div>

        <div class="p-1">
          <MenuItem v-slot="{ active }">
            <button
              :class="[
                active ? 'bg-bcgov-blue5 text-white' : 'text-gray-900',
                'group flex w-full justify-between items-center rounded-md p-2 text-sm',
              ]"
              @click="logout"
            >
              Log Out
              <svg-icon type="mdi" viewBox="0 -2 24 24" :path="mdiLogout" />
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import KeycloakService from '../public/keycloak/keycloak'
import { useAuthStore } from '~/store/auth'
import { mdiChevronDown, mdiChevronUp, mdiLogout } from '@mdi/js'

const auth = useAuthStore()

async function logout() {
  if (!auth.isAuthenticated) return

  try {
    await KeycloakService.logout(import.meta.env.VITE_APP_BASE_URL)
  } catch (err) {
    if (err?.message !== 'LOGOUT FAILED') {
      console.error(err)
    }
  }
}
</script>
