<!--eslint-disable-->
<template>
  <v-container v-if="$store.getters.decisionPanel.show"
               decision-container
               fluid py-0 px-3
               :opacity-30="!is_making_decision">
    <v-layout wrap>
      <v-flex lg6
              fs-24
              grow
              style="position: relative; top: 0px;">Decision</v-flex>
      <v-layout justify-end>
        <div style="position: relative; top: 4px;">
          <v-checkbox class="pa-0 ma-0"
                      :disabled="!is_making_decision"
                      light
                      v-model="consent_required_by_user" />
        </div>
        <div class="fs-15" style="position: relative; top: 4px">Consent </div>
      </v-layout>

      <v-flex lg12 style="position: relative; top: -11px"><v-divider /></v-flex>

      <v-flex d-flex
              style="position: relative; top: -8px;"
              ma-0
              mb-1
              notification-banner
              v-if="conditionsText && conditionsText.length > 0">
        <v-layout my-auto wrap>
          <v-flex :key="i+'cond'"
                  :mt-1="i > 0"
                  lg12
                  px-3
                  v-for="(cond, i) of conditionsText">
            <b>{{ cond.phrase[0] + cond.phrase.substr(1).toLowerCase() }} – </b>{{ cond.text }}
          </v-flex>
        </v-layout>
      </v-flex>

      <!--COLUMN #1: MESSAGE SELECTION-->
      <v-flex lg6 style="height: 400px" ma-0 pa-0>
        <v-layout wrap add-stock-text-col fill-height style="height: 400px" ma-0 pa-0>

          <!--CONDITIONS-->
          <v-flex lg12 mt-2 id="conditions-select-area">
            <div class="fs-15 my-2 fw-600">Conditions</div>
            <div id="conditions-decision-select-field">
              <v-select :disabled="customer_message_override !== null || !is_making_decision"
                        :height="selected_conditions.length <= 1 ? 30 : null"
                        :items="conditionsInstructions"
                        :menu-props="menuProps"
                        browser-autocomplete="off"
                        chips
                        attach
                        class="decision-select-style"
                        dense
                        hide-selected
                        item-text="phrase"
                        multiple
                        return-object
                        single-line
                        small-chips
                        v-model="selected_conditions">
                <template v-slot:selection="{ item, index }">
                  <v-chip class="chip-class">{{ truncateChipText(item.phrase) }}
                    <v-icon @click.stop="removeChip('selected_conditions', index)"
                            class="chip-close-icon">clear</v-icon>
                  </v-chip>
                </template>
              </v-select>
            </div>
          </v-flex>

          <!--CONFLICTS-->
          <v-flex lg12 id="conflicts-select-area">
            <div class="fs-15 mb-2 mt-4 fw-600">Conflicts</div>
            <div id="conflicts-decision-select-field" >
              <v-select :disabled="customer_message_override !== null || !is_making_decision"
                        :height="selected_conflicts.length <= 1 ? 30 : null"
                        :items="conflictList"
                        :menu-props="menuProps"
                        browser-autocomplete="off"
                        chips
                        class="decision-select-style"
                        dense
                        attach
                        hide-selected
                        multiple
                        return-object
                        single-line
                        small-chips
                        v-model="selected_conflicts">
                <template v-slot:selection="{ item, index }">
                  <v-chip class="chip-class">{{ truncateChipText(item.text) }}
                    <v-icon @click.stop="removeChip('selected_conflicts', index, item.nrNumber)"
                            class="chip-close-icon">clear</v-icon>
                  </v-chip>
                </template>
                <template v-slot:no-data>
                  <div class="v-list__tile__title"
                       style="position: relative;
                              font-size: 13px;
                              padding: 8px 0px 6px 14px;
                              min-height:40px">
                    {{ conflictsAutoAdd ? 'No Conflicts' : 'No conflicts selected (and auto-add is off).'}}
                  </div>
                </template>
              </v-select>
            </div>
          </v-flex>

          <!--MARCROS-->
          <v-flex lg12 data-app id="macros-v-flex" ref="macrosField">
            <div class="fs-15 mb-2 mt-4 fw-600">Macros</div>
            <div id="macros-decision-select-field">
              <v-select :disabled="customer_message_override !== null || !is_making_decision"
                        :height="selected_reasons.length <= 1 ? 30 : null"
                        :items="listDecisionReasons"
                        :menu-props="menuProps"
                        browser-autocomplete="off"
                        chips
                        attach
                        class="decision-select-style"
                        dense
                        hide-selected
                        item-text="name"
                        multiple
                        return-object
                        small-chips
                        v-model="selected_reasons">
                <template v-slot:selection="{ item, index }">
                  <v-chip class="chip-class">{{ truncateChipText(item.name) }}
                    <v-icon class="chip-close-icon"
                            @click.stop="removeChip('selected_reasons', index)">clear
                    </v-icon>
                  </v-chip>
                </template>
              </v-select>
            </div>
          </v-flex>

          <!--TRADEMARKS-->
          <v-flex id="trademarks-v-flex" ref="trademarksSelectField">
            <div class="fs-15 mt-4 fw-600">Trademarks</div>
            <div id="trademarks-decision-select-field">
              <v-select :disabled="customer_message_override !== null || !is_making_decision"
                        :height="selected_trademarks.length <= 1 ? 30 : null"
                        :items="trademarks"
                        :menu-props="menuProps"
                        browser-autocomplete="off"
                        chips
                        class="decision-select-style"
                        dense
                        attach
                        hide-selected
                        item-text="name"
                        multiple
                        return-object
                        small-chips
                        v-model="selected_trademarks">
                <template v-slot:selection="{ item, index }">
                  <v-chip class="chip-class">{{ truncateChipText(item.name) }}
                    <v-icon @click.stop="removeChip('selected_trademarks', index)"
                            class="chip-close-icon">clear</v-icon>
                  </v-chip>
                </template>
              </v-select>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>

      <!--COLUMN #2:  OUTPUT-->
      <v-flex lg6>
        <v-layout column>

          <!--MESSAGE OUTPUT TEXTAREA-->
          <v-flex>
            <div class="decision-flex-holder">
              <div class="fs-15 fw-600 ma-0 pa-0" style="position:relative; top:12px">
                Message To Requestor<span class="c-priority ml-1" v-if="customer_message_override">(Edited)</span>
              </div>
                <v-btn flat
                       :disabled="!is_making_decision"
                       @click="showModal"
                       class="ma-0 pa-0">
                  <img src="/static/images/buttons/edit-button-icon.png">
                </v-btn>
            </div></v-flex>
          <v-flex textarea-outer-v-flex mt-2>
            <v-textarea class="fs-14 pa-0 ma-0 decision-msg-textarea"
                        readonly
                        full-width
                        id="decision-msg-preview-area"
                        solo
                        rows="15"
                        flat
                        height="290px"
                        v-model="customer_message_display">
            </v-textarea>
            <div class="decision-flex-holder">
              <div :class="messageDisplayProps.class">{{ messageDisplayProps.count }}</div>
              <div>
                <v-btn flat
                       id="decision-msg-clear-button"
                       class="ma-0 pa-0"
                       :disabled="!customer_message_override || !is_making_decision"
                       @click="customer_message_override = null"
                       v-if="customer_message_override">Clear Edits</v-btn>
              </div>
            </div>

          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex style="position: relative; top: 20px;">
        <div class="decision-flex-holder top-margin-12">
          <v-btn :disabled="!is_making_decision"
                 @click="nameAccept"
                 @shortkey="nameAccept"
                 class="mx-1 pa-0 action-button"
                 flat
                 id="decision-approve-button"
                 v-shortkey="['alt', 'a']">
            <img id="conditional-accept-button"
                 v-if="acceptance_will_be_conditional"
                 src="/static/images/buttons/cond-approve-name.png" />
            <img v-else src="/static/images/buttons/approve-name.png" />
          </v-btn>
          <v-btn :disabled="!is_making_decision"
                 @click="nameReject"
                 @shortkey="nameReject"
                 class="mx-1 pa-0 action-button"
                 flat
                 id="decision-reject-button"
                 v-shortkey="['alt', 'r']"><img src="/static/images/buttons/reject-name.png" /></v-btn>
        </div>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-dialog :width="800"
                persistent
                content-class="opacity-1"
                v-model="editMessageModalVisible">
        <v-container style="background-color: white">
          <v-layout>
            <v-flex textarea-outer-v-flex>
              <v-textarea class="fs-14 pa-0 ma-0"
                          flat
                          full-width
                          id="decision-msg-edit-field"
                          rows="14"
                          solo
                          style="margin-bottom: 0px;"
                          v-model="editTextarea" />
              <div :class="editTextareaProps.class">{{ editTextareaProps.count }}</div>
            </v-flex>
          </v-layout>
          <v-layout justify-start row mt-4 pl-3>
            <v-flex text-right c-link>
              <v-btn id="message-cancel-button"
                     flat
                     @click="hideModal">Cancel</v-btn>
              <v-btn id="message-save-button"
                     flat
                     :disabled="!messageEdited"
                     @click="saveModal">
                <b style="font-weight: 600">Save</b>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>
  </v-container>

