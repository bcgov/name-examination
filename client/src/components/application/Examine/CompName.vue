<!--eslint-disable-->
<template>
  <v-layout wrap ref="CompName">

    <!--NAME CHOICES LIST-->
    <v-flex lg6 bg-white py-2>
      <v-container fs-18 ma-0 pa-0 ml-3>
        <v-layout align-start
                  wrap
                  :class="getNameChoiceClasses(1)">
          <v-flex shrink mr-2>1.</v-flex>
          <v-flex grow id="name1" ma-0 pa-0>
            {{ compName1.name }}
            <CompNameIcon :state="compName1.state" />
            <v-btn flat
                   style="margin: -7px 0 0 0; padding: 0; color: var(--link);"
                   v-if="is_undoable_1"
                   @click="undoDecision(1)">Undo Decision</v-btn>
          </v-flex>
            <v-flex lg12 class="decision-text ml-4">{{ decision_1 }}</v-flex>
        </v-layout>
        <v-layout align-start
                  :class="getNameChoiceClasses(2)"
                  wrap>
          <v-flex shrink mr-2>2.</v-flex>
          <v-flex grow id="name2" ma-0 pa-0>
            {{ compName2.name }}
            <CompNameIcon :state="compName2.state" />
            <v-btn flat
                   style="margin: -7px 0 0 0; padding: 0; color: var(--link);"
                   v-if="is_undoable_2"
                   @click="undoDecision(2)">Undo Decision</v-btn>
          </v-flex>
          <v-flex lg12 class="decision-text ml-4">{{ decision_2 }}</v-flex>
        </v-layout>
        <v-layout align-start
                  wrap
                  :class="getNameChoiceClasses(3)">
          <v-flex shrink mr-2>3.</v-flex>
          <v-flex grow id="name3" ma-0 pa-0>
            {{ compName3.name }}
            <CompNameIcon :state="compName3.state" />
            <v-btn flat
                   style="margin: -7px 0 0 0; padding: 0; color: var(--link);"
                   v-if="is_undoable_3"
                   @click="undoDecision(3)">Undo Decision</v-btn>
          </v-flex>
            <v-flex lg12 class="decision-text ml-4">{{ decision_3 }}</v-flex>
        </v-layout>
      </v-container>
    </v-flex>

    <!--QUICK APPROVE/REJECT BUTTONS-->
    <v-flex lg6 bg-white py-2>
      <v-layout v-if="showQuickButtons" justify-end>
        <v-flex shrink text-right>
          <v-btn flat
                 v-shortkey="['alt', 'a']"
                 @shortkey="quickApprove()"
                 id="examine-quick-approve-button"
                 @click="quickApprove">
            <img src="/static/images/buttons/quick-approve.png" /></v-btn>
        </v-flex>
        <v-flex shrink>
          <v-btn flat
                 v-shortkey="['alt', 'i']"
                 @shortkey="rejectDistinctive()"
                 id="examine-reject-distinctive-button"
                 @click="rejectDistinctive">
            <img src="/static/images/buttons/reject-dist.png" /></v-btn>
        </v-flex>
        <v-flex shrink>
          <v-btn flat
                 v-shortkey="['alt', 'e']"
                 @shortkey="rejectDescriptive()"
                 id="examine-reject-descriptive-button"
                 @click="rejectDescriptive">
            <img src="/static/images/buttons/reject-desc.png" /></v-btn>
        </v-flex>
      </v-layout>
    </v-flex>

    <!--EXAMINATION AREA:  RECIPE CARDS DECISION INFO-->
    <template v-if="!is_complete">

      <!--LEFT COLUMN:  CONFLICTS/CONDITIONS/HISTORY/TRADEMARKS LISTS-->
      <v-flex lg6 py-4 pl-5 bg-grey style="z-index: 2">
        <v-layout>

          <v-flex lg8 mr-3>
            <v-form @submit.prevent="onSubmit" id="regular-search-form">
              <div style="display: flex;" class="examine-search-div" >
                <v-text-field @click:append.prevent="resetSearchStr"
                              @shortkey="setFocus"
                              @focus="$root.$emit('setconflictfocus', 'regular')"
                              :append-icon="searchStr !== currentName ? 'clear' : ''"
                              autocomplete="off"
                              class="examine-search"
                              ref="regularsearchfield"
                              id="regular-search-field"
                              v-model="searchStr"
                              v-shortkey="['alt', 's']"/>
                <div class="search-icon mt-auto mb-auto">
                  <v-btn flat
                         icon
                         id="regular-search-button"
                         color="white"
                         class="m-1"
                         @click="onSubmit">
                    <v-icon id="regular-search-icon">search</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-form>
          </v-flex>

          <!--EXACT MATCH SEARCH FIELD-->
          <v-flex lg4>
            <v-form @submit.prevent="onSubmit" id="exact-search-form">
              <div style="display: flex;" class="examine-search-div">
                <div style="width: 100%" >
                  <v-text-field @click:append="resetExactSearchStr"
                                :append-icon="exactPhrase ? 'clear' : ''"
                                autocomplete="off"
                                @focus="$root.$emit('setconflictfocus', 'exact')"
                                class="examine-search"
                                placeholder="exact phrase"
                                ref="exactsearchfield"
                                id="exact-search-field"
                                name="exact-search"
                                v-model="exactPhrase" />
                </div>
                <div class="search-icon mt-auto mb-auto">
                  <v-btn flat
                         icon
                         id="exact-search-button"
                         color="white"
                         class="m-1"
                         @click="onSubmit('exact-search')">
                    <v-icon id="exact-search-icon">search</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-form>
          </v-flex>

        </v-layout>
        <v-layout mt-3 wrap>
          <v-flex ma-0 pa-0>
            <RecipeArea id="name-examination" />
          </v-flex>
        </v-layout>
      </v-flex>

      <!--RIGHT TWO COLUMNS: EXAMINATION AREA INFO-->
      <v-flex lg6 py-4 bg-grey>
        <Decision v-if="is_making_decision" />
      </v-flex>
    </template>
  </v-layout>
