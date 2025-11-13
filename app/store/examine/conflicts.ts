import type { ConflictListItem } from '~/types'
import { getConflicts } from '~/util/namex-api'


export const useConflicts = defineStore('conflicts', () => {
  const exactMatches = ref<Array<ConflictListItem>>([])
  const synonymMatches = ref<Array<ConflictListItem>>([])

  const loading = ref(false)

  const selectedConflicts = ref<Array<ConflictListItem>>([])
  const comparedConflicts = ref<Array<ConflictListItem>>([])
  const prevSelectedConflicts = ref<Array<ConflictListItem>>([])
  const prevComparedConflicts = ref<Array<ConflictListItem>>([])
  const autoAdd = ref(true)

  /** The first `ConflictListItem`. */
  const firstConflictItem = computed(() =>
    [...exactMatches.value, ...synonymMatches.value].at(
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

  async function retrieveConflicts(query: string): Promise<[ConflictListItem[], ConflictListItem[], any[]]> {
    const resp = await getConflicts(query)
    if (!resp.ok) throw new Error('Unable to retrieve exact matches')
    const json = await resp.json()
    const exactMatches = parseExactMatches(json?.exactNames || [])
    const similarMatches = parseSynonymMatches(json?.names || [])
    const histories = json?.histories
    return [exactMatches, similarMatches, histories]
  }

  function parseExactMatches(exactMatches: Array<any>): Array<ConflictListItem> {
    return exactMatches.map((match) => {
      return {
        text: match.name,
        highlightedText: match.name,
        nrNumber: match.parent_id,
        startDate: match.parent_start_date,
        jurisdiction: match.parent_jurisdiction,
        source: match.parent_type,
        ui: {
          focused: false,
          open: false,
        },
      }
    })
  }

  function parseSynonymMatches(synonymMatches: Array<any>): Array<ConflictListItem> {
    return synonymMatches.map((match) => {
      const highlightedName = highlightNameChoices(match)
      return {
        text: match.name,
        highlightedText: highlightedName,
        nrNumber: match.parent_id,
        startDate: match.parent_start_date,
        jurisdiction: match.parent_jurisdiction,
        source: match.parent_type,
        ui: {
          focused: false,
          open: false,
        },
      }
    })
  }

  function highlightNameChoices(entry: any): string {
    let result = entry.name
    if (entry.highlighting.stems) {
      entry.highlighting.stems.forEach((stem: string) => {
        const re = new RegExp(stem, 'gi')
        result = result.replace(re, (match: any) => `<span class="stem-highlight">${match}</span>`)
      })
    }

    if (entry.highlighting.synonyms) {
      entry.highlighting.synonyms.forEach((synonym: string) => {
        const re = new RegExp(synonym, 'gi')
        result = result.replace(re, (match: any) => `<span class="synonym-highlight">${match}</span>`)
      })
    }

    if (entry.highlighting) {
      if (entry.highlighting.exact) {
        entry.highlighting.exact.forEach((exact: string) => {
          const re = new RegExp(exact, 'gi')
          result = result.replace(re, (match: any) => `<span class="exact-highlight">${match}</span>`)
        })
      }
    }

    return result
  }

  async function initialize(searchQuery: string, exactPhrase: string) {
    loading.value = true
    resetConflictLists()
    try {
      const [exact, synonym, histories] = await retrieveConflicts(searchQuery)
      exactMatches.value = exact
      synonymMatches.value = synonym
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
    firstConflictItem,
    syncSelectedAndComparedConflicts,
  }
})
