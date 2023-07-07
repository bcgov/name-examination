import { defineStore } from 'pinia';
import ConfigHelper from '~/util/config-helper';
import KeycloakServices from '~/public/keycloak/keycloak';
import { SessionStorageKeys } from '~/util/constants';

interface AuthState {
  token: string;
  idToken: string;
  refreshToken: string;
  kcGuid: string;
  loginSource: string;
}

export const AuthModule = defineStore({
  id: 'auth',
  state: (): AuthState => ({
    token: '',
    idToken: '',
    refreshToken: '',
    kcGuid: '',
    loginSource: '',
  }),
  getters: {
    isAuthenticated(state): boolean {
      return !!state.token;
    },
    keycloakGuid(state): string {
      return state.kcGuid || KeycloakServices.getUserInfo().keycloakGuid;
    },
    currentLoginSource(state): string {
      return state.loginSource || KeycloakServices.getUserInfo().loginSource;
    },
  },
  actions: {
    setKCToken(token: string): void {
      this.token = token;
      ConfigHelper.addToSession(SessionStorageKeys.KeyCloakToken, token);
    },
    setIDToken(idToken: string): void {
      this.idToken = idToken;
      ConfigHelper.addToSession(SessionStorageKeys.KeyCloakIdToken, idToken);
    },
    setRefreshToken(refreshToken: string): void {
      this.refreshToken = refreshToken;
      ConfigHelper.addToSession(SessionStorageKeys.KeyCloakRefreshToken, refreshToken);
    },
    setKCGuid(kcGuid: string): void {
      this.kcGuid = kcGuid;
    },
    setLoginSource(loginSource: string): void {
      this.loginSource = loginSource;
    },
    clearSession(): void {
        this.$reset()
    },
    syncWithSessionStorage(): void {
      const token = ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakToken) || '';
      const idToken = ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakIdToken) || '';
      const refreshToken = ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakRefreshToken) || '';

      this.token = token
      this.idToken = idToken
      this.refreshToken = refreshToken
    },
  },
});
