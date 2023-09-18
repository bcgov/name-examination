/* eslint-disable require-jsdoc */
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

// Pinia store
export const searchFiltersStore = defineStore({
  id: 'searchFilters',
  state: () => {
    return {
      fixedColumns: Object.values(SearchColumns),
      selectedColumns: Object.values(SearchColumns), // Initialize selected columns to all columns
      rows: [], // Initialize rows array, this is populated and displayed in the table
      resultNum: 0, // Total number of results returned
      filters: {
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
      },
      selectedDisplay: 10,
      selectedPage: 1,
      isLoading: false,
    }
  },
  getters: {
    formattedUrl(): string {
      // Convert filters object to query string format
      const consentOption = this.filters[SearchColumns.ConsentRequired]
      const status =
        this.filters[SearchColumns.Status] === 'ALL'
          ? ''
          : this.filters[SearchColumns.Status]
      const priority = this.filters[SearchColumns.Priority]
      const notification = this.filters[SearchColumns.ClientNotification]
      const submitted = this.filters[SearchColumns.Submitted]
      const lastUpdate = this.filters[SearchColumns.LastUpdate]
      const rows = this.selectedDisplay
      const pagenumber =
        this.selectedPage === 1
          ? 0
          : (this.selectedPage - 1) * this.selectedDisplay
      const nrnum =
        this.filters[SearchColumns.NameRequestNumber] === ''
          ? ''
          : this.filters[SearchColumns.NameRequestNumber]
      const compName = this.filters.Names
      const firstName =
        this.filters[SearchColumns.ApplicantFirstName] === ''
          ? ''
          : this.filters[SearchColumns.ApplicantFirstName]
      const lastName =
        this.filters[SearchColumns.ApplicantLastName] === ''
          ? ''
          : this.filters[SearchColumns.ApplicantLastName]
      const modifiedBy =
        this.filters[SearchColumns.LastModifiedBy] === ''
          ? ''
          : this.filters[SearchColumns.LastModifiedBy]
      // eslint-disable-next-line max-len
      return `${useRuntimeConfig().public.namexAPIURL}${useRuntimeConfig().public.namexAPIVersion}/requests?order=priorityCd:desc,submittedDate:asc&queue=${status}&consentOption=${consentOption}&ranking=${priority}&notification=${notification}&submittedInterval=${submitted}&lastUpdateInterval=${lastUpdate}&rows=${rows}&start=${pagenumber}&activeUser=${modifiedBy}&nrNum=${nrnum}&compName=${compName}&firstName=${firstName}&lastName=${lastName}`
    }
  },
  actions: {
    setSelectedColumns(columns: any) {
      this.selectedColumns = columns
    },
    async setSelectedDisplay(display: number) {
      this.selectedDisplay = display
      // Go back to first page whenever diplay is changed
      this.selectedPage = 1
      await this.getRows()
    },
    async setSelectedPage(page: number) {
      this.selectedPage = page
      await this.getRows()
    },
    // This action updates the filters state
    updateFilters(newFilters: any) {
      this.filters = { ...this.filters, ...newFilters }
    },
    async getRows() {
      this.isLoading = true // Start loading
      try {
        const url = this.formattedUrl
        const token = sessionStorage.getItem('KEYCLOAK_TOKEN')
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        this.resultNum = data.response.numFound
        this.rows = data.nameRequests[0].map((request: any) => ({
          [SearchColumns.Status]: request.stateCd,
          [SearchColumns.LastModifiedBy]: request.activeUser,
          [SearchColumns.NameRequestNumber]: request.nrNum,
          [SearchColumns.Names]: formatName(request.nameSearch),
          [SearchColumns.ApplicantFirstName]: request.applicants[0]?.firstName,
          [SearchColumns.ApplicantLastName]: request.applicants[0]?.lastName,
          [SearchColumns.NatureOfBusiness]:
            request.natureBusinessInfo === null
              ? ''
              : request.natureBusinessInfo,
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
        this.isLoading = false // end loading
      } catch (error) {
        console.error(error)
      }
    },
    async resetFilters() {
      this.$reset()
      await this.getRows()
    },
  },
})

function formatDate(input: string) {
  const date = new Date(input)
  // Formatting the date part
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0')

  // Formatting the time part
  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const period = hours < 12 ? 'a.m.' : 'p.m.'
  const formattedHours = ((hours + 11) % 12) + 1 // Convert 24-hour format to 12-hour format

  return `${year}-${month}-${day}, ${formattedHours}:${minutes} ${period}`
}

function formatName(input: string) {
  const formattedName = input.replace(/^[(]+|[)]+$/g, '')
  return formattedName
    .replace(/\|1(.*?)1\|/g, '1. $1 \n')
    .replace(/\|2(.*?)2\|/g, '2. $1 \n')
    .replace(/\|3(.*?)3\|/g, '3. $1 ')
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(searchFiltersStore, import.meta.hot))
}
