<template id="app-banner">
  <div v-if="bannerText">
    <div class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 text-center p-4">
      <p> {{ bannerText }}</p>
    </div>
  </div>
</template>

<script setup>
import { useNuxtApp } from '#app'
import { getString } from 'firebase/remote-config'
import { FeatureFlags } from '@/util/constants'

const { $remoteConfig } = useNuxtApp()
const bannerText = getString($remoteConfig, FeatureFlags.NAMEX_BANNER)
console.info(bannerText)

</script>

<style lang ='scss' scoped>

</style>
