import type { ConflictList, ConflictListItem, ConflictSource } from '~/types'
import { getPossibleConflicts } from '~/util/namex-api'
import { highlightWord } from '~/util/html/highlight'
import { useExaminationRecipe } from './recipe'

export const useConflicts = defineStore('conflicts', () => {
  const exactMatches = ref<Array<ConflictListItem>>([])
  const synonymMatches = ref<Array<ConflictList>>([])
  const cobrsPhoneticMatches = ref<Array<ConflictList>>([])
  const phoneticMatches = ref<Array<ConflictList>>([])

  const loading = ref(false)

  const selectedConflicts = ref<Array<ConflictListItem>>([])
  const comparedConflicts = ref<Array<ConflictListItem>>([])
  const prevSelectedConflicts = ref<Array<ConflictListItem>>([])
  const prevComparedConflicts = ref<Array<ConflictListItem>>([])
  const autoAdd = ref(true)

  /** Flattened array of every `ConflictList` across all buckets. */
  const lists = computed<Array<ConflictList>>(() =>
    [
      phoneticMatches.value,
      synonymMatches.value,
      cobrsPhoneticMatches.value,
    ].flat()
  )

  /** List of all `ConflictList`s that contain items within them. */
  const nonEmptyLists = computed(() =>
    lists.value.filter((list) => list.children.length > 0)
  )

  /** The first `ConflictListItem` among every `ConflictList` across all buckets. */
  const firstConflictItem = computed(() =>
    [...exactMatches.value, ...lists.value.flatMap((list) => list.children)].at(
      0
    )
  )

  function isConflictSelected(conflict: ConflictListItem) {
    const conflictsList = autoAdd.value
      ? selectedConflicts.value
      : comparedConflicts.value
    return conflictsList.map((c) => c.nrNumber).includes(conflict.nrNumber)
  }

  /** If the given conflict is not selected, selects it. Otherwise, deselects it. */
  function toggleConflict(conflict: ConflictListItem) {
    if (isConflictSelected(conflict)) {
      deselectConflict(conflict)
    } else {
      selectConflict(conflict)
    }
  }

  /** Map a single result from possible-conflicts response to a ConflictListItem */
  function mapToItem(result: any): ConflictListItem {
    const source =
      result.parent_type === 'CORP'
        ? ('CORP' as unknown as ConflictSource)
        : ('NAMEREQUEST' as unknown as ConflictSource)
    const highlightedName = highlightNameChoices(result)
    return {
      text: result.name,
      highlightedText: highlightedName,
      nrNumber: result.parent_id,
      startDate: result.parent_start_date ?? '',
      jurisdiction: result.parent_jurisdiction ?? undefined,
      source,
      ui: { focused: false, open: false },
    }
  }

  /** Apply highlighting to conflict names based on API response data */
  function highlightNameChoices(entry: any): string {
    const name: string = entry?.name ?? ''
    const highlighting = entry?.highlighting

    // If we have nothing to highlight, keep original text intact
    if (!name || !highlighting) {
      return name
    }

    // Split into word and whitespace tokens so we preserve spacing exactly
    const tokens = name.split(/(\s+)/)

    const exactList: string[] = Array.isArray(highlighting.exact) ? highlighting.exact : []
    const synonymList: string[] = Array.isArray(highlighting.synonyms) ? highlighting.synonyms : []
    const stemList: string[] = Array.isArray(highlighting.stems) ? highlighting.stems : []

    const applyFirstMatchingCategory = (word: string): string => {
      // exact > synonym > stem (priority order)
      for (const exact of exactList) {
        const highlighted = highlightWord(exact, word, 'exact-highlight')
        if (highlighted !== word) return highlighted
      }

      for (const synonym of synonymList) {
        const highlighted = highlightWord(synonym, word, 'synonym-highlight')
        if (highlighted !== word) return highlighted
      }

      for (const stem of stemList) {
        const highlighted = highlightWord(stem, word, 'stem-highlight')
        if (highlighted !== word) return highlighted
      }

      return word
    }

    return tokens
      .map((token) => (token.trim().length === 0 ? token : applyFirstMatchingCategory(token)))
      .join('')
  }

  /** Group all results into ConflictList buckets - no filtering, show all results */
  function groupIntoLists(
    results: any[],
    highlightKey: 'stems' | 'synonyms'
  ): Array<ConflictList> {
    if (!results?.length) return []
    const group: ConflictList = {
      text: '',
      highlightedText: '',
      meta: undefined,
      children: results.map(mapToItem),
      ui: { focused: false, open: false },
    }
    return group.children.length > 0 ? [group] : []
  }

  async function initialize(searchQuery: string, _exactPhrase: string) {
    loading.value = true
    resetConflictLists()
    try {
      const response = await getPossibleConflicts(searchQuery)
      if (!response.ok) throw new Error('Unable to retrieve possible conflicts')

      const data = await response.json()
      const results: any[] = data.names ?? []
      const exact: any[] = data.exactNames ?? []
      const histories: any[] = data.histories ?? []

      // Exact Match bucket
      exactMatches.value = exact.map(mapToItem)
      exactMatches.value.forEach((match) => selectConflict(match))

      // Phonetic Match bucket — results with synonym highlights
      phoneticMatches.value = groupIntoLists(results, 'synonyms')

      // Synonym Match bucket — results with stem highlights
      synonymMatches.value = groupIntoLists(results, 'stems')

      // Character Swap bucket — empty (COBRS not separated in new API yet)
      cobrsPhoneticMatches.value = []

      if (exactMatches.value.length === 0 && nonEmptyLists.value.length > 0) {
        nonEmptyLists.value[0].ui.open = true
      }
      useExaminationRecipe().reset()

      // return raw history matches for the caller (parseHistoryMatches in the examine store)
      return histories
    } catch (e) {
      resetMatches()
      throw e
    } finally {
      loading.value = false
    }
  }

  function clearSelectedConflicts() {
    selectedConflicts.value = []
  }

  function resetMatches() {
    exactMatches.value = []
    synonymMatches.value = []
    cobrsPhoneticMatches.value = []
    phoneticMatches.value = []
    loading.value = false
  }

  function resetConflictLists() {
    clearSelectedConflicts()
    comparedConflicts.value = []
  }

  function selectConflict(conflict: ConflictListItem) {
    comparedConflicts.value.push(conflict)
    if (autoAdd.value) {
      selectedConflicts.value.push(conflict)
    }
  }

  function deselectConflict(conflict: ConflictListItem) {
    const notConflict = (c: ConflictListItem) =>
      c.nrNumber !== conflict.nrNumber
    selectedConflicts.value = selectedConflicts.value.filter(notConflict)
    comparedConflicts.value = comparedConflicts.value.filter(notConflict)
  }

  /** Keep compared conflicts synchronized with selected conflicts when auto add is enabled. */
  function syncSelectedAndComparedConflicts() {
    if (autoAdd.value) {
      comparedConflicts.value = selectedConflicts.value.slice()
    }
  }

  /** Reset selectedConflicts and comparedConflicts and save existing data */
  function disableAutoAdd () {
    if (!autoAdd.value) {
      const initialRun = (prevSelectedConflicts.value.length === 0 && prevComparedConflicts.value.length === 0)
      for (const conflict of selectedConflicts.value) {
        if (initialRun) {
          prevSelectedConflicts.value.push(conflict)
          prevComparedConflicts.value.push(conflict)
        }
        const notConflict = (c: ConflictListItem) =>
          c.nrNumber !== conflict.nrNumber
        selectedConflicts.value = selectedConflicts.value.filter(notConflict)
        comparedConflicts.value = comparedConflicts.value.filter(notConflict)
      }
    }
  }

  /** Reassign selectedConflicts and comparedConflicts */
  function enableAutoAdd () {
    if (autoAdd.value) {
      selectedConflicts.value = prevSelectedConflicts.value
      comparedConflicts.value = prevComparedConflicts.value
    }
  }

  return {
    initialize,
    exactMatches,
    synonymMatches,
    cobrsPhoneticMatches,
    phoneticMatches,
    selectedConflicts,
    comparedConflicts,
    loading,
    isConflictSelected,
    toggleConflict,
    resetMatches,
    clearSelectedConflicts,
    resetConflictLists,
    selectConflict,
    deselectConflict,
    disableAutoAdd,
    enableAutoAdd,
    autoAdd,
    lists,
    nonEmptyLists,
    firstConflictItem,
    syncSelectedAndComparedConflicts,
  }
})
