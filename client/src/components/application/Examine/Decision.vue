<!--eslint-disable-->
<template>
  <v-container decision-container fluid py-0 px-5>
    <v-layout wrap>
      <v-flex lg6 fs-24 style="position: relative; top: 10px">Decision</v-flex>
      <v-flex grow />
      <v-flex shrink style="position: relative; top: 14px">
        <v-checkbox class="pa-0 ma-0"
                    light
                    v-model="consent_required_by_user" /></v-flex>
      <v-flex shrink fs-15 style="position: relative; top: 14px">Consent Required
      </v-flex>
      <v-flex lg12>
        <v-divider />
      </v-flex>
      <template v-if="conditionsText && conditionsText.length > 0">
        <v-flex notification-banner d-flex mb-1>
          <v-layout my-auto wrap>
            <v-flex lg12
                    px-3
                    v-for="(cond, i) of conditionsText"
                    :mt-1="i > 0"
                    :key="i+'cond'">
              <b>{{ cond.phrase[0] + cond.phrase.substr(1).toLowerCase() }} – </b>{{ cond.text }}
            </v-flex>
          </v-layout>
        </v-flex>
      </template>

      <!--COLUMN #1: MESSAGE SELECTION-->
      <v-flex lg6>
        <v-layout wrap add-stock-text-col>

          <!--CONDITIONS-->
          <v-flex lg12 id="conditions-select-area">
            <p class="fs-15 fw-600">Conditions</p>
            <div id="conditions-decision-select-field">
              <v-select :disabled="customer_message_override !== null"
                        :height="selectedConditions.length <= 1 ? 30 : null"
                        :items="conditionsInstructions"
                        :menu-props="menuProps"
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
                        v-model="selectedConditions">
                <template v-slot:selection="{ item, index }">
                  <v-chip class="chip-class">{{ truncateChipText(item.phrase) }}
                    <v-icon class="chip-close-icon"
                            @click.stop="handleConditions(item)">clear
                    </v-icon>
                  </v-chip>
                </template>
              </v-select>
            </div>
          </v-flex>

          <!--CONFLICTS-->
          <v-flex lg12 id="conflicts-select-area">
            <p class="fs-15 fw-600">Conflicts</p>
            <div id="conflicts-decision-select-field">
              <v-select :disabled="customer_message_override !== null"
                        :height="selectedConflicts.length <= 1 ? 30 : null"
                        :items="conflictList"
                        :menu-props="menuProps"
                        chips
                        class="decision-select-style"
                        dense
                        attach
                        hide-selected
                        multiple
                        return-object
                        single-line
                        small-chips
                        v-model="selectedConflicts">
                <template v-slot:selection="{ item, index }">
                  <v-chip class="chip-class">{{ truncateChipText(item.text) }}
                    <v-icon class="chip-close-icon"
                            @click.stop="removeChip(item)">clear
                    </v-icon>
                  </v-chip>
                </template>
              </v-select>
            </div>
          </v-flex>

          <!--MARCROS-->
          <v-flex lg12 data-app id="macros-v-flex" ref="macrosField">
            <p class="fs-15 fw-600">Macros</p>
            <div id="macros-decision-select-field">
              <v-select :disabled="customer_message_override !== null"
                        :height="selectedReasons.length <= 1 ? 30 : null"
                        :items="listDecisionReasons"
                        :menu-props="menuProps"
                        chips
                        attach
                        class="decision-select-style"
                        dense
                        hide-selected
                        item-text="name"
                        multiple
                        return-object
                        small-chips
                        v-model="selectedReasons">
                <template v-slot:selection="{ item, index }">
                  <v-chip class="chip-class">{{ truncateChipText(item.name) }}
                    <v-icon class="chip-close-icon"
                            @click.stop="removeChip(item)">clear
                    </v-icon>
                  </v-chip>
                </template>
              </v-select>
            </div>
          </v-flex>

          <!--TRADEMARKS-->
          <v-flex data-app id="trademarks-v-flex" ref="trademarksSelectField">
            <p class="fs-15 fw-600">Trademarks</p>
            <div id="trademarks-decision-select-field">
              <v-select :disabled="customer_message_override !== null"
                        :height="selectedTrademarks.length <= 1 ? 30 : null"
                        :items="trademarks"
                        :menu-props="menuProps"
                        chips
                        class="decision-select-style mb-5"
                        dense
                        attach
                        hide-selected
                        item-text="name"
                        multiple
                        return-object
                        small-chips
                        v-model="selectedTrademarks">
                <template v-slot:selection="{ item }">
                  <v-chip class="chip-class">{{ truncateChipText(item.name) }}
                    <v-icon class="chip-close-icon"
                            @click.stop="handleTrademarks(item)">clear
                    </v-icon>
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
              <div class="fs-15 fw-600 ma-0 pa-0" style="position:relative; top:12px">Message To Requestor</div>
                <v-btn flat
                       @click="showModal"
                       class="ma-0 pa-0">
                  <img src="/static/images/buttons/edit-button-icon.png">
                </v-btn>
            </div></v-flex>
          <v-flex textarea-outer-v-flex pa-2 pt-3 mt-2>
            <v-textarea class="fs-14 pa-0 ma-0"
                        full-width
                        id="decision-msg-preview-area"
                        rows="13"
                        solo
                        v-on:keydown.prevent
                        flat
                        v-model="customer_message_display">

            </v-textarea>
            <div class="decision-flex-holder">
              <div :class="messageDisplayProps.class">{{ messageDisplayProps.count }}</div>
              <div><v-btn flat
                          id="decision-msg-clear-button"
                          class="ma-0 pa-0"
                          @click="customer_message_override = null"
                          v-if="customer_message_override">Clear Edits</v-btn></div>
            </div>

          </v-flex>
          <v-flex>
            <div class="decision-flex-holder top-margin-12">
              <v-btn flat
                     class="mx-1 pa-0 action-button"
                     v-shortkey="['alt', 'a']"
                     @shortkey="nameAccept"
                     id="decision-approve-button"
                     @click="nameAccept">
                <img id="conditional-accept-button"
                     v-if="acceptance_will_be_conditional"
                      src="/static/images/buttons/cond-approve-name.png" />
                <img v-else src="/static/images/buttons/approve-name.png" />
              </v-btn>
              <v-btn flat
                     v-shortkey="['alt', 'r']"
                     @shortkey="nameReject"
                     class="mx-1 pa-0 action-button"
                     id="decision-reject-button"
                     @click="nameReject"><img src="/static/images/buttons/reject-name.png" /></v-btn>
            </div>
          </v-flex>
        </v-layout>
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
        consent_required_by_user: false,
        customer_message_override: null,
        editMessageModalVisible: false,
        editTextarea: null,
        menuProps: {
          auto: false,
          closeOnContentClick: true,
          maxHeight: 125,
          overflowY: false,
          position: 'relative',
        },
        originalMessage: null,
        selectedConditions: [],
        selectedConflicts: [],
        selectedReasons: [],
        selectedTrademarks: [],
      }
    },
    mounted() {
      this.acceptance_will_be_conditional = false
      this.$nextTick(function() {
        if (this.currentCondition) {
          this.selectedConditions = [this.currentCondition]
        }
        if (this.currentTrademark) {
          this.selectedTrademarks = [this.currentTrademark]
        }
        if (this.currentConflict) {
          this.selectedConflicts = [this.currentConflict]
        }
        if (this.consent_required_by_condition || this.consent_required_by_user) {
          this.acceptance_will_be_conditional = true
        }
      })
    },
    computed: {
      ...mapGetters([
        'acceptance_will_be_conditional',
        'cobrsPhoneticConflicts',
        'conditionsJSON',
        'currentConflict',
        'currentTrademark',
        'exactMatchesConflicts',
        'is_making_decision',
        'listDecisionReasons',
        'phoneticConflicts',
        'synonymMatchesConflicts',
        'trademarksJSON',
        'parseConditions'
      ]),
      acceptance_will_be_conditional: {
        get() {
          return this.$store.getters.acceptance_will_be_conditional
        }, set(event) {
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
        let output = []
        let listedNRs = []
        let conflictTypes = [
          'exactMatchesConflicts',
          'synonymMatchesConflicts',
          'cobrsPhoneticConflicts',
          'phoneticConflicts',
        ]

        for ( let type of conflictTypes ) {
          if ( !this[type] || !Array.isArray(this[type]) ) {
            break
          }
          this[type].forEach(conflict => {
            if ( conflict.nrNumber && !listedNRs.includes(conflict.nrNumber) ) {
              listedNRs.push(conflict.nrNumber)
              output.push(conflict)
            }
          })
        }
        return output
      },
      consent_required() {
        if (!this.consent_required_by_condition && !this.consent_required_by_user) return false
        return true
      },
      consent_required_by_condition() {
        if (this.selectedConditions && Array.isArray(this.selectedConditions)) {
          return this.selectedConditions.some(condition => condition.consent_required_tf)
        }
        return false
      },
      currentCondition() {
        let { currentCondition } = this.$store.getters
        if (!currentCondition || !currentCondition.consent_required_tf) return ''
        return currentCondition
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
        if (!this.selectedConflicts || this.selectedConflicts.length === 0) {
          if (this.consent_required_by_user) {
            retval.push('Consent Required \n\n')
          }
        } else {
          for ( let i = 0; i < this.selectedConflicts.length; i++ ) {
            // check whether "Consent Required" condition is set - if so, set message re. "Requires consent from..."
            if ( this.consent_required_by_user ) {
              retval.push('Consent required from ' + this.selectedConflicts[i].text)
            }
            // if "Consent Required" condition is not set, set message re. "Rejected due..."
            else {
              retval.push('Rejected due to conflict with ' + this.selectedConflicts[i].text)
            }
          }
        }

        // CONDITIONS
        for ( let i = 0; i < this.selectedConditions.length; i++ ) {

          // if this is the "Consent Required" condition, and there are conflicts, do not set
          // "Consent Required" messgage, because it is redundant with messaging re. conflicts.

          if ( this.selectedConditions[i].phrase !== undefined && this.selectedConditions[i].phrase !== '' ) {
            retval.push(this.selectedConditions[i].phrase + ' - ' + this.selectedConditions[i].instructions)
          } else {
            retval.push(this.selectedConditions[i].instructions)
          }
        }

        // TRADEMARKS
        for ( let i = 0; i < this.selectedTrademarks.length; i++ ) {
          retval.push(
            'Registered Trademark: ' + this.selectedTrademarks[i].name + ' - Application #' + this.selectedTrademarks[i].application_number)
        }

        // GENERIC DECISION REASONS
        for ( let i = 0; i < this.selectedReasons.length; i++ ) {
          retval.push(this.selectedReasons[i].reason)
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
      trademarks() {
        if ( this.trademarksJSON ) {
          return this.trademarksJSON.names
        }
      },
    },
    watch: {
      decision_made() {
        this.nameAcceptReject()
      },
      consent_required(newVal, oldVal) {
        this.$store.commit('acceptance_will_be_conditional', newVal)
      },
      consent_required_by_user(newVal) {
        if (newVal) {

        }
      }
    },
    methods: {
      cancelEvent(event) {
        event.preventDefault()
        event.stopPropagation()
        return null
      },
      clearCustomerMessagOverride() {
        this.customer_message_override = null
      },
      conditionsLabel(obj) {
        if ( obj.display_string !== undefined ) {
          return obj.display_string
        } else {
          return obj.phrase + ' - ' + obj.instructions
        }
      },
      handleConditions(item) {
        this.removeChip(item)
        if (this.currentCondition) {
          if (item.id == this.currentCondition.id) {
            this.$store.commit('currentCondition', null)
          }
        }
      },
      handleTrademarks(item) {
        this.removeChip(item)
        if (this.currentTrademark) {
          if (item.application_number == this.currentTrademark.application_number) {
            this.$store.commit('currentTrademark', null)
          }
        }
      },
      hideModal() {
        this.editMessageModalVisible = false
      },
      nameAccept() {
        this.$store.commit('decision_made', 'APPROVED')
        this.$store.commit('currentCondition', null)
      },
      nameAcceptReject() {
        let { decision_made, currentNameObj, selectedConflicts } = this
        if ( decision_made == 'APPROVED' ) {
          // if there were conflicts selected but this is an approval, this will result in
          // accidental "rejected due to conflict" messaging. Remove it by clearing the selected
          // conflicts (Issue #767).
          // Do NOT clear the conflicts if the "Consent Required" condition is also set - then it's
          // intentional.
          if (this.acceptance_will_be_conditional) {
            currentNameObj.state = 'CONDITION'
          } else {
            currentNameObj.state = 'APPROVED'
            this.selectedConflicts = []
          }
        } else {
          currentNameObj.state = 'REJECTED'
        }
        if (selectedConflicts && selectedConflicts.length > 0) {
          //populate the currentNameObj[1, 2 and 3] with selectedConflicts[0, 1, and 2]
          //as well as currentNameObj[1, 2, and 3]_num with selectedConflicts[0, 1 and 2].nrNumber
          for ( let n of [0, 1, 2] ) {
            if ( !selectedConflicts[n]  ) break
            currentNameObj[`conflict${ n + 1 }`] = selectedConflicts[n].text
            currentNameObj[`conflict${ n + 1 }_num`] = selectedConflicts[n].nrNumber
          }
        }
        currentNameObj.name = currentNameObj.name.trimEnd()
        currentNameObj.decision_text = this.customer_message_display.substr(0, 955)
        // send decision to API and reset flags
        this.$store.dispatch('nameAcceptReject')
        this.decision_made = null
        this.is_making_decision = false
      },
      nameReject() {
        this.$store.commit('decision_made', 'REJECTED')
        this.$store.commit('currentCondition', null)
      },
      removeChip(item) {
        let index
        let type
        let keys = Object.keys(item)
        let selectionTypes = [
          'selectedConditions',
          'selectedConflicts',
          'selectedReasons',
          'selectedTrademarks',
        ]
        //to make this generic, since the item types (conflict, condition, reason or trademark) all have
        //differently-named uniquely-identifying fields, we check an item to be removed against each item in each
        //selection list.
        for (let selectType of selectionTypes) {
          if (this[selectType] && this[selectType].length > 0) {
            let i = this[selectType].findIndex(set =>
              keys.every(key => item[key] == set[key])
            )
        //breaking from the loop when a positive index is found
            if (i >= 0) {
              index = i
              type = selectType
              break
            }
          }
        }
        //and splicing / setting the new array of items reactively with Vue.set
        let editList = Object.assign([], this[type])
        editList.splice(index, 1)
        Vue.set(this, type, editList)
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
        return text.length > 32 ? text.substr(0, 32) + '...' : text
      },
    },
  }
</script>

<style scoped>
  p {
    margin-top: 12px;
    margin-bottom: 0px !important;
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
    font-size: 15px;
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
    margin: 12px 15px 0 0;
  }

  .fs-24 {
    font-size: 24px;
    font-weight: 600;
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

  .textarea-outer-v-flex {
    border: 1px solid var(--l-grey);
    height: 320px;
    background-color: white;

  }

  .top-margin-12 {
    margin-top: 12px;
  }
</style>
