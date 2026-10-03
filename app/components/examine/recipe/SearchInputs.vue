<template>
  <div class="flex w-full space-x-2">
    <form class="flex grow items-center" role="search" @submit.prevent="onSplitSearch">
      <input
        :id="DISTINCTIVE_SEARCH_ID"
        v-model="distinctive"
        type="text"
        required
        class="w-full rounded-l border border-gray-300 px-2 py-1 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        placeholder="distinctive"
        autocorrect="off"
        aria-label="Distinctive search"
      />
      <input
        :id="DESCRIPTIVE_SEARCH_ID"
        v-model="descriptive"
        type="text"
        class="w-full border border-l-0 border-gray-300 px-2 py-1 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        placeholder="descriptive"
        autocorrect="off"
        aria-label="Descriptive search"
      />
      <IconButton
        class="rounded-none rounded-r !border border-bcgov-blue5 !p-1.5"
        aria-label="Submit distinctive and descriptive search"
      >
        <MagnifyingGlassIcon class="h-5 w-5 stroke-2" />
      </IconButton>
    </form>
    <SearchInput
      :input-id="EXACT_SEARCH_ID"
      v-model="exactSearchString"
      placeholder="exact phrase"
      @submit.prevent="onExactSearchSubmit"
      clear=""
    />
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useExamination } from '~/store/examine'
import { useExaminationTabCyle } from '~/store/examine/tab-cycle'
import { emitter } from '~/util/emitter'

const examine = useExamination()
const tabCycle = useExaminationTabCyle()

const DISTINCTIVE_SEARCH_ID = 'distinctiveSearchInput'
const DESCRIPTIVE_SEARCH_ID = 'descriptiveSearchInput'
const EXACT_SEARCH_ID = 'exactSearchInput'

const distinctive = ref('')
const descriptive = ref('')
const exactSearchString = ref('')

async function loadRecipe(
  searchQuery: string,
  exactPhrase: string,
  split?: { distinctive?: string; descriptive?: string },
) {
  try {
    await examine.fetchAndLoadRecipeData(searchQuery, exactPhrase, split)
  } catch (e: any) {
    emitter.emit('error', {
      title: 'Failed to load Recipe area',
      message: e.message,
    })
  }
}

function splitQuery() {
  const identity = distinctive.value.trim()
  const described = descriptive.value.trim()
  return {
    identity,
    described,
    text: [identity, described].filter(Boolean).join(' '),
  }
}

function onSplitSearch() {
  const split = splitQuery()
  if (!split.identity) return
  loadRecipe(split.text, '', {
    distinctive: split.identity,
    descriptive: split.described,
  })
}

function onExactSearchSubmit() {
  const phrase = exactSearchString.value.trim()
  if (!phrase) return
  const split = splitQuery()
  if (!split.identity) {
    loadRecipe('', phrase)
    return
  }
  loadRecipe(split.text, phrase, {
    distinctive: split.identity,
    descriptive: split.described,
  })
}

onMounted(() => {
  tabCycle.register(0, DISTINCTIVE_SEARCH_ID)
  tabCycle.register(1, DESCRIPTIVE_SEARCH_ID)
  tabCycle.register(2, EXACT_SEARCH_ID)
  useMnemonic('s', () => document.getElementById(DISTINCTIVE_SEARCH_ID)?.focus())
})

watch(
  () => [examine.currentName],
  async () => {
    distinctive.value = ''
    descriptive.value = ''
    exactSearchString.value = ''
    await loadRecipe(examine.currentName ?? '', '')
  },
  { deep: true }
)
</script>
