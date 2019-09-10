<!--eslint-disable-->
<template>
  <v-flex :style="flexContainerStyle" ma-0 pa-0 fs-15>
    <v-layout wrap align-content-space-between>
      <v-flex>
        <v-card flat
                id="active-info-header-card"
                tile
                :class="cardClass">

          <!--TITLE / SHOW : CLOSE BUTTON-->
          <v-layout>
            <v-flex fw-600>{{ title }}</v-flex>
            <v-flex text-right v-if="!is_expanded">
              <!--EITHER RENDERS SHOW OR CLOSE BUTTON:  BASED ON buttonProps Computed Value -->
              <v-btn @click="buttonProps.action"
                     class="ma-0 pa-0"
                     flat>
                <v-icon :style="alignTop" color="light-blue">{{ buttonProps.icon }}</v-icon>
                <span :id="buttonProps.id"
                      :style="alignTop"
                      color="blue">{{ buttonProps.spanText }}</span>
              </v-btn>
            </v-flex>
          </v-layout>

          <!--<v-layout> FOR CONTENT-->
          <v-layout :class="!is_expanded && infoType !== 'applicant' ? 'adjust-info' : ''"
                    column>

            <!-- APPLICANT / CLIENT CONTACT -->
            <template v-if="infoType === 'applicant'">
              <v-flex lg12>
                <slot></slot>
              </v-flex>
            </template>

            <!--ADDITIONAL INFORMATION-->
            <template v-if="infoType === 'information' ">
              <template v-if="is_editing || (isActivePopUp && is_my_current_nr)">
                <v-flex lg12>
                  <v-textarea class="addtnl-info-text-area"
                              style="white-space"
                              id="info-header-card-add-info"
                              no-resize
                              rows="15"
                              v-model="additionalInfo" />
                </v-flex >
                <v-layout justify-end v-if="!is_expanded">
                  <v-flex shrink c-link>
                    <v-btn id="popup-cancel-button"
                           flat
                           @click="clearHeaderPopup">Cancel
                    </v-btn>
                  </v-flex>
                  <v-flex shrink c-link>
                    <v-btn id="popup-save-button" flat @click="saveInfo">
                      <span style="font-weight: 600"
                            id="addn-info-popup-save-span">Save</span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </template>
              <template v-else>
                <v-flex lg12>
                  <span :style="is_expanded ? {whiteSpace: 'pre-line'} : '' ">{{ truncate(text) }}</span>
                </v-flex >
              </template>
            </template>

            <!--NATURE OF BUSINESS-->
            <template v-if="infoType === 'nature'">
              <v-flex lg-12 v-if="is_expanded || isActivePopUp">
                <span :style="is_expanded ? {whiteSpace: 'pre-line'} : '' " >{{ text }}</span >
              </v-flex>
              <v-flex lg12 v-if="!is_expanded && !isActivePopUp">
                {{ truncate(text) }}
              </v-flex>
              <v-flex lg-12 v-if="is_expanded && !isActivePopUp">
                <slot></slot>
              </v-flex>
            </template>

          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
/* eslint-disable */
import clientinfoview from './client/ClientInfoHeader'
export default {
  name: 'InfoHeaderPopup',
  components: { clientinfoview },
  props: ['title', 'infoType', 'text', 'save', 'is_editing', 'is_viewing', 'is_expanded'],
  data() {
    return {
      originalInfo: null,
      alignTop: {
        position: 'relative',
        top: `${-8}px`
      }
    }
  },
  computed: {
    activePopUp() {
      if (this.$store.state.activeRequestBannerPopUp) {
        return this.$store.state.activeRequestBannerPopUp
      }
      return ''
    },
    buttonProps() {
      if (this.isActivePopUp) {
        return {
          action: this.clearHeaderPopup,
          spanText: 'Close',
          icon: 'clear',
          id: 'info-header-card-close-span'
        }
      } else {
        return {
          action: this.toggleRequestBannerPopUp,
          spanText: 'Show',
          icon: 'add',
          id: 'info-header-card-show-span'
        }
      }
    },
    cardClass() {
      if (this.is_expanded && this.infoType === 'nature') return 'with-padding'
      if (this.is_editing || this.is_viewing) { return 'editing-info' }
      if (this.isActivePopUp) { return 'expanded-info' }
      return 'base-info'
    },
    additionalInfo: {
      get: function() {
        return this.$store.getters.additionalInfo == null ?  '' : this.$store.getters.additionalInfo;
      },
      set: function(value) {
        this.$store.commit('additionalInfo', value);
      }
    },
    isActivePopUp() {
      if (this.$store.state.activeRequestBannerPopUp) {
        return this.$store.state.activeRequestBannerPopUp === this.infoType
      }
      return false
    },
    is_my_current_nr() {
      return this.$store.getters.is_my_current_nr;
    },
    flexContainerStyle() {
      if (this.infoType === 'applicant') {
        return {
          maxWidth: '325px',
          minHeight: '500px'
        }
      }
      return {
        maxWidth: '260px',
      }
    }
  },
  methods: {
    clearHeaderPopup() {
      if (this.activePopUp === 'information') {
        if (this.originalInfo !== this.additionalInfo) {
          this.$store.commit('additionalInfo', this.originalInfo)
        }
        this.originalInfo = null
      }
      this.$store.commit('toggleRequestBannerPopUp', null)
    },
    saveInfo() {
      this.$root.$emit('saveEdits')
      this.$store.commit('toggleRequestBannerPopUp', null)
      this.originalInfo = this.additionalInfo
    },
    toggleRequestBannerPopUp() {
      this.$store.commit('toggleRequestBannerPopUp', this.infoType)
      if (this.infoType === 'information') {
        this.originalInfo = this.additionalInfo.valueOf()
      }
    },
    truncate(text) {
      if (!text) return ''
      if (text.length <= 120) return text
      return text.substr(0, 120) + '...'
    }
  }
}
</script>

<style scoped>
  #popup-cancel-button {
    margin: 0px;
    padding: 0px;
    color: var(--link);
  }

  #popup-save-button {
    margin: 0px -20px 0px -40px;
    padding: 0px;
    color: var(--link);
    font-weight: 700 !important;
  }

  .addtnl-info-text-area {
    margin-left: auto;
    margin-right: auto;
    margin-top: 4px;
    padding-top: 2px;
    padding-left: 10px;
    padding-right: 10px;
    background-color: white;
    border: 1px solid var(--l-grey);
    height: 295px;
    max-height: 295px;
  }

  .base-info {
    margin: 0px !important;
    padding: 0px !important;
    background-color: var(--xl-grey);
  }
  .with-padding {
    background-color: var(--xl-grey);
    padding-right: 15px !important;
  }
  .editing-info {
    background-color: var(--xl-grey);
  }
  .expanded-info {
    z-index: 1000;
    min-height: 160px;
    margin: 0px !important;
    padding: 0px !important;
    background-color: var(--xl-grey);
    outline: 16px solid var(--xl-grey);
    box-shadow: 0px 0px 10px 18px var(--grey) !important;
  }

  .adjust-info {
    position: relative;
    top: -10px !important;
  }



</style>
