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

export const useSearchFiltersStore = defineStore('searchfilters', () => {
  const fixedColumns = Object.values(SearchColumns)
  const selectedColumns = ref(Object.values(SearchColumns)) // Initialize selected columns to all columns
  const rows = ref([])
  const resultNum = ref(0)
  const filters = ref(defaultFilters())
  const selectedDisplay = ref(10)
  const selectedPage = ref(1)
  const submittedDateOrder: Ref<'asc' | 'desc'> = ref('asc')
  const submittedStartDate = ref('')
  const submittedEndDate = ref('')
  const lastSubmittedDateOption = ref(filters.value.Submitted)
  const isLoading = ref(false)

  const formattedUrl = computed(() => {
    const filtersVal = filters.value
    const params = new URLSearchParams({
      order: `priorityCd:desc,submittedDate:${submittedDateOrder.value}`,
      queue:
        filtersVal[SearchColumns.Status] === Status.All
          ? ''
          : filtersVal[SearchColumns.Status],
      consentOption: filters.value[SearchColumns.ConsentRequired],
      ranking: filters.value[SearchColumns.Priority],
      notification: filters.value[SearchColumns.ClientNotification],
      submittedInterval:
        filters.value.Submitted != Submitted.Custom
          ? filters.value[SearchColumns.Submitted]
          : '',
      lastUpdateInterval: filters.value[SearchColumns.LastUpdate],
      rows: selectedDisplay.value.toString(),
      start: (
        Math.max(0, selectedPage.value - 1) * selectedDisplay.value
      ).toString(),
      activeUser:
        filters.value[SearchColumns.LastModifiedBy] === ''
          ? ''
          : filters.value[SearchColumns.LastModifiedBy],
      nrNum:
        filters.value[SearchColumns.NameRequestNumber] === ''
          ? ''
          : filters.value[SearchColumns.NameRequestNumber],
      compName: filters.value.Names,
      firstName:
        filters.value[SearchColumns.ApplicantFirstName] === ''
          ? ''
          : filters.value[SearchColumns.ApplicantFirstName],
      lastName:
        filters.value[SearchColumns.ApplicantLastName] === ''
          ? ''
          : filters.value[SearchColumns.ApplicantLastName],
      hour: DateTime.now().hour.toString(),
      submittedStartDate: submittedStartDate.value,
      submittedEndDate: submittedEndDate.value,
    })
    return new URL(
      `${import.meta.env.VITE_APP_NAMEX_API_VERSION}/requests?${params}`,
      import.meta.env.VITE_APP_NAMEX_API_URL
    )
  })

  async function getRows() {
    isLoading.value = true // Start loading
    try {
      const url = formattedUrl.value
      const token = sessionStorage.getItem('KEYCLOAK_TOKEN')
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      resultNum.value = data.response.numFound
      rows.value = data.nameRequests[0].map((request: any) => ({
        [SearchColumns.Status]: request.stateCd,
        [SearchColumns.LastModifiedBy]: request.activeUser,
        [SearchColumns.NameRequestNumber]: request.nrNum,
        [SearchColumns.Names]: formatNames(request.names),
        [SearchColumns.ApplicantFirstName]: request.applicants[0]?.firstName,
        [SearchColumns.ApplicantLastName]: request.applicants[0]?.lastName,
        [SearchColumns.NatureOfBusiness]:
          request.natureBusinessInfo === null ? '' : request.natureBusinessInfo,
        [SearchColumns.ConsentRequired]:
          request.consentFlag === 'R'
            ? 'Received'
            : request.consentFlag === 'Y'
            ? 'Yes'
            : 'No',
        [SearchColumns.Priority]:
          request.priorityCd === 'Y' ? 'Priority' : 'Standard',
        [SearchColumns.ClientNotification]:
          request.furnished === 'Y' ? 'Notified' : 'Not Notified',
        [SearchColumns.Submitted]: formatDate(request.submittedDate),
        [SearchColumns.LastUpdate]: formatDate(request.lastUpdate),
        [SearchColumns.LastComment]:
          request.comments[request.comments.length - 1]?.comment,
      }))
      isLoading.value = false // end loading
    } catch (error) {
      console.error(error)
    }
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
    filters.value = defaultFilters()
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
      if (filters.value.Submitted != Submitted.Custom) {
        submittedStartDate.value = ''
        submittedEndDate.value = ''
        lastSubmittedDateOption.value = filters.value.Submitted
      }
      await getRows()
    },
    { deep: true }
  )

  watch(
    () => [selectedPage],
    async (_state) => {
      await getRows()
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
    getRows,
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
  import.meta.hot.accept(
    acceptHMRUpdate(useSearchFiltersStore, import.meta.hot)
  )
}
