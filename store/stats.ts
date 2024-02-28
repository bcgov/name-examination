import { getStats } from '../util/namex-api'

export enum StatsColumns {
  RequestDetails = 'Request Details',
  Status = 'Status',
  LastUpdate = 'Last Update',
  BackToNRO = 'Updated to NRO'
}

/**
 * Fetches paged statistics based on the provided parameters.
 * @param {string} timespan - The timespan for the statistics.
 * @param {boolean} myStats - Indicates whether to fetch the user's statistics.
 * @return {Promise<any>} A Promise that resolves to the fetched statistics data.
 * @throws {Error} Throws an error if the network response is not successful.
 */
export async function getPagedStats (timespan: string | null, myStats: boolean) {
  let params = ''
  if (timespan !== '' && timespan !== null) {
    params = '?timespan=' + timespan
  } else {
    params = '?timespan=1'
  }
  // TODO the numbers should not be fixed
  params += '&currentpage=1&perpage=1000'
  if (myStats) {
    params += '&myStats=True'
  }

  try {
    const response = await getStats(params)

    if (response.ok) {
      const jsonData = await response.json() // Parse response JSON

      if (jsonData.numRecords >= 0) {
        const requestsData = jsonData.nameRequests

        const processedData = requestsData.map((statsData:any) => {
          statsData.names = sortNames(statsData.names)
          if (statsData.comments.length === 1 && statsData.comments[0].timestamp) {
            statsData.comments[0].timestamp = convertDate(statsData.comments[0].timestamp)
          }
          statsData.lastUpdate = convertDate(statsData.lastUpdate)
          statsData.names.forEach((name:any) => {
            if (name.decision_text) {
              name.decision_text = name.decision_text.split(/\n\n/)
            }
          })
          return statsData
        })

        processedData.numRecords = jsonData.numRecords
        return processedData // Return jsonData after processing
      }
    } else {
      throw new Error('Network response was not ok')
    }
  } catch (error) {
    console.error('There was a problem with your fetch operation:', error)
    throw error // Rethrow the error to handle it elsewhere if needed
  }
}

/**
 * Sorts an array of data objects based on the 'choice' property.
 * @param {Array<any>} data - The array of data objects to be sorted.
 * @return {Array<any>} Returns the sorted array of data objects.
 */
const sortNames = (data: Array<any>): Array<any> => {
  /**
   * Comparator function to compare two objects based on the 'choice' property.
   * @param {any} a - The first object to compare.
   * @param {any} b - The second object to compare.
   * @return {number} Returns -1 if 'a' is less than 'b', 1 if 'a' is greater than 'b', or 0 if they are equal.
   */
  function compare (a: any, b: any): number {
    if (a.choice < b.choice) { return -1 }
    if (a.choice > b.choice) { return 1 }
    return 0
  }

  // Sort the data array using the compare function
  return data.sort(compare)
}

const convertDate = (thedate: string) => {
  if (!thedate) return '' // Return empty string if the date is not provided or invalid

  const date = new Date(thedate)

  if (isNaN(date.getTime())) {
    // Handle invalid date format
    console.error('Invalid date format:', thedate);
    return '' // Return empty string or handle the error as appropriate
  }

  return date.toLocaleString('en-ca', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
