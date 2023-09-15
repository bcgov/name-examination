/* eslint-disable require-jsdoc */
import { defineStore } from 'pinia'

const fixedColumns = [
  { key: 'Status', name: 'Status' },
  { key: 'LastModifiedBy', name: 'Modified By' },
  { key: 'NameRequestNumber', name: 'NR Number' },
  { key: 'Names', name: 'Names' },
  { key: 'ApplicantFirstName', name: 'Applicant First Name' },
  { key: 'ApplicantLastName', name: 'Applicant Last Name' },
  { key: 'NatureOfBusiness', name: 'Nature Of Business' },
  { key: 'ConsentRequired', name: 'Consent Required' },
  { key: 'Priority', name: 'Priority' },
  { key: 'ClientNotification', name: 'Notified' },
  { key: 'Submitted', name: 'Submitted' },
  { key: 'LastUpdate', name: 'Last Update' },
  { key: 'LastComment', name: 'Last Comment' },
]

// Pinia store
export const searchFiltersStore = defineStore({
  id: 'searchFilters',
  state: () => {
    return {
      fixedColumns: fixedColumns,
      selectedColumns: fixedColumns, // Initialize selected columns to all columns
      rows: [], // Initialize rows array, this is populated and displayed in the table
      resultNum: 0, // Total number of results returned
      filters: {
        Status: 'HOLD',
        LastModifiedBy: '',
        NameRequestNumber: '',
        Names: '',
        ApplicantFirstName: '',
        ApplicantLastName: '',
        NatureOfBusiness: '',
        ConsentRequired: 'All',
        Priority: 'All',
        ClientNotification: 'All',
        Submitted: 'All',
        LastUpdate: 'All',
        LastComment: 'All',
      },
      selectedDisplay: 10,
      selectedPage: 1,
      isLoading: false,
    }
  },
  getters: {
    formattedUrl(): string {
      // Convert filters object to query string format
      const consentOption = this.filters.ConsentRequired
      const status = this.filters.Status === 'ALL' ? '' : this.filters.Status
      const priority = this.filters.Priority
      const notification = this.filters.ClientNotification
      const submitted = this.filters.Submitted
      const lastUpdate = this.filters.LastUpdate
      const rows = this.selectedDisplay
      const pagenumber =
        this.selectedPage === 1
          ? 0
          : (this.selectedPage - 1) * this.selectedDisplay
      const nrnum =
        this.filters.NameRequestNumber === ''
          ? ''
          : this.filters.NameRequestNumber
      const compName = this.filters.Names
      const firstName =
        this.filters.ApplicantFirstName === ''
          ? ''
          : this.filters.ApplicantFirstName
      const lastName =
        this.filters.ApplicantLastName === ''
          ? ''
          : this.filters.ApplicantLastName
      const modifiedBy =
        this.filters.LastModifiedBy === '' ? '' : this.filters.LastModifiedBy
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
          Status: request.stateCd,
          LastModifiedBy: request.activeUser,
          NameRequestNumber: request.nrNum,
          Names: formatName(request.nameSearch),
          ApplicantFirstName: request.applicants[0]?.firstName,
          ApplicantLastName: request.applicants[0]?.lastName,
          NatureOfBusiness:
            request.natureBusinessInfo === null
              ? ''
              : request.natureBusinessInfo,
          ConsentRequired:
            request.consentFlag === 'R'
              ? 'Received'
              : request.consentFlag === 'Y'
              ? 'Yes'
              : 'No',
          Priority: request.priorityCd === 'Y' ? 'Priority' : 'Standard',
          ClientNotification:
            request.furnished === 'Y' ? 'Notified' : 'Not Notified',
          Submitted: formatDate(request.submittedDate),
          LastUpdate: formatDate(request.lastUpdate),
          LastComment: request.comments[request.comments.length - 1]?.comment,
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
    .replace(/\|1(.*?)1\|/g, '1. $1 ')
    .replace(/\|2(.*?)2\|/g, '2. $1 ')
    .replace(/\|3(.*?)3\|/g, '3. $1 ')
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(searchFiltersStore, import.meta.hot))
}
