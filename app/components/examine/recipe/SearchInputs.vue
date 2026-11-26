<template>
  <div class="flex w-full space-x-2">
    <SearchInput
      :input-id="NAME_SEARCH_ID"
      v-model="searchString"
      class="grow"
      placeholder="name"
      @submit.prevent="onNameSearchSubmit"
      focus-mnemonic="s"
      :clear="examine.currentName ?? undefined"
      input-required
      submit-accesskey="4"
    />
    <SearchInput
      :input-id="EXACT_SEARCH_ID"
      v-model="exactSearchString"
      placeholder="exact phrase"
      @submit.prevent="onExactSearchSubmit"
      clear=""
      submit-accesskey="5"
    />
  </div>
  <form
    class="flex w-full items-center space-x-2"
    role="search"
    @submit.prevent="onSplitSearchSubmit"
  >
    <input
      :id="DISTINCTIVE_SEARCH_ID"
      v-model="distinctive"
      type="text"
      class="w-full rounded border border-gray-300 px-2 py-1 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
      placeholder="Distinctive"
      autocorrect="off"
      aria-label="Distinctive"
    />
    <IconButton
      type="button"
      accesskey="7"
      class="!p-1.5"
      aria-label="Move the first descriptive word to distinctive"
      @click="moveWordToDistinctive"
    >
      <ArrowLeftIcon class="h-5 w-5 stroke-2" />
    </IconButton>
    <IconButton
      type="button"
      accesskey="8"
      class="!p-1.5"
      aria-label="Move the last distinctive word to descriptive"
      @click="moveWordToDescriptive"
    >
      <ArrowRightIcon class="h-5 w-5 stroke-2" />
    </IconButton>
    <div class="flex w-full items-center">
      <input
        :id="DESCRIPTIVE_SEARCH_ID"
        v-model="descriptive"
        type="text"
        class="w-full rounded-l border border-gray-300 px-2 py-1 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        placeholder="Descriptive"
        autocorrect="off"
        aria-label="Descriptive"
      />
      <IconButton
        accesskey="6"
        class="rounded-none rounded-r !border border-bcgov-blue5 !p-1.5"
        aria-label="Submit distinctive and descriptive search"
      >
        <MagnifyingGlassIcon class="h-5 w-5 stroke-2" />
      </IconButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline'
import { useExamination } from '~/store/examine'
import { useExaminationTabCyle } from '~/store/examine/tab-cycle'
import { emitter } from '~/util/emitter'
import { splitDistinctiveDescriptive } from '~/util/split-name'

const examine = useExamination()
const tabCycle = useExaminationTabCyle()

const NAME_SEARCH_ID = 'nameSearchInput'
const EXACT_SEARCH_ID = 'exactSearchInput'
const DISTINCTIVE_SEARCH_ID = 'distinctiveSearchInput'
const DESCRIPTIVE_SEARCH_ID = 'descriptiveSearchInput'

const searchString = ref(examine.currentName ?? '')
const exactSearchString = ref('')
const initialSplit = splitDistinctiveDescriptive(examine.currentName ?? '')
const distinctive = ref(initialSplit.distinctive)
const descriptive = ref(initialSplit.descriptive)

async function loadRecipe(
  searchQuery: string,
  exactPhrase: string,
  distinctiveWords = '',
  descriptiveWords = ''
) {
  try {
    await examine.fetchAndLoadRecipeData(
      searchQuery,
      exactPhrase,
      distinctiveWords,
      descriptiveWords
    )
  } catch (e: any) {
    emitter.emit('error', {
      title: 'Failed to load Recipe area',
      message: e.message,
    })
  }
}

function onNameSearchSubmit(_event: Event) {
  loadRecipe(searchString.value, '')
}

function onExactSearchSubmit(_event: Event) {
  const phrase = exactSearchString.value.trim()
  if (!phrase) return
  loadRecipe(searchString.value, phrase)
}

function onSplitSearchSubmit() {
  const identity = distinctive.value.trim()
  if (!identity) return
  const described = descriptive.value.trim()
  loadRecipe([identity, described].filter(Boolean).join(' '), '', identity, described)
}

/** Left arrow: move the first descriptive word to the end of distinctive. */
function moveWordToDistinctive() {
  const words = descriptive.value.trim().split(/\s+/).filter(Boolean)
  const word = words.shift()
  if (!word) return
  distinctive.value = [distinctive.value.trim(), word].filter(Boolean).join(' ')
  descriptive.value = words.join(' ')
}

/** Right arrow: move the last distinctive word to the start of descriptive. */
function moveWordToDescriptive() {
  const words = distinctive.value.trim().split(/\s+/).filter(Boolean)
  const word = words.pop()
  if (!word) return
  descriptive.value = [word, descriptive.value.trim()].filter(Boolean).join(' ')
  distinctive.value = words.join(' ')
}

/** Fill the search boxes from a clicked name choice (no search is run). */
function fillFromName(name: string) {
  searchString.value = name
  exactSearchString.value = ''
  const split = splitDistinctiveDescriptive(name)
  distinctive.value = split.distinctive
  descriptive.value = split.descriptive
}

onMounted(() => {
  tabCycle.register(0, NAME_SEARCH_ID)
  tabCycle.register(1, EXACT_SEARCH_ID)
  emitter.on('fillSearch', fillFromName)
})

onUnmounted(() => {
  emitter.off('fillSearch', fillFromName)
})

watch(
  () => [examine.currentName],
  async (_state) => {
    searchString.value = examine.currentName ?? ''
    exactSearchString.value = ''
    const split = splitDistinctiveDescriptive(searchString.value)
    distinctive.value = split.distinctive
    descriptive.value = split.descriptive
    await examine.fetchAndLoadRecipeData(
      searchString.value,
      exactSearchString.value
    )
  },
  { deep: true }
)
</script>
