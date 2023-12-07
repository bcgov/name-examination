export default defineNuxtRouteMiddleware(async (to) => {
  // remove query params in url added by keycloak
  // from https://github.com/bcgov/business-transparency-registry/blob/3a8a8364c3279859e130f2c7aae4feee6b65c5a2/btr-web/btr-common-components/middleware/setupAuth.global.ts#L13
  if (to.query) {
    const params = new URLSearchParams(to.fullPath.split('?')[1])
    params.delete('state')
    params.delete('session_state')
    params.delete('code')
    params.delete('error')
    to.fullPath = to.path + (params.size > 0 ? `?${params}` : '') + to.hash
  }
})
