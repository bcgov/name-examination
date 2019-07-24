<!--eslint-disable-->
<template>
  <v-flex>
    <!--1st ROW - NR NUMBER / JURISDICTION / BUTTONS -->
    <v-container fluid mt-2 pa-0 :class="is_expanded || is_editing ? 'grey-bg' : ''">
      <v-layout align-start pb-3 row>
        <!--NR NUMBER-->
        <v-flex :class="['nr-number', 'text-left',  'mx-4', priority ? 'rejected' : 'dk-grey']" shrink>
          <span id="nrNumberDisplay">{{ nrNumber }}</span>
        </v-flex>
        <!--REQUEST DESCRIPTION / DROPDOWN -->
        <v-flex :lg5="is_editing" :grow="!is_editing">
          <v-layout v-if="!is_editing || is_closed" column>
            <v-flex fw-600 fs-16 mt-2 id="request-type-desc">{{ requestType_desc }}</v-flex>
            <v-flex fw-600 fs-14>{{ jurisdiction_display }}</v-flex>
          </v-layout>
          <v-layout column v-else>
            <v-flex mt-2>
              <v-select :items="requestType_options"
                        class="jurisdiction-dropdown"
                        attach
                        flat
                        dense
                        v-model="requestType" />
            </v-flex>
            <template v-if="jurisdiction_required">
              <v-flex fw-600 fs-15 mt-2>Jurisdiction:</v-flex>
              <v-flex :pb-2="!$v.jurisdiction.required">
                <v-select v-model="jurisdiction"
                          :items="jurisdiction_options"
                          item-value="text"
                          attach
                          class="jurisdiction-dropdown"
                          flat
                          dense
                          @input="$v.jurisdiction.$touch()" />
              </v-flex>
              <v-flex pb-2 field-error v-if="!$v.jurisdiction.required">
                Jurisdiction is required
              </v-flex>
            </template>
          </v-layout>
        </v-flex>

        <!--TOP RIGHT APP / ACTION BUTTONS -->
        <ActionButtons :edit="edit"
                       :is_viewing="is_viewing"
                       :toggleDetails="toggleDetails"
                       :can_edit="can_edit"/>
      </v-layout>
    </v-container>

    <!--2nd ROW:  INFO BANNER / POPUPS-->
    <v-container fluid
                 ma-0 py-0
                 align-start
                 justify-space-between
                 id="header-info-banner"
                 :class="is_expanded ? 'info-banner-xpanded' : 'info-banner-collapsed'"
                 :fill-height="is_expanded">
      <v-layout align-start
                justify-space-between
                pt-2>

        <!--COL 1:  Priority/Status/Comments -->
        <v-flex fs-15 shrink ml-3 :style="{maxWidth: '280px'}">
          <v-layout column>
            <v-flex priority
                    fw-700
                    v-if="priority">
              <v-icon id="priorityStarIcon"
                      class="priority fs-18">star</v-icon>Priority</v-flex>
            <v-flex id="div1"><b>Status:</b><span id="nrStatusText">
              {{ nr_status }} {{ is_approved_expired ? '-EXPIRED' : '' }}</span></v-flex>
            <v-flex><b>Examiner:</b> {{ examiner }}</v-flex>
            <v-flex>
              <v-icon color="light-blue"
                      class="mirrored"
                      @click="toggleCommentsPopUp(true)">chat_bubble_outline</v-icon>
              <b class="dark-blue--text">
                {{ internalComments_length }} Comments</b>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex shrink mx-2 style="height: 100px" v-if="!is_expanded">
          <v-divider vertical/>
        </v-flex>

        <!--COL 2:  Dates/Expiry -->
        <v-flex :style="{maxWidth: '280px'}"
                fs-15
                :ml-2="is_expanded">
          <v-layout column>
            <v-flex><b>Submit:</b> {{ formatDate(submittedDate) }}</v-flex>
            <template v-if="$store.getters.decision_made">
              <v-flex :class="!$store.getters.decision_made ? 'grey--text' : ''">
                <b>Decision:</b> {{ $store.getters.decision_made ? $store.getters.decision_made : 'n/a' }}
              </v-flex>
            </template>
            <template v-if="corpNum">
              <v-flex :class="!corpNum ? 'grey--text' : ''">
                <b>Corp Num:</b> {{ corpNum ? corpNum : 'n/a' }}
              </v-flex>
            </template>
            <v-flex v-if="expiryDate !== null">
              <v-layout column>
                <v-flex v-if="!is_editing && expiryDateForEdit != null">
                  <b>Expiry: </b>{{ expiryDateForEdit }}
                </v-flex>
                <v-flex v-else-if="!is_editing"><b>Expiry: </b>
                  {{ expiryDate }}
                </v-flex>
                <v-flex v-else>
                  <v-layout column :class="{'form-group-error': $v.expiryDateForEdit.$error}">
                    <v-layout wrap>
                      <v-flex pt-1 lg3><b>Expiry:</b></v-flex>
                      <v-flex lg7><v-text-field v-model="expiryDateForEdit"
                                                class="name-choice-input"
                                                placeholder="Expiry Date"
                                                autocomplete="off"
                                                :onchange="$v.expiryDateForEdit.$touch()" /></v-flex>
                      <v-flex lg3 />
                      <v-flex lg8 fs-14 ft-ital pl-3>YYYY-MM-DD</v-flex>
                    </v-layout >
                    <v-flex v-if="!$v.expiryDateForEdit.required">Expiry Date is required.</v-flex>
                    <v-flex class="error color-red" v-else-if="!$v.expiryDateForEdit.isActualDate">
                      This is not an actual date. Date must be in format YYYY-MM-DD.
                    </v-flex>
                    <v-flex class="error color-red" v-if="!$v.expiryDateForEdit.isValidFormat" >
                      Date must be in format YYYY-MM-DD.
                    </v-flex >
                    <v-flex class="error color-red" v-if="!$v.expiryDateForEdit.isFutureDate">
                      Expiry Date must be in the future.
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex v-else class="grey--text"><b>Expiry:</b> n/a</v-flex>
            <v-flex :class="!consumptionDate ? 'grey--text' : ''">
              <b>Consumed:</b> {{ consumptionDate ? consumptionDate : 'n/a' }}
            </v-flex>
            <template v-if="1===2">
              <v-flex grey--text>Consent: n/a</v-flex>
            </template>
          </v-layout>
        </v-flex>

        <v-flex shrink mx-2 style="height: 100px" v-if="!is_expanded">
          <v-divider vertical/>
        </v-flex>

        <!--COL 3:  NWPTA  AB-->
        <v-flex fs-15
                :style="nwptaABStyle">
          <v-layout column id="nwpta-ab" :style="nwptaABStyle">
            <nwpta ref="nwpta_ab"
                   :style="nwptaABStyle"
                   jurisdiction="AB"
                   :is_lp_nwpta_type="is_lp_nwpta_type"
                   :is_cp_nwpta_type="is_cp_nwpta_type"/>
          </v-layout>
        </v-flex>

        <!--COL 4:  NWPTA  SK-->
        <v-flex fs-15
                :style="nwptaSKStyle">
          <v-layout column id="nwpta-sk" :style="nwptaSKStyle">
            <nwpta ref="nwpta_sk"
                   jurisdiction="SK"
                   :style="nwptaSKStyle"
                   :is_lp_nwpta_type="is_lp_nwpta_type"
                   :is_cp_nwpta_type="is_cp_nwpta_type"/>
          </v-layout>
        </v-flex>

        <v-flex shrink mx-2 style="height: 100px" v-if="!is_expanded">
          <v-divider vertical/>
        </v-flex>

        <!--COL 5:  ADDITIONAL INFORMATION -->
        <InfoHeaderPopup title="Additional Info:"
                         :class="is_editing ? 'ml-2' : ''"
                         infoType="information"
                         :is_editing="is_editing"
                         :is_viewing="is_viewing"
                         :is_expanded="is_expanded"
                         :save="save"
                         :text="additionalInfo"/>

        <v-flex shrink mx-3 style="height: 100px" v-if="!is_expanded">
          <v-divider vertical/>
        </v-flex>

        <!--COL 6:  NATURE OF BUSINESS -->
        <InfoHeaderPopup title="N.O.B.:"
                         :class="is_editing ? 'ml-2' : ''"
                         :is_editing="is_editing"
                         :is_viewing="is_viewing"
                         :is_expanded="is_expanded"
                         infoType="nature"
                         :text="natureOfBusiness">
          <!--CONTENT HERE GOES IN SLOT UNDER NATURE OF BUSINESS-->
          <v-layout column>
            <v-flex mt-4 v-if="submitCount > 0"><b>Submit Count: </b>{{submitCount}}</v-flex>
            <template v-if="prev_nr_required">
              <v-layout column v-if="is_editing && !is_closed"
                        :class="{'form-group-error': $v.previousNr.$error}">
                <v-flex mt-4 fw-600>Previous NR</v-flex>
                <v-flex><v-text-field class="name-choice-input"
                                      v-model="previousNr"
                                      autocomplete="off"
                                      @input="$v.previousNr.$touch()" /></v-flex>
                <v-flex field-error v-if="!$v.previousNr.isValidNr">Please enter a valid NR ("NR xxxxxxx")</v-flex>
              </v-layout>
              <v-layout v-else mt-4>
                <v-flex><b>Previous NR: </b><span v-html="previousNr_link"></span></v-flex>
              </v-layout>
            </template>

            <template v-if="corp_num_required">
              <v-layout v-if="is_editing && !is_closed"
                        column
                        :class="{'form-group-error': $v.corpNum.$error}">
                <v-flex mt-4 fw-600>Related Corp #:</v-flex>
                <v-flex><v-text-field class="name-choice-input"
                                      v-model="corpNum"
                                      autocomplete="off"
                                      @input="$v.corpNum.$touch()" /></v-flex>
                <v-flex class="field-error"
                     v-if="!$v.corpNum.isValidCorpNum">Please enter a valid Incorporation Number</v-flex>
              </v-layout>
              <v-layout v-else>
                <v-flex mt-4 fw-600>Related Corp #: {{ corpNum }}</v-flex>
              </v-layout>
            </template>
          </v-layout>
        </InfoHeaderPopup>

        <v-flex shrink mx-3 style="height: 100px" v-if="!is_expanded">
          <v-divider vertical/>
        </v-flex>

        <!--COL 7:  APPLICANT INFORMATION -->
        <InfoHeaderPopup title="Applicant Information:"
                         :class="['ma-0', is_editing ? 'pr-4' : 'pr-2']"
                         :is_editing="is_editing"
                         :is_viewing="is_viewing"
                         :is_expanded="is_expanded"
                         infoType="applicant">
          <!--FORM FOR EDITING/VIEWING CLIENT and APPLICANT-->
          <clientinfoview :is_editing="is_editing"
                              :is_viewing="is_viewing"
                              :is_expanded="is_expanded"
                              :save="save"
                              :cancelSave="cancelSave"
                              ref="clientinfoview" />
        </InfoHeaderPopup>
      </v-layout>
    </v-container>
    <v-container v-if="is_editing && !is_closed">
        <!-- 3rd ROW  APPLICANT NAME CHOICES -->
        <v-layout style="width: 45%" align-center fs-15 wrap id="compNameContainer">
          <v-flex text-right pr-2 lg2>1.</v-flex>
          <v-flex lg10>
            <v-text-field v-model="compName1.name"
                          id="compName1"
                          autocomplete="off"
                          @input="$v.compName1.name.$touch()"
                          :onchange="$v.compName1.name.$touch()"
                          class="name-choice-input" />
          </v-flex>
          <v-flex offset-lg2
                  lg10
                  field-error
                  v-if="$v.compName1.name.$error">The first name choice is required</v-flex>
          <v-flex text-right pr-2 lg2>2.</v-flex>
          <v-flex lg10>
            <v-text-field v-model="compName2.name"
                          id="compName2"
                          autocomplete="off"
                          @input="$v.compName2.name.$touch()"
                          :onchange="$v.compName2.name.$touch()"
                          class="name-choice-input"/>
          </v-flex>
          <v-flex offset-lg2
                  lg10
                  field-error
                  v-if="$v.compName2.name.$error">
            To include a 3rd name choice the 2nd name choice is first required</v-flex>
          <v-flex text-right pr-2 lg2>3.</v-flex>
          <v-flex lg10>
            <v-text-field v-model="compName3.name"
                          id="compName3"
                          autocomplete="off"
                          @input="$v.compName2.name.$touch()"
                          :onchange="$v.compName2.name.$touch()"
                          class="name-choice-input"/>
          </v-flex>
        </v-layout>
    </v-container>
  </v-flex>
