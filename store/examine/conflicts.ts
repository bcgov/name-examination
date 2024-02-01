export const useConflicts = defineStore('conflicts', () => {
  async function getExactMatches(query: string) {}
  async function getSynonymMatches(query: string, exactPhrase: string) {}
  async function getCobrsPhoneticMatches(query: string, exactPhrase: string) {}
  async function getPhoneticMatches(query: string, exactPhrase: string) {}

  async function getAllConflicts(searchQuery: string, exactPhrase: string) {
    await getExactMatches(searchQuery)
    await getSynonymMatches(searchQuery, exactPhrase)
    await getCobrsPhoneticMatches(searchQuery, exactPhrase)
    await getPhoneticMatches(searchQuery, exactPhrase)
  }

  return {
    getExactMatches,
    getSynonymMatches,
    getCobrsPhoneticMatches,
    getPhoneticMatches,
    getAllConflicts,
  }
})
