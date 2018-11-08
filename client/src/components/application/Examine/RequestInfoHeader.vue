<!--eslint-disable-->
<template>
  <span>
    <div class="row">

      <!-- COLUMN 1 -->

      <div id='div1' class="col-md-5 add-bottom-padding" >
        <div class="row">
          <div class="col-md-4" >
            <div class="nrNum" v-bind:class="{ REDnrNum: priority}">{{ nrNumber }}</div>
            <div class="priority" style="height: 30px;" v-if="priority">Priority</div>
            <div class="status">Status: {{ nr_status }} <span v-if="is_approved_expired">-EXPIRED</span></div>
          </div>
          <div class="col">
            <p v-if="!is_editing || is_closed" class="requestType">{{ requestType_desc }}</p>
            <select v-else v-model="requestType" class="form-control">
              <option v-for="option in requestType_options" v-bind:value="option.value"
                      v-bind:key="option.value">
                {{ option.text }}
              </option>
            </select>


            <p v-if="!is_editing || is_closed" class="add-top-padding"
               style="font-weight: bold;">{{ jurisdiction }}</p>
            <div v-else-if="jurisdiction_required" class="add-top-padding" :class="{'form-group-error': $v.jurisdiction.$error}">
              <h3>Jurisdiction</h3>
              <select v-model="jurisdiction" class="form-control" :onchange="$v.jurisdiction.$touch()">
                <option v-for="option in jurisdiction_options" v-bind:value="option.text"
                        v-bind:key="option.text">
                  {{ option.text }}
                </option>
              </select>
              <div class="error" v-if="!$v.jurisdiction.required">Jurisdiction is required.</div>
            </div>
            <div class="row">
              <div class="col">
                <nwpta ref="nwpta_ab"
                       jurisdiction="AB"
                       v-bind:is_lp_nwpta_type="is_lp_nwpta_type"
                       v-bind:is_cp_nwpta_type="is_cp_nwpta_type" />
              </div>
              <div class="col">
                <nwpta ref="nwpta_sk"
                       jurisdiction="SK"
                       v-bind:is_lp_nwpta_type="is_lp_nwpta_type"
                       v-bind:is_cp_nwpta_type="is_cp_nwpta_type" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="show_extended_header" class="row add-top-padding-extra" id="comments-div">
          <div class="col">
            <div>
              <h3>INTERNAL COMMENTS</h3>
              <div class="comment" v-for="comment in internalComments"
                   v-bind:key="comment.timestamp">
                <p>
                  <span class="comment-examiner">{{ comment.examiner }}</span>
                  -
                  <span class="comment-timestamp">{{ new Date(comment.timestamp).toLocaleString('en-ca',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',year:'numeric'}) }}</span>
                </p>
                <p class="comment-text">{{ comment.comment }}</p>

              </div>
            </div>
            <div v-if="is_editing" class="add-top-padding">
              <h3>add comment</h3>
              <textarea v-model="newComment" class="form-control" rows="5"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- COLUMN 2 -->

      <div id='div2' class="col-md-4 add-bottom-padding">
        <div class="row">
          <div class="col">

            <h3>NATURE OF BUSINESS</h3>
            <div v-if="show_extended_header">
              <p style="white-space: pre-line;">{{ natureOfBusiness }}</p>
            </div>
            <p v-else style="white-space: pre-line;">{{ natureOfBusinessTruncated }}</p>

            <div v-if="show_extended_header" class="add-top-padding">

              <h3>SUBMITTED DATE</h3>
              {{submittedDate}}

              <h3 v-if="expiryDate !== null">EXPIRY DATE</h3>
              <span v-if="expiryDate !== null">

                <span v-if="!is_editing">{{ expiryDate }}</span>
                <span v-else>

                  <span :class="{'form-group-error': $v.expiryDateForEdit.$error}">
                    <input type="text" v-model="expiryDateForEdit" class="form-control"
                           placeholder="Expiry Date" :onchange="$v.expiryDateForEdit.$touch()" />
                    <div class="date-helper-text">DD-MM-YYYY</div>
                    <div class="error" v-if="!$v.expiryDateForEdit.required">
                      Expiry Date is required.</div>
                    <div class="error" v-if="!$v.expiryDateForEdit.isValidFormat">
                      Date must be in format DD-MM-YYYY.</div>
                    <div class="error" v-else-if="!$v.expiryDateForEdit.isActualDate">
                      This is not an actual date. Date must be in format DD-MM-YYYY.</div>
                    <div class="error" v-if="!$v.expiryDateForEdit.isFutureDate">
                      Expiry Date must be in the future.</div>
                  </span>

                </span>
              </span>

              <h3 v-if="consumptionDate !== null">CONSUMPTION DATE</h3>
              <span v-if="consumptionDate !== null">{{consumptionDate}}</span>

              <h3 v-if="submitCount > 0">SUBMIT COUNT: {{submitCount}}</h3>

              <span v-if="prev_nr_required">
                <span v-if="is_editing && !is_closed" :class="{'form-group-error': $v.previousNr.$error}">
                  <h3 class="inline">Previous NR</h3>
                  <input class="form-control" v-model="previousNr" :onchange="$v.previousNr.$touch()" />
                  <div class="error" v-if="!$v.previousNr.isValidNr">Please enter a valid NR ("NR xxxxxxx").</div>
                </span>
                <span v-else>
                  <h3 class="inline">Previous NR</h3>
                  <span v-html="previousNr_link"></span>
                </span>
              </span>

              <span v-if="corp_num_required">
                <span v-if="is_editing && !is_closed" :class="{'form-group-error': $v.corpNum.$error}">
                  <h3 class="inline">Related Corp #</h3>
                  <input class="form-control" v-model="corpNum" :onchange="$v.corpNum.$touch()" />
                  <div class="error" v-if="!$v.corpNum.isValidCorpNum">Please enter a valid Incorporation Number.</div>
                </span>
                <span v-else>
                  <h3 class="inline">Related Corp #</h3>
                  {{ corpNum }}
                </span>
              </span>

            </div>
          </div>

        </div>
        <div class="row" v-if="is_editing">
          <div class="col add-top-padding">
            <h3>Name Choices</h3>

            <table v-if="!is_closed" style="width: 100%;">
              <tr :class="{'form-group-error': $v.compName1.name.$error}">
                <td>1.</td>
                <td>
                  <input v-model="compName1.name" class="form-control" :onchange="$v.compName1.name.$touch()" />
                  <div class="error" v-if="!$v.compName1.name.required">The first name choice is required.</div>
                </td>
              </tr>
              <tr>
                <td>2.</td>
                <td><input v-model="compName2.name" class="form-control" /></td>
              </tr>
              <tr>
                <td>3.</td>
                <td><input v-model="compName3.name" class="form-control" /></td>
              </tr>
            </table>
            <table v-else style="width: 100%;">
              <tr>
                <td>1. {{compName1.name}}</td>
              </tr>
              <tr>
                <td>2. {{compName2.name}}</td>
              </tr>
              <tr>
                <td>3. {{compName3.name}}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <!-- COLUMN 3 -->
      <div id='div3' class="col-md-3">

        <!-- comments indicator -->
        <i class="fa fa-comment" id="comments-indicator" v-if="internalComments_length > 0"></i>

        <div class="row add-bottom-padding-extra">
          <div class="col">
            <div class="row">
              <div class="col">
                <h3>ADDITIONAL INFORMATION</h3>
                <p v-if="!is_editing || is_closed" style="white-space: pre-line;">{{ additionalInfo }}</p>
                <textarea v-else v-model="additionalInfo" class="form-control" maxlength="150"
                          rows="5">
                </textarea>
              </div>
            </div>
            <div class="row add-bottom-padding">
              <div class="col add-top-padding">
                <clientinfoview ref="clientinfoview" />
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-right">
          <div id='header-button-container' class="col-md-12">

        <button v-shortkey="['alt', 'b']" @shortkey="toggleDetails()"  v-if="!is_editing" class="f1 btn btn-sm btn-outline-secondary"
                id="nr-details-show-hide-details-button" @click="toggleDetails">
          <span v-if="show_extended_header">Hide Details (<u>b</u>)</span>
          <span v-else>Show Details  (<u>b</u>)</span>
        </button>

            <button v-if="!is_editing && can_edit" class="btn btn-sm btn-secondary"
                    id="nr-details-edit-button" style="float: right;" @click="edit">Edit</button>

            <button v-if="is_editing" class="btn btn-sm btn-success" id="nr-details-save-button"
                    style="float: right;" @click="save">Save</button>
            <button v-if="is_editing" class="btn btn-sm btn-secondary" id="nr-details-cancel-button"
                    style="float: right;" @click="cancelSave">Cancel</button>

          </div>
        </div>
      </div>
    </div>
  </span>
</template>

<script>
/* eslint-disable */

// ClientInfoHeader - editable component
import clientinfoview from '@/components/application/Examine/client/ClientInfoHeader.vue';
import nwpta from '@/components/application/Examine/nwpta/nwpta.vue';
import { required } from 'vuelidate/lib/validators'
import axios from '@/axios-auth';


export default {
    name: 'RequestInfoHeader',
    data: function () {
      return {
        newComment: null,
        corp_num_required: false,
        prev_nr_required: false,
        nwpta_required: false,
        jurisdiction_required: false,
        additional_info_template: null,
        is_lp_nwpta_type: null,
        is_cp_nwpta_type: null,
      }
    },
    validations: function () {

      // set basic validations that aren't conditional on any other fields
      var validations = {
        // first name choice is always required
        compName1: {
          name: {
            required,
          }
        },
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
          isValidFormat(value) {
            return isValidFormat(value);
          },
          isActualDate(value) {
            return isActualDate(value);
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
      jurisdiction_options() {
        return this.$store.getters.listJurisdictions;
      },
      requestType_options() {
        return this.$store.getters.listRequestTypes;
      },
      requestTypeRules() {
        return this.$store.getters.requestTypeRules;
      },
      is_approved_expired() {
        // if there is no expiry date, this NR is not approved-expired
        if (this.$store.getters.expiryDate == null) return false;

        let expired_date = new Date(this.$store.state.expiryDate);
        let date = new Date();
        if (this.$store.getters.currentState === "APPROVED" && date > expired_date) return true;
        return false;
      },
      is_my_current_nr() {
        return this.$store.getters.is_my_current_nr;
      },
      is_editing() {
        return  this.$store.getters.is_editing;
      },
      can_edit() {
        // user can edit this if it is open (DRAFT, HOLD) or their INPROGRESS. If it is DRAFT or
        // HOLD, clicking edit button will switch it to their INPROGRESS (in edit() f'n).
        if (this.is_my_current_nr) return true;
        if (['DRAFT', 'HOLD', 'REJECTED', 'APPROVED', 'CONDITIONAL'].indexOf(this.nr_status) > -1) return true;
        return false;
      },
      is_closed() {
        if (['REJECTED', 'APPROVED', 'CONDITIONAL'].indexOf(this.nr_status) > -1) return true;
        return false;
      },
      show_extended_header() {
        return this.is_editing || this.$store.state.is_header_shown;
      },
      nrNumber() {
        return  this.$store.getters.nrNumber;
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
      jurisdiction: {
        get: function() {
          return this.$store.getters.jurisdiction;
        },
        set: function(value) {
          this.$store.commit('jurisdiction', value);
        }
      },
      natureOfBusiness: {
        get: function() {
          return  this.$store.getters.natureOfBusiness;
        },
        set: function(value) {
          this.$store.commit('natureOfBusiness', value);
        }
      },
      natureOfBusinessTruncated() {
        try {
          if (this.natureOfBusiness.length > 200) return this.natureOfBusiness.substr(0, 200) + '...';
          else return this.natureOfBusiness;
        } catch (err) {
          return this.natureOfBusiness;
        }
        if (this.natureOfBusiness.length > 200) return this.natureOfBusiness.substr(0, 200) + '...';
        else return this.natureOfBusiness;
      },
      nr_status: {
        get: function() {
          return this.$store.getters.nr_status;
        },
        set: function(value) {
          this.$store.commit('nr_status', value);
        }
      },
      examiner() {
        return this.$store.getters.examiner;
      },
      priority() {
        return this.$store.getters.priority;
      },
      reservationCount: {
        get: function() {
          return this.$store.getters.reservationCount;
        },
        set: function(value) {
          this.$store.commit('reservationCount', value);
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
      additionalInfo: {
        get: function() {
          return this.$store.getters.additionalInfo == null ?  '' : this.$store.getters.additionalInfo;
        },
        set: function(value) {
          this.$store.commit('additionalInfo', value);
        }
      },
      internalComments: {
        get: function() {
          return this.$store.getters.internalComments;
        },
        set: function(value) {
          this.$store.commit('internalComments', value);
        }
      },
      internalComments_length() {
        // non-breaking attribute for number of comments (doesn't break on null)
        try {
          return this.internalComments.length;
        } catch (err) {
          return 0;
        }
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
      consumptionDate() {
        return this.$store.getters.consumptionDate;
      },
      submittedDate() {
        return this.$store.getters.submittedDate;
      },
      submitCount() {
        return this.$store.getters.submitCount;
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
      corpNum: {
        get: function () {
          return this.$store.getters.corpNum;
        },
        set: function (value) {
          this.$store.commit('corpNum', value);
        }
      },
    },
    components: {
      clientinfoview,
      nwpta,
    },
    methods: {
      toggleDetails() {
        if (this.$store.state.is_header_shown) this.$store.state.is_header_shown = false;
        else this.$store.state.is_header_shown = true;
      },
      edit() {
        // if this isn't the user's INPROGRESS, make it that
        if (!this.is_my_current_nr && !this.is_closed) {
          this.$store.dispatch('updateNRState', 'INPROGRESS');
        }

        // KBM - REMOVED per ticket #970
        /*
        if (this.is_closed) {
          this.$store.dispatch('syncNR',this.nrNumber);
        }
        */

        this.$store.state.is_editing = true;
      },
      save() {

        if (!this.validate()) {
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

        // save new comment
        this.addNewComment();

        // save Expiry Date - convert to UTC timestamp string to be consistent with data from API
        if (this.expiryDateForEdit !== null) {
          this.expiryDate = new Date(
              this.expiryDateForEdit.substr(6,4), // yyyy
              this.expiryDateForEdit.substr(3,2)-1, // mm
              this.expiryDateForEdit.substr(0,2)) // dd
            .toUTCString();
        }

        // adjust nwpta data if it was requested and the type was changed
        if (this.$refs.nwpta_ab != undefined) this.$refs.nwpta_ab.adjustUponSave();
        if (this.$refs.nwpta_sk != undefined) this.$refs.nwpta_sk.adjustUponSave();

        this.$store.dispatch('updateRequest');
        this.$store.state.is_editing = false;

        // show full header after editing so user can see everything they changed
        this.$store.state.is_header_shown = true;

      },
      cancelSave() {
        this.$store.dispatch('getpostgrescompInfo',this.nrNumber)
        this.$store.state.is_editing = false;
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
      addNewComment() {

        // do nothing if comment is blank
        if (this.newComment == '' || this.newComment == null) return;

        // create new comment object with just text, and add it to list of comments in data structure
        var newCommentData = {
          comment: this.newComment,
          examiner: this.$store.state.examiner
        };
        this.internalComments = this.internalComments.concat(newCommentData);

        // clear newComment field for next comment added in this session
        this.newComment = null;
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
    }
}
</script>

<style scoped>

   .nrNum {
     font-size: 1.5em;
     font-weight: bold;
     text-align: center;
     margin-bottom: 10px;
   }
  .REDnrNum {
    color: #ff0000;
  }
  .priority {
    padding: 5px;
    text-align: center;
    background-color: #cc0000;
    color: white;
    font-size: 13px;
    margin-bottom: 10px;
  }
  .status {
    font-size: 1.1em;
    padding-top: 5px;
    text-align: center;
  }

  .requestType {
    font-size: 1.3em;
    font-weight: bold;
  }

  #header-button-container button {
    margin: 5px 5px 5px 0;
  }
  #header-button-container .f1 {
    float: right;
    margin-right: 0;
  }

  .comment {
    padding: 10px 0px;
    border-bottom: 1px solid #ccc;
  }
  .comment:last-child {
    border-bottom: none;
  }

  .comment-text {
    white-space: pre-line;
  }

  .comment-timestamp, .comment-examiner {
    font-style: italic;
  }

  #comments-indicator {
    position: absolute;
    top: 0;
    right: 15px;
    font-size: 16px;
  }
  .add-top-padding-extra {
    padding-top: 45px;
  }

  .add-bottom-padding {
    padding-bottom: 10px;
  }

  .add-bottom-padding-extra {
    padding-bottom: 30px;
  }

  .bottom-right {
    position: absolute;
    bottom: 0;
    right: 0;
  }

 </style>

<!-- unscoped -->
<style>
  .RequestInfoHeader {
    font-size: 14px;
  }
</style>

<style scoped>
  .date-helper-text {
    font-style: italic;
    color: grey;
  }
</style>
