import type { ConflictList, ConflictListItem, ConflictSource } from '~/types'
import { getPossibleConflicts } from '~/util/namex-api'
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
    return {
      text: result.name,
      highlightedText: result.name,
      nrNumber: result.parent_id,
      startDate: result.parent_start_date ?? '',
      jurisdiction: result.parent_jurisdiction ?? undefined,
      source,
      ui: { focused: false, open: false },
    }
  }

  /** Group a flat list of results into ConflictList buckets by a highlight key */
  function groupIntoLists(
    results: any[],
    highlightKey: 'stems' | 'synonyms'
  ): Array<ConflictList> {
    if (!results?.length) return []
    const group: ConflictList = {
      text: highlightKey === 'stems' ? 'Stem Matches' : 'Synonym Matches',
      highlightedText: highlightKey === 'stems' ? 'Stem Matches' : 'Synonym Matches',
      meta: undefined,
      children: results
        .filter((r) => r.highlighting?.[highlightKey]?.length > 0)
        .map(mapToItem),
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
