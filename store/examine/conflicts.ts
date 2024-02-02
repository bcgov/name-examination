import type {
  ConflictList,
  ConflictListItem,
  SynonymMatchInfo,
  SynonymMatches,
} from '~/types'
import { sanitizeQuery } from '~/util'
import { getExactMatches, getSynonymMatches } from '~/util/namex-api'

export const useConflicts = defineStore('conflicts', () => {
  const exactMatches = ref<Array<ConflictListItem>>([])
  const synonymMatches = ref<Array<ConflictList>>([])
  const cobrsPhoneticMatches = ref<Array<ConflictList>>([])
  const phoneticMatches = ref<Array<ConflictList>>([])

  async function retrieveExactMatches(
    query: string
  ): Promise<Array<ConflictListItem>> {
    query = sanitizeQuery(query, true)
    query = query.charAt(0) === '+' ? query.substring(1) : query

    const response = await getExactMatches(query)
    if (response.status !== 200)
      throw new Error('Unable to retrieve exact matches')

    const names = (await response.json()).names as Array<any>
    return names.map((entry) => {
      return {
        text: entry.name,
        highlightedText: entry.name,
        nrNumber: entry.id,
        startDate: entry.start_date,
        jurisdiction: entry.jurisdiction,
        source: entry.source,
      }
    })
  }

  async function retrieveSynonymMatches(query: string, exactPhrase: string) {
    // TODO
    query = sanitizeQuery(query)
    exactPhrase = exactPhrase || '*'

    const response = await getSynonymMatches(query, exactPhrase)
    if (response.status !== 200)
      throw new Error('Unable to retrieve synonym matches')

    return parseSynonymMatches(await response.json())
  }

  function parseSynonymMatches(json: SynonymMatches): Array<ConflictList> {
    let entry: any = null
    let name_stems: any[] = []
    let synonym_stems: any = null
    let synonymMatchesConflicts: any[] = []
    let wildcard_stack = false
    let { names } = json

    for (let i = 0; i < names.length; i++) {
      // remove any empty string stem values - they are not valid
      names[i].stems = names[i].stems.filter(function (elem) {
        return elem != ''
      })

      if (names[i].name_info.source) {
        //stack conflict
        entry = names[i].name_info
        synonym_stems = names[i].stems
        entry.class = 'conflict-result'
      } else {
        // stack title
        name_stems = names[i].stems
        entry = names[i].name_info

        wildcard_stack = entry.name.lastIndexOf('*') > 0

        entry.meta = entry.name
          .substring(entry.name.lastIndexOf('-') + 1)
          .trim()
        entry.class = 'conflict-synonym-title'
        entry.name = entry.name.replace('----', '').toUpperCase()
        let syn_index = entry.name.indexOf('SYNONYMS:')
        if (syn_index !== -1) {
          let last_bracket_indx = entry.name.lastIndexOf(')')
          let synonym_clause = entry.name.substring(
            syn_index + 10,
            last_bracket_indx
          )
          let synonym_list = synonym_clause.split(',')

          for (let syn = 0; syn < synonym_list.length; syn++) {
            for (let wrd = 0; wrd < name_stems.length; wrd++) {
              if (
                synonym_list[syn]
                  .toUpperCase()
                  .includes(name_stems[wrd].toUpperCase())
              ) {
                name_stems.splice(wrd, 1)
                wrd--
              }
            }
            entry.name = entry.name.replace(
              synonym_list[syn].toUpperCase(),
              '<span class="synonym-stem-highlight">' +
                synonym_list[syn].toUpperCase() +
                '</span>'
            )
          }
          entry.name = entry.name.replace('SYNONYMS:', '')
        }
        entry.name = entry.name.substring(0, entry.name.lastIndexOf('-')).trim()
      }
      entry.name = ' ' + entry.name
      let k = 0
      for (k = 0; k < name_stems.length; k++) {
        if (!wildcard_stack) {
          entry.name = entry.name.replace(
            ' ' + name_stems[k].toUpperCase(),
            '<span class="stem-highlight">' +
              ' ' +
              name_stems[k].toUpperCase() +
              '</span>'
          )
        }
        if (
          synonym_stems != undefined &&
          synonym_stems.indexOf(name_stems[k].toUpperCase()) != -1
        ) {
          synonym_stems.splice(
            synonym_stems.indexOf(name_stems[k].toUpperCase()),
            1
          )
        }
      }
      if (synonym_stems != undefined) {
        for (let k = 0; k < synonym_stems.length; k++) {
          entry.name = entry.name.replace(
            ' ' + synonym_stems[k].toUpperCase(),
            '<span class="synonym-stem-highlight">' +
              ' ' +
              synonym_stems[k].toUpperCase() +
              '</span>'
          )
        }
      }
      let output
      if (entry.class === 'conflict-result') {
        output = {
          text: entry.name
            .replace(
              /<SPAN CLASS="SYNONYM\-STEM\-HIGHLIGHT">|<SPAN CLASS="STEM\-HIGHLIGHT">|<\/SPAN>/gi,
              ''
            )
            .trim(),
          highlightedText: entry.name.trim(),
          meta: entry.meta,
          nrNumber: entry.id,
          startDate: entry.start_date,
          jurisdiction: entry.jurisdiction,
          source: entry.source,
          class: entry.class,
          id: `${i}-synonym`,
        }
      } else {
        output = {
          text: entry.name
            .replace(
              /<SPAN CLASS="SYNONYM\-STEM\-HIGHLIGHT">|<SPAN CLASS="STEM\-HIGHLIGHT">|<\/SPAN>/gi,
              ''
            )
            .trim(),
          highlightedText: entry.name.trim(),
          meta: entry.meta,
          class: entry.class,
          id: `${i}-synonym`,
        }
      }
      synonymMatchesConflicts.push(output)
    }

    let output = []
    let conflictsOnly = []
    let prevIndex: any

    for (let i = 0; i < synonymMatchesConflicts.length; i++) {
      let match = synonymMatchesConflicts[i]
      if (match.class === 'conflict-synonym-title') {
        match.children = []
        match.count = 0
        output.push(match)
        prevIndex = output.length - 1
      } else {
        conflictsOnly.push(match)
        output[prevIndex].children.push(match)
        output[prevIndex].count = output[prevIndex].children.length
      }
    }
    return output
  }

  async function retrieveCobrsPhoneticMatches(
    query: string,
    exactPhrase: string
  ): Promise<Array<ConflictList>> {
    // TODO
    query = sanitizeQuery(query)
    return []
  }

  async function retrievePhoneticMatches(
    query: string,
    exactPhrase: string
  ): Promise<Array<ConflictList>> {
    // TODO
    query = sanitizeQuery(query)
    return []
  }

  async function initialize(searchQuery: string, exactPhrase: string) {
    exactMatches.value = await retrieveExactMatches(searchQuery)
    synonymMatches.value = await retrieveSynonymMatches(
      searchQuery,
      exactPhrase
    )
    cobrsPhoneticMatches.value = await retrieveCobrsPhoneticMatches(
      searchQuery,
      exactPhrase
    )
    phoneticMatches.value = await retrievePhoneticMatches(
      searchQuery,
      exactPhrase
    )
  }

  return {
    initialize,
    exactMatches,
    synonymMatches,
    cobrsPhoneticMatches,
    phoneticMatches,
  }
})
