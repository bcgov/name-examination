import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    auth: false,
  }),
  actions: {
    toggleAuth() {
      this.auth = !this.auth;
    },
  },
});
