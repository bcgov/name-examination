<template>
  <div class="relative inline-block">
    <!-- Tooltip Trigger -->
    <button
      class="text-blue-500 pl-4"
      @mouseover="showVersionNumbers = true"
      @mouseleave="showVersionNumbers = false"
    >
      ℹ️
    </button>

    <!-- Tooltip Content -->
    <section
      v-show="showVersionNumbers"
      class="absolute z-10 w-56 px-5 py-3 bg-gray-800 rounded-lg -translate-x-full top-[-3.5rem]"
    >
      <div class="text-xs text-white">
        Name Examination: {{ nameExaminationVersion }}
      </div>
      <div class="text-xs text-white">
        NameX: {{ nameXVersion }}
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import packageInfo from '~/package.json'
import { ref, onMounted } from 'vue'

const showVersionNumbers = ref(false)
const nameExaminationVersion = ref('')
const nameXVersion = ref('')

onMounted(async () => {
  nameExaminationVersion.value = packageInfo.version
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