</template>

<script>
/* eslint-disable */
import clientinfoview from '@/components/application/Examine/client/ClientInfoHeader.vue'
import { required } from 'vuelidate/lib/validators'
import { isActualDate, isFutureDate, isNotBlankSpace, isValidFormat } from "../../../../static/js/validators"
import axios from '@/axios-auth'
import InfoHeaderPopup from './InfoHeaderPopup'
import nwpta from './nwpta/nwpta'
import ActionButtons from './ActionButtons'
import moment from 'moment'

export default {
  name: 'RequestInfoHeader',
  components: {
    ActionButtons,
    nwpta,
    InfoHeaderPopup,
    clientinfoview,
  },
  mounted() {
    this.$root.$on('saveEdits', this.save)
    this.$root.$on('cancelSave', this.cancelSave)
  },
  data() {
    return {
      corp_num_required: false,
      prev_nr_required: false,
      nwpta_required: false,
      jurisdiction_required: false,
      additional_info_template: null,
      is_lp_nwpta_type: null,
      is_cp_nwpta_type: null,
    }
  },
  validations() {
    // set basic validations that aren't conditional on any other fields
    var validations = {
      // first name choice is always required
      compName1: {
        name: {
          required,
          isNotBlankSpace
        }
      },
    }

    // if compName3 exists then compName2 must exist
    if (this.compName3.name && this.compName3.name.replace(/\s/g,'')) {
      validations.compName2 = {
        name: {
          required,
          isNotBlankSpace
        }
      }
    } else {
      validations.compName2 = {
        name: {
        }
      }
    }

    // validate jurisdiction if required
    if (this.jurisdiction_required && !this.is_closed) {
      validations.jurisdiction = {
        required,
      }
    }

    // validate corp # - not required, but if entered it must be validated
    if (this.corp_num_required && !this.is_closed) {
      validations.corpNum = {
        isValidCorpNum(value) {
          // if empty, it's valid - not required
          if (value == '' || value == null) return true;

          // valid corp numbers are between 7 and 10 characters long
          if (value.length < 7 || value.length > 10) return false;

          const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
          const url = '/api/v1/corporations/' + value;
          return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
            return true;
          })
            .catch(error => {
              return false;
            });
        },
      }
    }

    // validate Expiry Date if present - only present when editing a furnished NR
    if (this.expiryDateForEdit !== null) {
      validations.expiryDateForEdit = {
        required,
        isActualDate(value) {
          return isActualDate(value);
        },
        isValidFormat(value) {
          return isValidFormat(value);
        },
        isFutureDate(value) {
          // don't do this validation if it is not an actual date yet
          if (value == '' || value == null || !isValidFormat(value) || !isActualDate(value)) return true;

          return isFutureDate(value);
        },
      }
    }

    // validate Previous NR # - not required, but if entered it must be validated
    if (this.prev_nr_required && !this.is_closed) {
      validations.previousNr = {
        isValidNr(value) {
          // if empty, it's valid - not required
          if (value == '' || value == null) return true;

          // valid NR #s are NR, space, 7 digits (10 characters total)
          if (value.length !== 10) return false;
          if (value.substr(0, 3) !== 'NR ') return false;

          const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
          const url = '/api/v1/requests/' + value
          return axios.get(url, {headers: {Authorization: `Bearer ${myToken}`}}).then(response => {
            return true;
          })
            .catch(error => {
              return false;
            });
        },
      }
    }
    return validations;
  },
  computed: {
    activePopUp() {
      if (this.$store.state.activeRequestBannerPopUp) {
        return this.$store.state.activeRequestBannerPopUp
      }
      return ''
    },
    additionalInfo: {
      get: function() {
        return this.$store.getters.additionalInfo == null ?  '' : this.$store.getters.additionalInfo;
      },
      set: function(value) {
        this.$store.commit('additionalInfo', value);
      }
    },
    can_edit() {
      if (this.is_my_current_nr) return true;
      if (this.$store.getters.userHasEditRole && ['DRAFT', 'HOLD', 'REJECTED', 'APPROVED', 'CONDITIONAL'].indexOf(this.nr_status) > -1 ) return true;
      return false;
    },
    compName1: {
      get: function() {
        return this.$store.getters.compName1;
      },
      set: function(value) {
        this.$store.commit('compName1', value);
      }
    },
    compName2: {
      get: function() {
        return this.$store.getters.compName2;
      },
      set: function(value) {
        this.$store.commit('compName2', value);
      }
    },
    compName3: {
      get: function() {
        return this.$store.getters.compName3;
      },
      set: function(value) {
        this.$store.commit('compName3', value);
      }
    },
    consumptionDate() {
      if (this.$store.getters.consumptionDate && moment(this.$store.getters.consumptionDate).isValid()) {
        return new moment(this.$store.getters.consumptionDate).format('YYYY-MM-DD');
      }
      return ''
    },
    corpNum: {
      get: function () {
        return this.$store.getters.corpNum;
      },
      set: function (value) {
        this.$store.commit('corpNum', value);
      }
    },
    details: {
      get: function() {
        return this.$store.getters.details;
      },
      set: function(value) {
        this.$store.commit('details', value);
      }
    },
    examiner() {
      return this.$store.getters.examiner;
    },
    expiryDate: {
      get: function() {
        return this.$store.getters.expiryDate;
      },
      set: function(value) {
        this.$store.commit('expiryDate', value);
      }
    },
    expiryDateForEdit: {
      get: function() {
        return this.$store.getters.expiryDateForEdit;
      },
      set: function(value) {
        this.$store.commit('expiryDateForEdit', value);
      }
    },
    internalComments_length() {
      if (this.$store.getters.internalComments) {
        let comments = this.$store.getters.internalComments
        if (Array.isArray(comments) && comments.length > 0) {
          return comments.length
        }
      }
      return 0
    },
    is_approved_expired() {
      // if there is no expiry date, this NR is not approved-expired
      if (this.$store.getters.expiryDate == null) return false;

      let expired_date = new Date(this.$store.state.expiryDate);
      let date = new moment().format('YYYY-MM-DD');
      if (this.$store.getters.currentState === "APPROVED" && date > expired_date) return true;
      return false;
    },
    is_closed() {
      if (['REJECTED', 'APPROVED', 'CONDITIONAL'].indexOf(this.nr_status) > -1) return true;
      return false;
    },
    is_editing() {
      return  this.$store.state.is_editing;
    },
    is_expanded() {
      if (this.is_editing || this.is_viewing || this.$store.state.is_header_shown) return true
      return false
    },
    is_my_current_nr() {
      return this.$store.getters.is_my_current_nr;
    },
    jurisdiction: {
      get: function() {
        return this.$store.getters.jurisdiction;
      },
      set: function(value) {
        this.$store.commit('jurisdiction', value);
      }
    },
    jurisdiction_display() {
      if (this.jurisdiction && this.jurisdiction_options) {
        if (this.jurisdiction.length === 2) {
          let fullname = this.jurisdiction_options.find(opt => opt.SHORT_DESC === this.jurisdiction).text
          return fullname
        }
        if (this.jurisdiction.length > 2) {
          return this.jurisdiction
        }
      }
      return ''
    },
    jurisdiction_options() {
      return this.$store.getters.listJurisdictions;
    },
    natureOfBusiness: {
      get() {
        if (this.$store.getters.natureOfBusiness) {
          return this.$store.getters.natureOfBusiness
        }
        return ''
      },
      set(value) {
        this.$store.commit('natureOfBusiness', value);
      }
    },
    newComment: {
      get() {
        if (this.$store.state.newComment) {
          return this.$store.state.newComment
        }
        return ''
      }, set(e) {
        this.$store.commit('setNewComment', e)
      }
    },
    nr_status: {
      get: function() {
        return this.$store.getters.nr_status;
      },
      set: function(value) {
        this.$store.commit('nr_status', value);
      }
    },
    nwptaABStyle() {
      if (this.$store.getters.nwpta_ab) {
        for (let key in this.$store.getters.nwpta_ab) {
          if (this.$store.getters.nwpta_ab[key]) {
            return { maxWidth: 160 + 'px' }
          }
        }
      }
      return {
        maxWidth: 120 + 'px'
      }
    },
    nwptaSKStyle() {
      if (this.$store.getters.nwpta_sk) {
        for (let key in this.$store.getters.nwpta_sk) {
          if (this.$store.getters.nwpta_sk[key]) {
            return { maxWidth: 160 + 'px', marginLeft: 5+'px' }
          }
        }
      }
      return {
        maxWidth: 120 + 'px'
      }
    },
    nrNumber() {
      return  this.$store.getters.nrNumber;
    },
    previousNr: {
      get: function () {
        return this.$store.getters.previousNr;
      },
      set: function (value) {
        this.$store.commit('previousNr', value);
      }
    },
    previousNr_link() {
      if (this.$store.getters.previousNr != undefined) {
        // KBM 2018-08-30 - removed for MVP but will be part of a future phase
        // return '<a href="/' + this.$store.getters.previousNr + '" target="_blank">' + this.$store.getters.previousNr + '</a>';
        return this.$store.getters.previousNr;
      }
      else return '';
    },
    priority() {
      return this.$store.getters.priority;
    },
    requestType: {
      get: function() {
        this.checkReqTypeRules(this.$store.getters.requestType);
        return this.$store.getters.requestType;
      },
      set: function(value) {
        this.$store.commit('requestType', value);
      }
    },
    requestType_desc() {
      try {
        return getDescFromList(this.requestType_options, this.requestType);
      } catch (err) {
        return 'ERROR!!';
      }
    },
    requestType_options() {
      return this.$store.getters.listRequestTypes;
    },
    requestTypeRules() {
      return this.$store.getters.requestTypeRules;
    },
    reservationCount: {
      get: function() {
        return this.$store.getters.reservationCount;
      },
      set: function(value) {
        this.$store.commit('reservationCount', value);
      }
    },
    is_viewing() {
      return this.$store.state.is_header_shown && !this.is_editing;
    },
    submitCount() {
      return this.$store.getters.submitCount;
    },
    submittedDate() {
      return this.$store.getters.submittedDate;
    },
  },
  watch: {
    nrNumber: function (val) {
      console.log('RequestInfoHeader.nrNumber watcher fired:' )
      this.$store.dispatch('getpostgrescompInfo',this.nrNumber);
      this.checkReqTypeRules(this.requestType);
    },
    requestType: function(val) {
      /*
       Show/hide elements of NR Details based on request type (display and edit).
       */
      this.checkReqTypeRules(val);
    }
  },
  methods: {
    toggleDetails() {
      if (this.$store.state.is_header_shown) this.$store.state.is_header_shown = false;
      else this.$store.state.is_header_shown = true;
      this.$store.commit('toggleRequestBannerPopUp', null)
      this.toggleCommentsPopUp(false)
    },
    edit() {
      // if this isn't the user's INPROGRESS, make it that
      if (!this.is_my_current_nr && !this.is_closed) {

        // track the previous state if it's currently in DRAFT (otherwise do not)
        if (this.$store.state.currentState == 'DRAFT') this.updateNRStatePreviousState('INPROGRESS', 'DRAFT');
        else this.$store.dispatch('updateNRState', 'INPROGRESS');
      }

      // KBM - REMOVED per ticket #970
      /*
      if (this.is_closed) {
        this.$store.dispatch('syncNR',this.nrNumber);
      }
      */
      this.$store.commit('toggleRequestBannerPopUp', null)
      this.toggleCommentsPopUp(false)
      this.$store.state.is_editing = true;
    },
    save() {
      if (this.is_editing && !this.validate()) {
        // do not continue if there are validation errors
        return;
      }

      // if jurisdiction not required, clear the data (ie: BC)
      if (!this.jurisdiction_required) this.$store.commit('jurisdiction', null);

      // if corp num not required, clear the data
      if (!this.corp_num_required) this.$store.commit('corpNum', null);

      // if previous NR not required, clear the data
      if (!this.prev_nr_required) this.$store.commit('previousNr', null);

      // build Additional Info
      this.buildAdditionalInfo();

      // save Expiry Date - convert to UTC timestamp string to be consistent with data from API
      if (this.expiryDateForEdit !== null) {
        this.expiryDate = this.expiryDateForEdit
      }

      // adjust nwpta data if it was requested and the type was changed
      if (this.$refs.nwpta_ab != undefined) this.$refs.nwpta_ab.adjustUponSave();
      if (this.$refs.nwpta_sk != undefined) this.$refs.nwpta_sk.adjustUponSave();

      // set the state back if it was DRAFT, and clear previous value
      if (this.$store.state.previousStateCd == 'DRAFT') {
        this.$store.state.currentState = this.$store.state.previousStateCd;
        this.$store.state.previousStateCd = null;
      }

      this.$store.dispatch('updateRequest');
      this.$store.state.is_editing = false;

      // show full header after editing so user can see everything they changed
      if (this.activePopUp === 'information') {
        this.$store.commit('toggleRequestBannerPopUp', null)
        return
      }
      this.$store.state.is_header_shown = true;
      this.$nextTick(function() { window.scrollTo(0,0) })
    },
    cancelSave() {
      // set the state back to the previous state - only when previous state is DRAFT
      // - otherwise just get original data
      if (this.$store.state.previousStateCd == 'DRAFT') this.revertToPreviousState();
      else this.$store.dispatch('getpostgrescompInfo',this.nrNumber)

      this.$store.state.is_editing = false;
      this.$store.state.is_header_shown = false;
      this.$nextTick(function() { window.scrollTo(0,0) })
    },
    buildAdditionalInfo() {
      var newAddInfo = "";

      // create new additional info from template if relevant; add to top of additional info
      if (this.additional_info_template !== null && this.additional_info_template != '') {


        // split templates based on || separator
        var templates = this.additional_info_template.split('||');
        for (var i = 0; i < templates.length; i++) {
          var template = templates[i];

          // corp num placeholder
          // if there is no corp num for this placeholder, do not use this bit of the template
          if (template.indexOf('<corp_num>') > -1) {
            if (this.corpNum != null && this.corpNum != '')
              template = template.replace('<corp_num>', this.corpNum);
            else template = '';
          }

          // previous NR placeholder
          // if there is no previous NR for this placeholder, do not use this bit of the template
          if (template.indexOf('<prev_nr>') > -1) {
            if (this.previousNr != null && this.previousNr != '')
              template = template.replace('<prev_nr>', this.previousNr);
            else template = '';
          }

          // NWPTA placeholder
          // if there is no NWPTA data for this placeholder, do not use this bit of the template
          if (template.indexOf('<nwpta>') > -1) {
            // KBM 2018-08-22 - Do nothing - I don't think we need to add to Additional Info for
            // NWPTA because it will have been added during initial entry into NRO, and we do not
            // change nwpta type (assumed, numbered) to trigger adding/changing anything in
            // Additional Info.
            template = '';
          }

          /*
          Check if this bit of text is already in Additional Info - ie: don't keep adding note
          re. Corp Num or previous NR every time user saves, even if they haven't changed that
          data.
          */
          if (template != '') {
            if (this.additionalInfo.indexOf(template) == -1) newAddInfo += template + ' ';
          }
        }
      }

      if (newAddInfo != '') this.additionalInfo = newAddInfo + '\n' + this.additionalInfo;
    },
    validate() {
      /*
      Validate form using vuelidate.
       */
      console.log('got to validate()');

      // trigger vuelidate validation in this component and child component
      this.$v.$touch();
      this.$refs.clientinfoview.$v.$touch();

      var nwpta_ab_invalid = false;
      if (this.$refs.nwpta_ab !== undefined) {
        this.$refs.nwpta_ab.$v.$touch();
        nwpta_ab_invalid = this.$refs.nwpta_ab.$v.$invalid;
      }
      var nwpta_sk_invalid = false;
      if (this.$refs.nwpta_sk !== undefined) {
        this.$refs.nwpta_sk.$v.$touch();
        nwpta_sk_invalid = this.$refs.nwpta_sk.$v.$invalid;
      }

      // return opposite of 'invalid' flags, since we want to know if this IS valid
      return !this.$v.$invalid && !this.$refs.clientinfoview.$v.$invalid &&
        !nwpta_ab_invalid && !nwpta_sk_invalid;
    },
    checkReqTypeRules(val) {

      if (this.requestTypeRules != null) {
        var rules = this.requestTypeRules.filter(findArrValueByAttr(val, 'request_type'))[0];

        if (rules == undefined) {
          this.corp_num_required = false;
          this.prev_nr_required = false;
          this.nwpta_required = false;
          this.jurisdiction_required = false;
          this.additional_info_template = null;
          this.is_lp_nwpta_type = null;
          this.is_cp_nwpta_type = null;

        } else {
          this.corp_num_required = rules.corp_num_required;
          this.prev_nr_required = rules.prev_nr_required;
          this.nwpta_required = rules.nwpta_required; /* not used, can be removed after business confirms */
          this.jurisdiction_required = rules.jurisdiction_required;
          this.additional_info_template = rules.additional_info_template;
          this.is_lp_nwpta_type = rules.is_lp_nwpta_type;
          this.is_cp_nwpta_type = rules.is_cp_nwpta_type;
        }
      }
    },

    // Update NR State and Previous State
    updateNRStatePreviousState(nrState, previousState) {
      console.log('Updating Examination state (plus prev state) for number ' + this.nrNumber + ' to ' + nrState)
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN')
      const url = '/api/v1/requests/' + this.nrNumber;

      // save off nrNumber and $store because can't refer to "this" inside axios response
      var nrNumber = this.nrNumber;
      var store = this.$store;

      axios.patch(url,{"previousStateCd": previousState, "state": nrState} ,{headers: {Authorization: `Bearer ${myToken}`}})
        .then(function(response){
          console.log('state updated to ' + nrState + ' for ' + nrNumber);
          store.dispatch('getpostgrescompInfo', nrNumber);
        })
        .catch(error => console.log('ERROR: ' + error))
    },

    // set current state to previous state, and clear previous state field
    revertToPreviousState () {
      console.log('Updating Examination state & prev state for number ' + this.nrNumber);
      const myToken = sessionStorage.getItem('KEYCLOAK_TOKEN');
      const url = '/api/v1/requests/' + this.nrNumber;

      // save off nrNumber and $store because can't refer to "this" inside axios response
      var nrNumber = this.nrNumber;
      var store = this.$store;

      axios.patch(url,{"state": this.$store.state.previousStateCd, "previousStateCd": null} ,{headers: {Authorization: `Bearer ${myToken}`}})
        .then(function(response){
          console.log('state reverted to ' + store.state.previousStateCd + ' for ' + nrNumber);
          store.dispatch('getpostgrescompInfo', nrNumber);
        })
        .catch(error => console.log('ERROR: ' + error))
    },
    toggleCommentsPopUp(bool) {
      this.$store.commit('toggleCommentsPopUp', bool)
    },
    formatDate(d) {
      let date = moment(d, 'YYYY-MM-DD, hh:mm a')
      return date.format('YYYY-MM-DD, h:mma')
    },
    formatDateOnly(d) {
      let date = moment(d, 'YYYY-MM-DD, hh:mm a')
      return date.format('YYYY-MM-DD')
    }
  },
}
</script>

<style scoped>
  b {
    font-weight: 600 !important;
  }

  #compNameContainer {
    position: absolute;
    top: 565px;
    left: -60px;
  }

  .color-red {
    color: red !important;
  }

  .info-banner-collapsed {
    background-color: var(--xl-grey);
    height: 135px;
  }

  .info-banner-xpanded {
    background-color: var(--xl-grey) !important;
    padding: 0px !important;
  }

  .grey-bg {
    background-color: var(--xl-grey) !important;
    margin-bottom: 0 !important;
  }

  .jurisdiction-dropdown {
    background-color: white;
    height: 40px !important;
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    border: 1px solid var(--l-grey);
    padding: 4px 15px 4px 15px !important;
    font-size: 15px;
    text-transform: none !important;
  }

  .name-choice-input {
    margin-top: 5px;
    border: 1px solid var(--l-grey);
    padding: 2px 0px 0px 6px;
    height: 40px !important;
    background-color: white;
  }

  .nr-number {
    min-width: 210px;
    font-size: 34px;
    font-weight: 600;
  }

  .request-type {
    font-size: 24px;
  }
 </style>
