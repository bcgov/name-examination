import { Routes } from '~/enums/routes'

export default defineNuxtRouteMiddleware((to, from) => {
  const { $auth } = useNuxtApp()

  if (!$auth.authenticated) {
    return navigateTo(Routes.Login)
  }
})