</template>

<script>
/* eslint-disable */
  import Vue from 'vue'
  import { mapGetters } from 'vuex'

  export default {
    name: "Decision",
    data() {
      return {
        editTextarea: null,
        editMessageModalVisible: false,
        menuProps: {
          auto: false,
          closeOnContentClick: true,
          maxHeight: 125,
        },
        originalMessage: null,
      }
    },
    mounted() {
      this.$root.$on('addSelected', (data) => { this.addSelected(data) })
      this.acceptance_will_be_conditional = false
    },
    computed: {
      ...mapGetters([
        'acceptance_will_be_conditional',
        'autoAddDisabled',
        'cobrsPhoneticConflicts',
        'comparedConflicts',
        'conditionsJSON',
        'conflictsAutoAdd',
        'customerMessageOverride',
        'exactMatchesConflicts',
        'is_making_decision',
        'listDecisionReasons',
        'parseConditions',
        'phoneticConflicts',
        'selectedConditions',
        'selectedConflicts',
        'selectedReasons',
        'selectedTrademarks',
        'synonymMatchesConflicts',
        'trademarksJSON',
      ]),
      customer_message_override: {
        get() {
          return this.customerMessageOverride
        },
        set(msg) {
          this.$store.commit('setCustomerMessageOverride', msg)
        }
      },
      selected_trademarks: {
        get() {
          return this.selectedTrademarks
        },
        set(items) {
          this.$store.commit('setSelectedTrademarks', items)
        }
      },
      consent_required_by_user: {
        get() {
          return this.$store.state.consentRequiredByUser
        },
        set(value) {
          this.$store.commit('setConsentRequiredByUser', value)
        }
      },
      selected_conflicts: {
        get() {
          return this.selectedConflicts
        }, set(items) {
          this.$store.commit('setSelectedConflicts', items)
        }
      },
      selected_conditions: {
        get() {
          return this.selectedConditions
        },
        set(items) {
          this.$store.commit('setSelectedConditions', items)
        }
      },
      acceptance_will_be_conditional: {
        get() {
          return this.$store.getters.acceptance_will_be_conditional
        },
        set(event) {
          this.$store.commit('acceptance_will_be_conditional', event)
        }
      },
      conditions() {
        return this.$store.getters.parseConditions
      },
      conditionsInstructions() {
        if (this.conditions && Array.isArray(this.conditions)) {
          return this.conditions.filter(condition => condition.instructions)
        }
        return []
      },
      conditionsText() {
        if ( this.conditions && Array.isArray(this.conditions) ) {
          return this.conditions.filter(condition => condition.text)
        }
        return []
      },
      conflictList() {
        if (!this.conflictsAutoAdd) {
          return this.comparedConflicts
        }
        let output = []
        let listedNRs = []
        let conflictTypes = [
          'exactMatchesConflicts',
          'synonymMatchesConflicts',
          'cobrsPhoneticConflicts',
          'phoneticConflicts',
        ]

        for ( let type of conflictTypes ) {
          this[type].forEach(conflict => {
            if (!listedNRs.includes(conflict.nrNumber) ) {
              listedNRs.push(conflict.nrNumber)
              output.push(conflict)
            }
          })
        }
        return output
      },
      consent_required() {
        if (this.consent_required_by_condition) return true
        if (this.consent_required_by_user) return true
        return false
      },
      consent_required_by_condition() {
        if (this.selected_conditions && Array.isArray(this.selected_conditions)) {
          return this.selected_conditions.some(condition => condition.consent_required)
        }
        return false
      },
      currentNameObj: {
        get() {
          return this.$store.getters.currentNameObj
        },
        set(value) {
          this.$store.dispatch('currentNameObj', value)
        }
      },
      customer_message() {
        let retval = []
        // CONFLICTS
        if (!this.selected_conflicts || this.selected_conflicts.length === 0) {
        //if there are no conflicts but the user has selected Conditions Required.  Display that only.
          if (this.consent_required_by_user) {
            retval.push('Consent Required \n')
          }
        } else {
          for ( let i = 0; i < this.selected_conflicts.length; i++ ) {
            // check whether "Consent Required" condition is set - if so, set message re. "Requires consent from..."
            if ( this.consent_required_by_user ) {
              retval.push('Consent required from ' + this.selected_conflicts[i].text)
            }
            // if "Consent Required" condition is not set, set message re. "Rejected due..."
            else {
              retval.push('Rejected due to conflict with ' + this.selected_conflicts[i].text)
            }
          }
        }
        // CONDITIONS
        for ( let i = 0; i < this.selected_conditions.length; i++ ) {
          // if this is the "Consent Required" condition, and there are conflicts, do not set
          // "Consent Required" messgage, because it is redundant with messaging re. conflicts.
          if ( this.selected_conditions[i].phrase !== undefined && this.selected_conditions[i].phrase !== '' ) {
            retval.push(this.selected_conditions[i].phrase + ' - ' + this.selected_conditions[i].instructions)
          } else {
            retval.push(this.selected_conditions[i].instructions)
          }
        }
        // TRADEMARKS
        for ( let i = 0; i < this.selected_trademarks.length; i++ ) {
          retval.push(
            'Registered Trademark: ' + this.selected_trademarks[i].name + ' - Application #' + this.selected_trademarks[i].application_number)
        }
        // GENERIC DECISION REASONS
        for ( let i = 0; i < this.selected_reasons.length; i++ ) {
          retval.push(this.selected_reasons[i].reason)
        }
        return retval
      },
      customer_message_display() {
        if ( this.customer_message_override ) {
          return this.customer_message_override
        } else {
          // otherwise build out formatted text with line breaks...
          let retval = ''

          for ( let i = 0; i < this.customer_message.length; i++ ) {
            retval += this.customer_message[i] + '\n\n'
          }
          return retval
        }
      },
      decision_made: {
        get() {
          return this.$store.getters.decision_made
        },
        set(value) {
          this.$store.commit('decision_made', value)
        }
      },
      editTextareaProps() {
        let remaining = this.editTextarea ? this.editTextarea.length : 0
        let output = {
          count: `Characters Remaining: ${ 955 - remaining }`,
          class: 'c-grey fs-14 pl-2'
        }
        if ( (955 - remaining) < 0 ) {
          output.count = 'Message cut off at 955 characters'
          output.class = 'c-priority fs-14 fw-600 pl-2'
        }
        return output
      },
      is_making_decision: {
        get() {
          return this.$store.getters.is_making_decision
        },
        set(value) {
          this.$store.commit('is_making_decision', value)
        }
      },
      selected_reasons: {
        get() {
          return this.selectedReasons
        },
        set(reasons) {
          this.$store.commit('setSelectedReasons', reasons)
        }
      },
      messageDisplayProps() {
        let output = {
          count: `Characters Remaining: ${ 955 - this.customer_message_display.length }`,
          class: 'c-grey pa-1 ma-1'
        }
        if ( (955 - this.customer_message_display.length) < 0 ) {
          output.count = 'Message cut off at 955 characters'
          output.class = 'c-priority fs-14 fw-600 pa-0 ma-0'
        }
        return output
      },
      messageEdited() {
        return this.editTextarea !== this.customer_message_display
      },
      nr_status() {
        return this.$store.getters.nr_status
      },
      trademarks() {
        if ( this.trademarksJSON ) {
          return this.trademarksJSON.names
        }
      },
    },
    watch: {
      consent_required(newVal) {
        this.acceptance_will_be_conditional = newVal
      },
      nr_status(newVal, oldVal) {
        if (newVal === 'DRAFT' && oldVal === 'INPROGRESS') {
          this.is_making_decision = false
        }
      }
    },
    methods: {
      focusInput(ref) {
        this.fieldSearch = ''
        let el = this.$refs[ref]
        el.focus()
      },
      addSelected({type, item}) {
        //unique identifiers are conflicts: 'nr_number', conditions, reasons: 'id' and trademarks: 'application_number'
        //setting 'field' variable to whichever applies
        let field = 'id'
        if (type === 'selected_trademarks') field = 'application_number'
        if (type === 'selected_conflicts') field = 'nr_number'
        if (this[type].length > 3) return
            //if the Selected(listType) array has 3 items, don't add another
            //check the identified unique field's value against the currently held values for duplicates and
            //it if its already on the list, remove it instead of adding it again
        let selectedCopy = [...this[type]]
        let index = this[type].findIndex(currentItem => currentItem[field] == item[field])
        if (index >= 0) {
          selectedCopy.splice(index, 1)
        } else {
          selectedCopy.push(item)
        }
        //if not already on list, then copy the selected(listType) so as not mutate the array in the component data to
        //maintain reactivity in Vue
        this[type] = selectedCopy
      },
      cancelEvent(event) {
        event.preventDefault()
        event.stopPropagation()
        return null
      },
      conditionsLabel(obj) {
        if ( obj.display_string !== undefined ) {
          return obj.display_string
        } else {
          return obj.phrase + ' - ' + obj.instructions
        }
      },
      hideModal() {
        this.editMessageModalVisible = false
      },
      nameAccept() {
        this.$store.commit('decision_made', 'APPROVED')
        this.$nextTick(function() { this.nameAcceptReject() })
      },
      nameAcceptReject() {
        let { decision_made, currentNameObj, selected_conflicts } = this
        if ( decision_made === 'APPROVED' ) {
          // if there were conflicts selected but this is an approval, this will result in
          // accidental "rejected due to conflict" messaging. Remove it by clearing the selected
          // conflicts (Issue #767).
          // Do NOT clear the conflicts if the "Consent Required" condition is also set - then it's
          // intentional.
          if (this.acceptance_will_be_conditional) {
            currentNameObj.state = 'CONDITION'
          } else {
            currentNameObj.state = 'APPROVED'
            this.selected_conflicts = []
          }
        } else {
          currentNameObj.state = 'REJECTED'
        }
        if (selected_conflicts && selected_conflicts.length > 0) {
          //populate the currentNameObj[1, 2 and 3] with selected_conflicts[0, 1, and 2]
          //as well as currentNameObj[1, 2, and 3]_num with selected_conflicts[0, 1 and 2].nrNumber
          for ( let n of [0, 1, 2] ) {
            if ( !selected_conflicts[n]  ) break
            currentNameObj[`conflict${ n + 1 }`] = selected_conflicts[n].text
            currentNameObj[`conflict${ n + 1 }_num`] = selected_conflicts[n].nrNumber
          }
        }
        currentNameObj.name = currentNameObj.name.trimEnd()
        currentNameObj.decision_text = this.customer_message_display.substr(0, 955)
        // send decision to API and reset flags
        this.$store.dispatch('nameAcceptReject')
        this.decision_made = null
      },
      nameReject() {
        this.$store.commit('decision_made', 'REJECTED')
        this.$nextTick(function () { this.nameAcceptReject() })
      },
      removeChip(type, index, nrNumber) {
        //use spread syntax to create a new array from the existing selected(Trademarks, Conditions, Reasons, Conflicts)
      //so as not to simply create a reference to the existing selected(listType) data.
        let selectedCopy = [ ...this[type] ]
        selectedCopy.splice(index, 1)
      //and then assign this new value to replace the selected(listType) in the component data.  Do this as opposed
      //to splicing the list in data directly because Vue will not react to such a change in a guaranteed immediate way
        this[type] = selectedCopy

        if (nrNumber) {
          this.$store.dispatch('removeComparedNR', nrNumber)
        }
      },
      saveModal(obj) {
        if ( this.editTextarea !== this.customer_message_display ) {
          this.customer_message_override = this.editTextarea.valueOf()
        }
        this.hideModal()
      },
      showModal() {
        Vue.set(this, 'editTextarea', this.customer_message_display)
        this.editMessageModalVisible = true
      },
      trademarksLabel(obj) {
        return obj.name + ' - ' + obj.application_number
      },
      truncateChipText(text) {
        return text.length > 34 ? `${text.slice(0,34)}...` : text
      },
    },
  }
