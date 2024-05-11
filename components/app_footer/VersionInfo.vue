<template>
  <div class="relative inline-block">
    <button
      class="text-blue-500 pl-4"
      @mouseover="showVersionNumbers = true"
      @mouseleave="showVersionNumbers = false"
    >
      Version
    </button>
    <div
      v-if="showVersionNumbers"
      class="absolute z-10 w-56 left-0 transform -translate-x-full top-[-3.5rem]
              px-5 py-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg"
    >
      <div>Name Examination: {{ nameExaminationVersion }}</div>
      <div>NameX: {{ nameXVersion }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import packageInfo from '~/package.json'
import { ref, onMounted } from 'vue'

const showVersionNumbers = ref(false)
const nameExaminationVersion = packageInfo.version
const nameXVersion = ref('')

onMounted(async () => {
  nameXVersion.value = await fetchNameXVersion()
})

/* THESE ENDPOINTS ARE NOT WORKING. CORS ISSUE? */
const fetchNameXVersion = async (): Promise<string> => {
  const devNameXVersionEndpoint = 'https://namex-dev.apps.silver.devops.gov.bc.ca/api/v1/meta/info'
  // const testNameXVersionEndpoint = 'https://namex-test.apps.silver.devops.gov.bc.ca/api/v1/meta/info'
  // const prodNameXVersionEndpoint = 'https://namex.apps.silver.devops.gov.bc.ca/api/v1/meta/info'

  try {
    const response = await fetch(devNameXVersionEndpoint)
    if (!response.ok) {
      console.error('Failed to fetch:', response.status, response.statusText)
      throw Error
    }
    const responseJson = await response.json()
    return responseJson.API
  } catch (error) {
    console.error('Error fetching data:', error)
    return 'Error'
  }
}

</script>
