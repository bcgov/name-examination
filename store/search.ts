/* eslint-disable require-jsdoc */
import { DateTime } from 'luxon'
import { defineStore } from 'pinia'
import { SearchColumns } from '~/enums/SearchColumns'
import {
  ClientNotification,
  ConsentRequired,
  LastUpdate,
  Priority,
  Status,
  Submitted,
} from '~/enums/dropdownEnums'

const defaultFilters = () => {
  return {
    [SearchColumns.Status]: Status.Hold,
    [SearchColumns.LastModifiedBy]: '',
    [SearchColumns.NameRequestNumber]: '',
    [SearchColumns.Names]: '',
    [SearchColumns.ApplicantFirstName]: '',
    [SearchColumns.ApplicantLastName]: '',
    [SearchColumns.ConsentRequired]: ConsentRequired.All,
    [SearchColumns.Priority]: Priority.All,
    [SearchColumns.ClientNotification]: ClientNotification.All,
    [SearchColumns.Submitted]: Submitted.All,
    [SearchColumns.LastUpdate]: LastUpdate.All,
  }
}

type Row = { [column in SearchColumns]: string }

export const useSearchStore = defineStore('search', () => {
  const fixedColumns = Object.values(SearchColumns)
  const selectedColumns = ref(Object.values(SearchColumns)) // Initialize selected columns to all columns
  const rows: Ref<Row[]> = ref([])
  const resultNum = ref(0)
  const filters = reactive(defaultFilters())
  const selectedDisplay = ref(10)
  const selectedPage = ref(1)
  const submittedDateOrder: Ref<'asc' | 'desc'> = ref('asc')
  const submittedStartDate = ref('')
  const submittedEndDate = ref('')
  const lastSubmittedDateOption = ref(filters.Submitted)
  const isLoading = ref(false)

  const formattedSearchParams = computed(() => {
    const params = {
      order: `priorityCd:desc,submittedDate:${submittedDateOrder.value}`,
      queue:
        filters[SearchColumns.Status] === Status.All
          ? ''
          : filters[SearchColumns.Status],
      consentOption: filters[SearchColumns.ConsentRequired],
      ranking: filters[SearchColumns.Priority],
      notification: filters[SearchColumns.ClientNotification],
      submittedInterval:
        filters[SearchColumns.Submitted] != Submitted.Custom
          ? filters[SearchColumns.Submitted]
          : '',
      lastUpdateInterval: filters[SearchColumns.LastUpdate],
      rows: selectedDisplay.value.toString(),
      start: (
        Math.max(0, selectedPage.value - 1) * selectedDisplay.value
      ).toString(),
      activeUser: filters[SearchColumns.LastModifiedBy],
      nrNum: filters[SearchColumns.NameRequestNumber],
      compName: filters[SearchColumns.Names],
      firstName: filters[SearchColumns.ApplicantFirstName],
      lastName: filters[SearchColumns.ApplicantLastName],
      hour: DateTime.now().hour.toString(),
      submittedStartDate: submittedStartDate.value,
      submittedEndDate: submittedEndDate.value,
    }

    // return the params object with all properties that have a defined value
    return new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(([_, val]) => val !== '')
      )
    )
  })

  const formattedUrl = computed(() => {
    return new URL(
      `${import.meta.env.VITE_APP_NAMEX_API_VERSION}/requests?${
        formattedSearchParams.value
      }`,
      import.meta.env.VITE_APP_NAMEX_API_URL
    )
  })

  function parseRow(obj: any): Row {
    return {
      [SearchColumns.Status]: obj.stateCd,
      [SearchColumns.LastModifiedBy]: obj.activeUser,
      [SearchColumns.NameRequestNumber]: obj.nrNum,
      [SearchColumns.Names]: formatNames(obj.names),
      [SearchColumns.ApplicantFirstName]: obj.applicants[0]?.firstName,
      [SearchColumns.ApplicantLastName]: obj.applicants[0]?.lastName,
      [SearchColumns.NatureOfBusiness]:
        obj.natureBusinessInfo === null ? '' : obj.natureBusinessInfo,
      [SearchColumns.ConsentRequired]:
        obj.consentFlag === 'R'
          ? 'Received'
          : obj.consentFlag === 'Y'
          ? 'Yes'
          : 'No',
      [SearchColumns.Priority]:
        obj.priorityCd === 'Y' ? 'Priority' : 'Standard',
      [SearchColumns.ClientNotification]:
        obj.furnished === 'Y' ? 'Notified' : 'Not Notified',
      [SearchColumns.Submitted]: formatDate(obj.submittedDate),
      [SearchColumns.LastUpdate]: formatDate(obj.lastUpdate),
      [SearchColumns.LastComment]:
        obj.comments[obj.comments.length - 1]?.comment,
    }
  }

  async function getRows(url: URL): Promise<[numResults: number, rows: Row[]]> {
    const token = sessionStorage.getItem('KEYCLOAK_TOKEN')
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      return [data.response.numFound, data.nameRequests[0].map(parseRow)]
    } catch (error) {
      console.log(error)
      return [0, []]
    }
  }

  async function updateRows() {
    isLoading.value = true // start loading

    const url = formattedUrl.value
    const [numResults, responseRows] = await getRows(url)

    // if the filters were changed while we were waiting for this response, discard the reponse
    if (url != formattedUrl.value) return
    
    resultNum.value = numResults
    rows.value = responseRows

    isLoading.value = false // end loading
  }

  function toggleSubmittedDateOrder() {
    if (submittedDateOrder.value === 'asc') {
      submittedDateOrder.value = 'desc'
    } else {
      submittedDateOrder.value = 'asc'
    }
  }

  function $reset() {
    selectedColumns.value = Object.values(SearchColumns)
    Object.assign(filters, defaultFilters())
    selectedDisplay.value = 10
    selectedPage.value = 1
  }

  watch(
    () => [
      filters,
      selectedDisplay,
      submittedDateOrder,
      submittedStartDate,
      submittedEndDate,
    ],
    async (_state) => {
      selectedPage.value = 1
      if (filters.Submitted != Submitted.Custom) {
        submittedStartDate.value = ''
        submittedEndDate.value = ''
        lastSubmittedDateOption.value = filters.Submitted
      }
      await updateRows()
    },
    { deep: true }
  )

  watch(
    () => [selectedPage],
    async (_state) => {
      await updateRows()
    },
    { deep: true }
  )

  return {
    fixedColumns,
    selectedColumns,
    rows,
    resultNum,
    filters,
    selectedDisplay,
    selectedPage,
    submittedDateOrder,
    submittedStartDate,
    submittedEndDate,
    lastSubmittedDateOption,
    isLoading,
    formattedUrl,
    updateRows,
    toggleSubmittedDateOrder,
    $reset,
  }
})

function formatDate(input: string): string {
  return DateTime.fromISO(input).toFormat('yyyy-MM-dd, hh:mm a')
}

interface NameObject {
  choice: number
  name: string
}
function formatNames(names: Array<NameObject>): string {
  names.sort((n1, n2) => n1.choice - n2.choice)
  let formatted = ''
  for (let name of names) {
    formatted += `${name.choice}. ${name.name}\n`
  }
  return formatted
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))
}