</script>

<style scoped>
  #decision-msg-clear-button {
    color: var(--link);
    font-size: 14px;
    font-weight: 700;
  }

  #message-cancel-button {
    margin: 0px;
    padding: 0px;
    color: var(--link);
  }

  #message-save-button {
    margin: 0px 0px 0px -20px;
    padding: 0px;
    color: var(--link);
  }

  .chip-class {
    background-color: var(--blue);
    height: 28px !important;
    padding: 0 !important;
    margin: 5px 5px 0 0;
    border-radius: 6px;
    color: white;
    text-transform: uppercase;
    font-size: 13px;
  }

  .chip-close-icon {
    color: white;
    cursor: pointer;
    font-size: 18px;
    margin: 0 0 0 7px;
    padding: 0;
  }

  .decision-container {
    background-color: var(--xl-grey);
    min-height: 550px;
  }

  .decision-flex-holder {
    display: flex;
    justify-content: space-between;
  }

  .decision-select-style {
    padding: 5px 5px 0 5px !important;
    border: 1px solid var(--l-grey);
    background-color: white;
    margin-right: 10px;
    position: relative;
    top: 10px;
  }

  .notification-banner {
    background-color: var(--l-blue);
    width: 100%;
    min-height: 45px;
    margin: 0;
    padding: 6px;
    border: 1px solid var(--grey);
    box-shadow: 0px 4px 6px -4px var(--grey);
  }

  .opacity-1 {
    opacity: 1 !important;
  }

  .opacity-30 {
    opacity: .3 !important;
  }

  .textarea-outer-v-flex {
    border: 1px solid var(--l-grey);
    height: 350px;
    background-color: white;

  }

  .top-margin-12 {
    margin-top: 12px;
  }
</style>
