/* eslint-disable */

<template>
  <div style="height: 100%;">
    <v-app >
      <div id="app" style="height: 100%;" :class="is_editing ? 'bg-grey' : ''">
        <std-header style="z-index: 2"> </std-header>
        <router-view style="z-index: 1"></router-view>
      </div>
      <WordClassificationModal v-if="showWordClassification" />
      <v-dialog v-model="showErrorModal"
                width="50%"
                content-class="shift-dialog-up"
                class="pa-0">
        <v-container fluid ma-0 pa-0 bg-white>
          <v-layout column>
            <v-flex class="fw-700 fs-18 mb-0 pa-2" :class="modalType === 'error' ? 'error-modal' : 'warning-modal'">
              {{ modalType === 'error' ? 'Error' : 'Warning' }}
            </v-flex>
            <v-flex class="pre-line" fs-15 pa-2 mt-1>
              <section v-if="warningMsg">{{ warningMsg }}</section>
              <section v-if="errorMsg">{{ errorMsg }}</section>
            </v-flex>
            <v-flex>
              <div style="display: flex; justify-content: flex-end;">
                <div>
                  <v-btn flat
                         class="c-link"
                         @click="toggleErrorModal(false)">Dismiss
                  </v-btn>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-app>
  </div>
</template>
<script>
/* eslint-disable */
import StdHeader from '@/components/application/sections/StdHeader.vue'
import WordClassificationModal from './components/application/Examine/WordClassificationModal';

export default {
    name: 'App',
    data() {
      return {
        errorMsg: '',
        warningMsg: '',
        showErrorModal: false,
        modalType: 'error',
      }
    },
    components: {
      WordClassificationModal,
      StdHeader
    },
    created () {
      this.$store.dispatch('loadSetUp');
    },
    computed: {
      errorJSON() {
        return this.$store.getters.errorJSON
      },
      is_editing() {
        return this.$store.state.is_editing
      },
      showWordClassification() {
        let { baseURL } = this.$store.state
        if (!baseURL) return false
        if (baseURL.includes('-test') || baseURL.includes('-dev')) {
          return this.$store.state.allowWordClassificationModal
        }
        return false
      }
    },
    watch: {
      errorJSON(newErrors) {
        this.errorMsg = ''
        this.warningMsg = ''
        //if the errorJSON has new data populates the error/warning messages and triggers the popup
        if (newErrors) {
          if (Array.isArray(newErrors.warnings) && newErrors.warnings.length > 0) {
            for (let warning of newErrors.warnings) {
              this.warningMsg += `${warning.message} \n`
            }
            this.modalType = 'warning'
            this.toggleErrorModal(true)
          }

          if ( Array.isArray(newErrors.errors) && newErrors.errors.length > 0 ) {
            for (let error of newErrors.errors) {
              let errorKey = Object.keys(error.message)[0]
              let errorMessage = error.message[errorKey]
              this.errorMsg += `${errorKey}: ${errorMessage} \n`
            }
            this.modalType = 'error'
            this.toggleErrorModal(true)
          }

          if (newErrors.message) {
            this.errorMsg = newErrors.message
            this.modalType = 'error'
            this.toggleErrorModal(true)
          }
        }
      }
    },
    methods: {
      sendErrors() {
        let errorJSON = {
          errors: {
            message: {
              error500: 'Some dumb error happened'
            }
          }
        }
        this.$store.commit('setErrorJSON', errorJSON)
      },
      toggleErrorModal(value) {
        this.showErrorModal = value
      }
    }
  }
</script>

<style>
  /*app-wide import of css variables to use in scoped and inline style*/
  @import '~/../../static/css/variables.css';
  .error-modal {
    background-color: var(--priority);
    color: white;
  }

  .warning-modal {
    background-color: var(--gold);
    color: var(--text);
  }

  .bg-white {
    background-color: white;
  }

  .shift-dialog-up {
    position: relative;
    top: -200px;
  }

  .pre-line {
    white-space: pre-line;
  }
</style>
