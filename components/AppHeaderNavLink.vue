<template>
  <nuxt-link :to="route">
    <span
      class="font-medium transition hover:border-b-2 hover:border-bcgov-blue5"
      :class="{
        'border-b-2 border-bcgov-blue5':
          useRoute().name.toLowerCase() === route.toLowerCase(),
      }"
    >
      {{ text }}
    </span>
  </nuxt-link>
</template>

<script setup>
import { NavbarLink } from '~/enums/dropdownEnums'

defineProps({
  text: String,
  route: NavbarLink,
})
</script>
