<!--eslint-disable-->
<template>
  <v-container id="header-main" class="top-nav-toolbar" fluid>
    <v-layout style="display: flex; justify-content: start">
      <div>
        <router-link to="/home" id="namex-logo-home-link">
          <img src="static/images/top-nav.png"
               id="bcgovnamexlogo"
               alt="Names Examination"
               @click="tab=null"
               title="Names Examination Header"/>
        </router-link>
      </div>
      <div v-if="auth">
        <v-toolbar flat color="white" height="70px">
          <v-toolbar-items>
            <v-btn flat
                   :ripple="true"
                   :href="adminURL"
                   id="admin"
                   target="_blank">
              Admin
            </v-btn>
            <v-tabs height="70px"
                    slider-color="green"
                    fixed-tabs
                    v-model="tab">
              <!--Hidden tab for when viewing part of app that isn't under a tab-->
              <v-tab to="/" style="display: none"></v-tab>
              <v-tab class="std-header-tab-width"
                     v-if="userCanExamine"
                     id="nameExamine"
                     to="/nameExamination">Examine Names</v-tab>
              <v-tab to="/find"
                     class="std-header-tab-width"
                     id="header-search-link">Search</v-tab>
            </v-tabs>
          </v-toolbar-items>
        </v-toolbar>
      </div>
      <div class="ml-auto px-3">
        <v-toolbar flat color="white" height="70px">
          <template v-if="auth">
            <v-form @submit.prevent="submit">
              <div style="display: flex;">
                <div>
                  <v-text-field class="styled-input"
                                autocomplete="off"
                                type="search"
                                placeholder="NR Number Lookup"
                                v-model="nrNum"
                                id="header-search-input" />
                </div>
                <div class="search-icon mt-auto mb-auto">
                  <v-btn flat
                         id="header-search-button"
                         icon
                         color="white"
                         class="m-1"
                         @click="submit">
                    <v-icon>search</v-icon>
                  </v-btn>
                </div>
                <div class="ml-3 mt-auto mb-auto"><router-link to="/stats">Stats</router-link></div>
              </div>
            </v-form>
            <div id="userid" class="ml-5 mt-auto mb-auto fv-ital">{{ userId }}</div>
            <div class="vertical-divider"/>
            <a class="mt-auto mb-auto"
               id="header-logout-button"
               @click="onLogout">Log Out</a>
          </template>
          <router-link v-if="!auth"
                       class="mt-auto mb-auto"
                       id="header-login-button"
                       to="/signin">Login</router-link>
        </v-toolbar>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
  export default {
    name: "std-header",
    data () {
      return {
        nrNum: '',
        tab: null,
      }
    },
    computed: {
      path() {
        return this.$route.path
      },
      userId() {
        return this.$store.getters.userId
      },
      auth() {
        return this.$store.getters.isAuthenticated
      },
      nrNumber() {
        if (this.$store.state.compInfo) {
          return this.$store.state.compInfo.nrNumber
        }
        return ''
      },
      userCanExamine() {
        return this.$store.getters.userHasApproverRole
      },
      adminURL() {
        return this.$store.getters.adminURL
      },
    },
    watch: {
      path(newPath) {
        let tabbedRoutes = ['/find', '/nameExamination']
        if (!tabbedRoutes.includes(newPath)) {
          this.tab = '/'
        }
      }
    },
    methods: {
      onLogout() {
        this.$store.dispatch('logout')
        window.location.assign("/");
      },
      submit() {
        if (this.nrNum) {
          let match = /(?:\s+|\s|)(\D|\D+|)(?:\s+|\s|)(\d+)(?:\s+|\s|)/
          let rtnNR = () => ( 'NR ' )

          let search = this.nrNum.replace(match, rtnNR('$1') + '$2')
          if (search) {
            let payload = {
              search,
              router: this.$router
            }
            if (search == this.nrNumber) {
              this.nrNum = ''
              return
            }
            this.$store.dispatch('newNrNumber', payload)
          }
          this.nrNum = ''
        }
      }
    }
  }
</script>

<style scoped>
  #admin {
    width: 170px
  }

  #header-logout-button, #header-login-button {
    color: var(--link) !important;
    cursor: pointer;
    font-size: 15px !important;
  }

  .std-header-tab-width {
    wdith: 170px !important;
  }

  .top-nav-toolbar {
    background-color: white !important;
    box-shadow: 0 0 6px 0 var(--grey);
    height: 70px;
    left: 0px;
    padding: 0px;
    position: relative;
    top: 0;
  }

  .vertical-divider {
    border-left: 1px solid var(--d-grey);
    height: 30px;
    margin: auto 18px auto 18px;
    width: 1px;
  }
</style>
