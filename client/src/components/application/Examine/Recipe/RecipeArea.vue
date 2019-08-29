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
            <v-icon :class="getColour(conflictsIcon)"
                    class="mr-1 pa-0 recipe-menu-icon"
                    id="conflicts1">{{ conflictsIcon }}</v-icon>
            <span class="recipe-menu-tab-text">Conflicts</span>
          </v-tab>

          <v-tab @click="preventEvent"
                 :class="getClasses('Conditions')"
                 flat
                 href="Conditions"
                 id="conditions-tab">
            <v-icon
              :class="getColour(conditionIcon)"
              class="mr-1 pa-0 recipe-menu-icon"
              id="conditions1">{{ conditionIcon }}</v-icon>
            <span class="recipe-menu-tab-text">Condition</span>
          </v-tab>

          <v-tab @click="preventEvent"
                 :class="getClasses('Trademarks')"
                 flat
                 href="Trademarks"
                 id="trademarks-tab">
              <v-icon :class="getColour(trademarksIcon)"
                      class="mr-1 pa-0 recipe-menu-icon"
                      id="trademarks1">{{ trademarksIcon }}</v-icon>
            <span class="recipe-menu-tab-text">Trademarks</span>
          </v-tab>

          <v-tab @click="preventEvent"
                 :class="getClasses('History')"
                 flat
                 href="History"
                 id="history-tab">
            <v-icon :class="getColour(historyIcon)"
                    class="mr-1 pa-0 recipe-menu-icon"
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
  import { mapState } from 'vuex'
  import ConditionsInfo from '@/components/application/Examine/Recipe/conditions/ConditionsInfo'
  import ConflictList from '@/components/application/Examine/Recipe/conflicts/ConflictList'
  import HistoryList from '@/components/application/Examine/Recipe/history/HistoryList'
  import TrademarksInfo from '@/components/application/Examine/Recipe/trademarks/TrademarksInfo'

  export default {
    name: 'RecipeArea',
    components: { ConditionsInfo, ConflictList, HistoryList, TrademarksInfo },
    mounted() {
      if (!this.currentRecipeCard) {
        this.currentRecipeCard = 'conflicts'
      }
    },
    computed: {
      ...mapState({
        exactMatchesConflicts: state => (state.exactMatchesConflicts.filter(conflict => conflict.nrNumber)),
        cobrsPhoneticConflicts: 'cobrsPhoneticConflicts',
        phoneticConflicts: 'phoneticConflicts',
        synonymMatchesConflicts: 'synonymMatchesConflicts',
        is_making_decision: 'is_making_decision',
        conditionsJSON: 'conditionsJSON',
        historiesJSON: 'historiesJSON',
        trademarkInfo: 'trademarksJSON',
      }),
      conditionIcon() {
        if (this.conditionsJSON) {
          let { restricted_words_conditions } = this.conditionsJSON
          if (restricted_words_conditions.length > 0) {
            for (let resWord of restricted_words_conditions) {
              if (resWord.cnd_info.every(con => con.allow_use === 'N')) {
                return 'close'
              }
            }
            return 'error_outline'
          }
        }
        return 'done'
      },
      conflictsIcon() {
        if (
          this.cobrsPhoneticConflicts.length > 0
          || this.exactMatchesConflicts.length > 0
          || this.synonymMatchesConflicts.length > 0
          || this.phoneticConflicts.length > 0
        ) {
          return 'close'
        }
        return 'done'
      },
      currentRecipeCard: {
        get() {
          return this.$store.getters.currentRecipeCard
        },
        set(value) {
          this.$store.commit('currentRecipeCard', value)
        },
      },
      historyIcon() {
        if (!this.historiesJSON || this.historiesJSON.names.length === 0) {
          return 'done'
        }
        for (let historyItem of this.historiesJSON.names) {
          if (historyItem.name_state_type_cd === 'R' || historyItem.name_state_type_cd === 'REJECTED') {
            return 'close'
          }
        }
        return 'error_outline'
      },
      trademarksIcon() {
        if (!this.trademarkInfo || this.trademarkInfo.names.length === 0) {
          return 'done'
        }
        return 'close'
      },
    },
    methods: {
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
      getColour(icon) {
        if (icon === 'done') return 'c-accepted'
        if (icon === 'error_outline') return 'c-gold'
        if (icon === 'close') return 'c-priority'
      },
      preventEvent(event) {
        event.preventDefault()
        event.stopPropagation()
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
