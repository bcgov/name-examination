<template>
  <li
    :class="{
      'inline-block mr-1 xl:mr-2 border-solid border-bcgov-blue3': true,
      'lg:border-r lg:pr-2': !isLast
    }"
  >
    <nuxt-link
      :to="route"
      class="block py-1 px-2 text-white no-underline hover:underline xl:px-[0.25rem] xl:px-[0.5rem]"
      :target="target"
    >
      {{ text }}
    </nuxt-link>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  text: string,
  route: string,
  target?: string,
  isLast?: boolean
}>()
</script>