</template>

<script>
/* eslint-disable */
  import Decision from '@/components/application/Examine/Decision'
  import RecipeArea from '@/components/application/Examine/Recipe/RecipeArea'
  import CompNameIcon from './CompNameIcon'

  export default {
    name: 'CompName',
    components: { Decision, RecipeArea, CompNameIcon },
    data() {
      return {
        searchTimeout: null,
        add_comment_display: "",
        cancel_comment_display: "",
        exactPhrase: '',
        is_running_manual_search: false,
        retval: [],
        searching: false,
        searchStr: '',
      }
    },
    mounted() {
      if (this.$store.getters.nrNumber == null) {
        this.$store.dispatch('getpostgrescompNo')
      }
      // set manual search string based on current name - fixes bug related to leaving
      // and coming back to same NR
      this.searching = true
      this.setManualSearchStr(this.currentName)
      this.exactPhrase = ''
      this.$root.$on('setcompnamefocus', this.setOrBlurFocus)
    },
    computed: {
      canCancel() {
        return this.userCanEdit
      },
      compName1() {
        return this.$store.getters.compName1
      },
      compName1State() {
        return this.$store.getters.compName1.state
      },
      compName2() {
        return this.$store.getters.compName2
      },
      compName2State() {
        return this.$store.getters.compName2.state
      },
      compName3() {
        return this.$store.getters.compName3
      },
      compName3State() {
        return this.$store.getters.compName3.state
      },
      currentChoice: {
        get() {
          return this.$store.getters.currentChoice
        },
        set(value) {
          this.$store.commit('currentChoice', value)
        }
      },
      currentName() {
        return this.$store.getters.currentName
      },
      currentNameObj: {
        get() {
          return this.$store.getters.currentNameObj
        },
        set(value) {
          this.$store.commit('currentNameObj', value)
        }
      },
      currentRecipeCard() {
        return this.$store.getters.currentRecipeCard
      },
      currentState() {
        return this.$store.getters.currentState
      },
      decision_1() {
        return this.decisionReasonOrConflictList(this.compName1)
      },
      decision_2() {
        return this.decisionReasonOrConflictList(this.compName2)
      },
      decision_3() {
        return this.decisionReasonOrConflictList(this.compName3)
      },
      decision_made: {
        get() {
          return this.$store.getters.decision_made
        },
        set(value) {
          this.$store.commit('decision_made', value)
        }
      },
      is_complete() {
        return this.$store.getters.is_complete
      },
      is_editing() {
        return  this.$store.getters.is_editing
      },
      is_making_decision: {
        get() {
          return this.$store.getters.is_making_decision
        },
        set(value) {
          this.$store.commit('is_making_decision', value)
        }
      },
      is_my_current_nr() {
        return this.$store.getters.is_my_current_nr
      },
      is_name_decision_made() {
        // is a decision already made for the current name? Happens right after reset/re-open.
        if (this.currentNameObj.state !== 'NE') return true
        else return false
      },
      is_undoable_1() {
        // first test generic reasons why a name would or wouldn't be undoable
        let undoable = this.is_undoable(this.compName1)

        if (undoable) {
          // if name choices 2 and 3 have not been decided, then 1 is undoable
          if ((this.compName2.state == 'NE' || this.compName2.state == null) &&
            (this.compName3.state == 'NE' || this.compName3.state == null)) {
            undoable = true
          }
          else undoable = false
        }

        return undoable
      },
      is_undoable_2() {
        // first test generic reasons why a name would or wouldn't be undoable
        let undoable = this.is_undoable(this.compName2)

        if (undoable) {
          // if name choice 3 has not been decided, then 2 is undoable
          if (this.compName3.state == 'NE' || this.compName3.state == null ) {
            undoable = true
          }
          else undoable = false
        }

        return undoable
      },
      is_undoable_3() {
        // first test generic reasons why a name would or wouldn't be undoable
        let undoable = this.is_undoable(this.compName3)

        return undoable
      },
      is_viewing() {
        return this.$store.state.is_header_shown
      },
      listDecisionReasons() {
        return this.$store.getters.listDecisionReasons
      },
      showQuickButtons() {
        return !this.is_complete && this.is_making_decision && this.userIsAnExaminer && this.is_my_current_nr
      },
      userCanEdit() {
        return this.$store.getters.userHasEditRole
      },
      userIsAnExaminer() {
        return this.$store.getters.userHasApproverRole
      },
    },
    watch: {
      cancel_comment_display(val) {
        if (val)
          $("#cancel-nr-after-comment-button").prop('disabled', false);
        else
          $("#cancel-nr-after-comment-button").prop('disabled', true);
      },
      currentName(val) {
        this.searching = true
        this.setManualSearchStr(val)
        this.exactPhrase = ''
      },
      nrNumber(val) {
        if (val != null) { this.runManualRecipe()}
      },
      searchStr(val) {
        if (this.searching) {
          this.runManualRecipe()
          this.searching = false
        }
      }
    },
    methods: {
      decisionReasonOrConflictList(compname) {
        /* method gets the decision reason(s) whether or not there's anything in the decision text field.  In some
         older NRs, there is no decision reason text.  In these cases we want to display the listof conflicts instead */
        if (!compname) {
          return
        }
        if (this.is_complete) {
          if (compname.decision_text) {
            return compname.decision_text
          } else {
            return this.getConflictList(compname)
          }
        } else {
          return compname.decision_text
        }
      },
      getConflictList(compname) {
        if (!compname.conflict1) return

        let reasons = `Rejected due to conflicts:\n${compname.conflict1}`
        if (compname.conflict2) {
          reasons += ", " + compname.conflict2
        }
        if (compname.conflict3) {
          reasons += ", " + compname.conflict3
        }
        return reasons
      },
      getNameChoiceClasses(num) {
        let classes = ['name-option']
        if (this.currentChoice == num) { classes.push('active-name-option') }
        if (this[`compName${num}`].state === 'APPROVED' || this[`compName${ num }`].state === 'CONDITION') {
          classes.push('accepted')
        }
        return classes
      },
      is_undoable(name) {
        // if the NR is closed in any way, a name is not undoable - the NR will have to be
        // re-opened first.
        if (!this.userIsAnExaminer) return false

        if (!this.is_my_current_nr) return false

        // if the NR is furnished, nothing is undoable
        if (this.$store.state.furnished === 'Y')  return false

        // if this name is complete (ie: anything other than NE) it's undoable
        if (name.state == 'NE' || name.state == null) return false

        return true
      },
      nameAcceptReject() {
        if (this.decision_made === 'APPROVED') {
          this.currentNameObj.state = 'APPROVED'
        }
        else {
          this.currentNameObj.state = 'REJECTED'
        }
        // send decision to API and reset flags
        this.$store.dispatch('nameAcceptReject')
        this.decision_made = null
      },
      onSubmit(event) {
        if (event.target.id && event.target.id.includes('exact-search')) {
          if (this.exactPhrase) {
            this.runManualRecipe()
            this.is_running_manual_search = true
            return
          } else if (!this.exactPhrase) {
            event.preventDefualt()
            event.stopImmediatePropagation()
            return
          }
        }
        if (this.searchStr != this.currentName) {
          this.is_running_manual_search = true
        }
        this.runManualRecipe()
      },
      quickApprove() {
        this.$store.commit('selectedConflicts', [])
        this.decision_made = 'APPROVED'
        this.nameAcceptReject()
      },
      rejectDescriptive() {
        this.currentNameObj.decision_text = 'Require descriptive second word or phrase * E.G. ' +
          'Construction, Gardening, Investments, Holdings, Etc.'
        this.decision_made = 'REJECTED'
        this.nameAcceptReject()
      },
      rejectDistinctive() {
        // When this was written, the 16th index of listDecisionReasons was the string needed for a distinctive term missing
        // it was decided to HARD CODE this value until another solution is found
        // var distinctiveStr = this.listDecisionReasons[16].reason
        this.currentNameObj.decision_text = "Require distinctive, nondescriptive first word or " +
          "prefix * E.G. Person's name, initials, geographic location, etc."
        this.decision_made = 'REJECTED'
        this.nameAcceptReject()
      },
      resetSearchStr() {
        if (!this.is_running_manual_search) {
          this.setManualSearchStr(this.currentName)
          return
        }
        this.searching = true
        this.setManualSearchStr(this.currentName)
        this.exactPhrase = ''
      },
      resetExactSearchStr() {
        this.exactPhrase = ''
        if (this.is_running_manual_search) {
          this.runManualRecipe()
        }
      },
      runManualRecipe() {
        $('.conflict-container-spinner').removeClass('hidden')
        this.$store.dispatch('resetExaminationArea').then(() => {
          this.$store.dispatch('runManualRecipe', { searchStr: this.searchStr, exactPhrase: this.exactPhrase })
        })
      },
      setOrBlurFocus({ref, type}) {
        if (this.$refs[ref]) {
          if (type === 'blur') {
            this.$refs[ref].blur()
            return
          }
          this.$refs[ref].focus()
        }
      },
      setFocus() {
        this.$refs.regularsearchfield.focus()
        this.$root.$emit('setconflictfocus', 'regular')
      },
      setManualSearchStr(val) {
        this.searchStr =  val;
      },
      undoDecision(name_number) {
        this.$store.dispatch('undoDecision', name_number);

        // set the undone name choice to the current (actionable) choice
        if (name_number == 1) this.currentNameObj = this.compName1
        if (name_number == 2) this.currentNameObj = this.compName2
        if (name_number == 3) this.currentNameObj = this.compName3
      },
    },
  }
</script>


<style scoped>


  .examine-search-div:focus-within {
    box-shadow: 0 0 3px 2px var(--cyan) !important;
  }

  .name-option {
    font-size: 17px;
    margin-top: 6px !important;
    margin-bottom: 0 !important;
  }

  .c-cyan {
    color: var(--cyan)
  }

  .name-option.accepted {
    color: var(--cyan);
  }

  .decision-text {
    padding: 0;
    margin: 0;
    font-size: 11px;
    width: 600px;
    position: relative;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .completed-decision-text {
    font-size: 15px;
    white-space: pre-wrap;
  }

  .names-hide-details {
    margin: 0;
    padding: 8px 0 8px 0;
  }

  .active-name-option {
    font-weight: 600;
  }

  .examine-search {
    background-color: white;
    border: 1px solid lightgrey !important;
    font-size: 15px;
    height: 40px;
    margin-bottom: auto;
    margin-top: auto;
    padding: 5px 10px 5px 10px;
  }

</style>
