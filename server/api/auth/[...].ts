import { NuxtAuthHandler } from '#auth'
import KeycloakProvider from 'next-auth/providers/keycloak'
import { Routes } from '~/enums/routes'

const config = useRuntimeConfig()

export default NuxtAuthHandler({
  pages: {
    signIn: Routes.Login,
  },
  session: {
    maxAge: 60 * 60 * 12, // 12 hours
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    KeycloakProvider.default({
      clientId: config.public.keycloakClientId,
      clientSecret: '',
      issuer: `${config.public.keycloakAuthUrl}/realms/${config.public.keycloakRealm}`,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.user = token
      return session
    },
  },
})
