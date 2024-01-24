<template>
  <div>
    <AppHeaderContainer />
    <AppBanner />
    <ErrorDialog
      :show="showErrorDialog"
      :error="errorQueue[0]"
      @close="popError"
    />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import type { AppError } from '~/types/errors'
import { emitter } from '~/util/emitter'

const showErrorDialog = ref(false)
const errorQueue = ref<Array<AppError>>([])

emitter.on('error', pushError)

function pushError(error: AppError) {
  errorQueue.value.push(error)
  showErrorDialog.value = true
}

function popError() {
  showErrorDialog.value = false
  // wait some time for the dialog to disappear before retrieving next error
  setTimeout(() => {
    errorQueue.value.shift()
    if (errorQueue.value.length > 0) {
      showErrorDialog.value = true
    }
  }, 500)
}
</script>
