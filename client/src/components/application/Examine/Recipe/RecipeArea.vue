<!--eslint-disable-->
<template>
  <v-container fluid style="background-color: white" ma-0 pa-0>
    <v-layout column>
      <v-flex>
        <v-tabs color="white"
                fixed-tabs
                flat
                height="40px"
                hide-slider
                v-model="currentRecipeCard">

          <v-tab @click="preventEvent"
                 :class="getClasses('Conflicts')"
                 flat
                 href="Conflicts"
                 id="conflicts-tab">
            <v-icon :class="conflictsIcon === 'close' ? 'c-priority' : 'c-accepted'"
                    class="ma-0 pa-0 recipe-menu-icon"
                    id="conflicts1">{{ conflictsIcon }}</v-icon>
            <span class="recipe-menu-tab-text">Conflicts</span>
          </v-tab>

          <v-tab @click="preventEvent"
                 :class="getClasses('Conditions')"
                 flat
                 href="Conditions"
                 id="conditions-tab">
            <v-icon :class="conditionIcon === 'close' ? 'c-priority' : 'c-accepted'"
                    class="ma-0 pa-0 recipe-menu-icon"
                    id="conditions1">{{ conditionIcon }}</v-icon>
            <span class="recipe-menu-tab-text">Condition</span>
          </v-tab>

          <v-tab @click="preventEvent"
                 :class="getClasses('Trademarks')"
                 flat
                 href="Trademarks"
                 id="trademarks-tab">
              <v-icon :class="trademarksIcon === 'close' ? 'c-priority' : 'c-accepted'"
                      class="ma-0 pa-0 recipe-menu-icon"
                      id="trademarks1">{{ trademarksIcon }}</v-icon>
            <span class="recipe-menu-tab-text">Trademarks</span>
          </v-tab>

          <v-tab @click="preventEvent"
                 :class="getClasses('History')"
                 flat
                 href="History"
                 id="history-tab">
            <v-icon :class="historyIcon === 'close' ? 'c-priority' : 'c-accepted'"
                    class="ma-0 pa-0 recipe-menu-icon"
                    id="history1">{{ historyIcon }}</v-icon>
            <span class="recipe-menu-tab-text">History</span>
          </v-tab>
        </v-tabs>
      </v-flex>
      <v-flex>
        <ConflictList v-if="currentRecipeCard === 'Conflicts'" />
        <ConditionsInfo v-else-if="currentRecipeCard === 'Conditions'" />
        <TrademarksInfo v-else-if="currentRecipeCard === 'Trademarks'" />
        <HistoryList v-else />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  /* eslint-disable */
  import ConditionsInfo from '@/components/application/Examine/Recipe/conditions/ConditionsInfo'
  import ConflictList from '@/components/application/Examine/Recipe/conflicts/ConflictList'
  import HistoryList from '@/components/application/Examine/Recipe/history/HistoryList'
  import TrademarksInfo from '@/components/application/Examine/Recipe/trademarks/TrademarksInfo'

  export default {
    name: 'RecipeArea',
    components: { ConditionsInfo, ConflictList, HistoryList, TrademarksInfo },
    data() {
      return {
        conditionIcon: 'close',
        conflictsIcon: 'close',
        historyIcon: 'close',
        trademarksIcon: 'close',
      }
    },
    mounted() {
      if (!this.currentRecipeCard) {
        this.$store.commit('currentRecipeCard', 'Conflicts')
      }
      this.setConditions()
      this.setConflicts()
      this.setHistory()
      this.setTrademarks()
    },
    computed: {
      cobrsPhoneticConflicts() {
        return this.$store.getters.cobrsPhoneticConflicts
      },
      conditionInfo() {
        return this.$store.getters.conditionsJSON
      },
      currentRecipeCard: {
        get() {
          return this.$store.getters.currentRecipeCard
        },
        set(value) {
          this.$store.commit('currentRecipeCard', value)
        },
      },
      hasExactMatchesInfo() {
        return this.$store.getters.hasExactMatches
      },
      historyInfo() {
        return this.$store.getters.historiesJSON
      },
      phoneticConflicts() {
        return this.$store.getters.phoneticConflicts
      },
      synonymMatchesInfo() {
        return this.$store.getters.synonymMatchesConflicts
      },
      trademarkInfo() {
        return this.$store.getters.trademarksJSON
      },
    },
    watch: {
      cobrsPhoneticConflicts(val) {
        // set severity flag on recipe menu
        this.setConflicts()
      },
      conditionInfo(val) {
        // set severity flag on recipe menu
        this.setConditions()
      },
      hasExactMatchesInfo() {
        this.setConflicts()
      },
      historyInfo(val) {
        // set severity flag on recipe menu
        this.setHistory()
      },
      phoneticConflicts(val) {
        // set severity flag on recipe menu
        this.setConflicts()
      },
      synonymMatchesInfo(val) {
        // set severity flag on recipe menu
        this.setConflicts()
      },
      trademarkInfo(val) {
        // set severity flag on recipe menu
        this.setTrademarks()
      },
    },
    methods: {
      clickRecipeCard(event) {
        event.preventDefault()
      },
      getClasses(tab) {
        if (tab === 'Conflicts') {
          if (this.currentRecipeCard === tab) {
            return 'tab-base tab-1st-active'
          }
          return 'tab-base tab-1st-inactive'
        }
        if (this.currentRecipeCard === tab) {
          return 'tab-base tab-active'
        }
        return 'tab-base tab-inactive'
      },
      hasCobrsPhonConflicts() {
        let matchesList = this.cobrsPhoneticConflicts
        for (let i = 0; i < matchesList.length; i++) {
          if (matchesList[i].source != undefined)
            return true
        }
        return false
      },
      hasPhonConflicts() {
        let matchesList = this.phoneticConflicts
        for (let i = 0; i < matchesList.length; i++) {
          if (matchesList[i].source != undefined)
            return true
        }
        return false
      },
      hasSynConflicts() {
        let matchesList = this.synonymMatchesInfo
        for (let i = 0; i < matchesList.length; i++) {
          if (matchesList[i].source != undefined)
            return true
        }
        return false
      },
      preventEvent(event) {
        event.preventDefault()
        event.stopPropagation()
      },
      setConcern(val) {
        this[val] = 'close'
      },
      setConditions() {
        // if no restricted words -> call setPass
        // else if any word has all possible conditions with allow us as 'N' -> call setFail
        // else -> call setConcern

        var conditionInfo = this.conditionInfo
        if (conditionInfo != null) {
          conditionInfo = conditionInfo.restricted_words_conditions
          if (conditionInfo.length != 0) {
            var fail = false
            var wIter
            var cIter
            // loop through restricted words and their list of conditions
            for (wIter = 0; wIter < conditionInfo.length; wIter++) {
              var tmpF = true
              // loop through list of condition info and grab 'allow_use' info for each one
              for (cIter = 0; cIter < conditionInfo[wIter].cnd_info.length; cIter++) {
                if (conditionInfo[wIter].cnd_info[cIter].allow_use_tf) {
                  tmpF = false
                }
              }
              // if true then all conditions for this word had 'allow_use' = 'N'
              if (tmpF) {
                fail = true
                break
              }
            }
            // if true then at least 1 word had 'allow_use' = 'N' for every condition
            if (fail) {
              this.setFail('conditionIcon')
            } else {
              this.setConcern('conditionIcon')
            }
          } else {
            this.setPass('conditionIcon')
          }
        } else {
          this.setPass('conditionIcon')
        }
      },
      setConflicts() {
        if (this.hasExactMatchesInfo || this.hasSynConflicts() || this.hasCobrsPhonConflicts() || this.hasPhonConflicts())
          this.setFail('conflictsIcon')
        else
          this.setPass('conflictsIcon')
      },
      setFail(val) {
        this[val] = 'close'
      },
      setHistory() {
        //If there is any history, set to CONCERN; otherwise PASS. -- changing
        if (this.historyInfo == null || this.historyInfo.names.length == 0) {
          this.setPass('historyIcon')
        } else {
          let set = false
          for (let i = 0; i < this.historyInfo.names.length; i++) {
            if (this.historyInfo.names[i].name_state_type_cd === 'R' || this.historyInfo.names[i].name_state_type_cd === 'REJECTED' || this.historyInfo.names[i].submit_count > 3) {
              this.setFail('historyIcon')
              set = true
              break
            }
          }
          if (!set)
            this.setConcern('historyIcon')
        }
      },
      setPass(val) {
        this[val] = 'check'
      },
      setTrademarks() {
        //If there are any trademarks, set to FAIL; otherwise PASS.
        if (this.trademarkInfo == null || this.trademarkInfo == undefined) {
          this.setPass('trademarksIcon')
        } else if (this.trademarkInfo.names.length == 0) {
          this.setPass('trademarksIcon')
        } else {
          this.setFail('trademarksIcon')
        }
      },
    },
  }
</script>

<style scoped>
  .recipe-menu-icon {
    position: relative;
    top: -3px;
  }

  .recipe-menu-tab-text {
    position: relative;
    top: -3px;
  }

  .tab-1st-active {
    border-left: 0;
    border-bottom: 0;
  }
  .tab-1st-inactive {
    border-left: 0;
    border-bottom: 2px solid var(--xl-grey);
  }

  .tab-active {
    border-left: 2px solid var(--xl-grey);
    border-bottom: 0;
  }

  .tab-base {
    background-color: white;
    border-right: 0;
    border-top: 0;
    color: var(--link);
    padding-top: 3px !important;
    width: 25%;
  }

  .tab-inactive {
    border-left: 2px solid var(--xl-grey);
    border-bottom: 2px solid var(--xl-grey);
  }
</style>
