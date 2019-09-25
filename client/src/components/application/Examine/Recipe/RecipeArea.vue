<!--eslint-disable-->
<template>
  <v-container fluid style="background-color: white" ma-0 pa-0>
    <v-layout column ma-0 pa-0>
      <v-layout tab-layout ma-0 pa-0 align-center>
        <v-flex @click="currentRecipeCard = 'Conflicts'"
                grow
                d-flex
                :class="getClasses('Conflicts')">
          <span class="recipe-menu-tab-text">
            <v-icon :class="getColour(conflictsIcon)"
                    class="mr-1 pa-0 recipe-menu-icon"
                    id="conflicts1">{{ conflictsIcon }}</v-icon>Conflicts</span>
        </v-flex>
        <v-flex @click="currentRecipeCard = 'Conditions'"
                text-center
                grow
                :class="getClasses('Conditions')">
          <div class="recipe-menu-tab-text">
            <v-icon :class="getColour(conditionIcon)"
                    class="mr-1 pa-0 recipe-menu-icon"
                    id="conditions1">{{ conditionIcon }}</v-icon>Conditions</div>
        </v-flex>
        <v-flex @click="currentRecipeCard = 'Trademarks'"
                text-center
                grow
                :class="getClasses('Trademarks')">
          <span class="recipe-menu-tab-text">
            <v-icon :class="getColour(trademarksIcon)"
                    class="mr-1 pa-0 recipe-menu-icon"
                    id="trademarks1">{{ trademarksIcon }}</v-icon>Trademarks</span>
        </v-flex>
        <v-flex @click="currentRecipeCard = 'History'"
                text-center

                grow
                :class="getClasses('History')">
          <span class="recipe-menu-tab-text">
             <v-icon :class="getColour(historyIcon)"
                     class="mr-1 pa-0 recipe-menu-icon"
                     id="history1">{{ historyIcon }}</v-icon>History</span>
        </v-flex>
        <v-flex @click="currentRecipeCard = 'Compare'"
                text-center
                grow
                :class="getClasses('Compare')">
          <span class="recipe-menu-tab-text">
            <v-icon class="ma-0 pa-0 recipe-menu-icon"
                    id="compare1">dehaze</v-icon>Compare</span>
        </v-flex>
        <div class="auto-add-area">
          <div style="position: relative; top: 5px">
            <v-checkbox v-model="autoAdd"
                        :disabled="autoAddDisabled" />
          </div>
          <div class="fs-14 pa-0 ma-0 pr-1" :class="autoAddDisabled ? 'c-grey' : 'c-link'">auto add</div>
        </div>
      </v-layout>
      <v-flex style="background-color: white; padding-top: 4px;">
        <keep-alive>
          <component :is="currentRecipeCard" />
        </keep-alive>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import Conditions from '@/components/application/Examine/Recipe/conditions/ConditionsInfo'
  import Conflicts from '@/components/application/Examine/Recipe/conflicts/ConflictList'
  import History from '@/components/application/Examine/Recipe/history/HistoryList'
  import Trademarks from '@/components/application/Examine/Recipe/trademarks/TrademarksInfo'
  import Compare from './compare/Compare'

  export default {
    name: 'RecipeArea',
    components: { Compare, Conditions, Conflicts, History, Trademarks },
    mounted() {
      if (!this.currentRecipeCard) {
        this.currentRecipeCard = 'Conflicts'
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
      ...mapGetters([
        'autoAddDisabled',
        'decisionPanel'
      ]),
      autoAdd: {
        get() {
          return this.$store.getters.conflictsAutoAdd
        },
        set(value) {
          this.$store.commit('setConflictsAutoAdd', value)
        }
      },
      conditionIcon() {
        if (this.conditionsJSON) {
          let { restricted_words_conditions } = this.conditionsJSON
          if (restricted_words_conditions.length > 0) {
            for (let resWord of restricted_words_conditions) {
              if (resWord.cnd_info.every(con => con.allow_use === 'N')) return 'close'
              if (resWord.cnd_info.every(con => con.consent_required === 'Y')) return 'close'
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
      }
    },
  }
</script>

<style scoped>
  #compare1 {
    position: relative;
    top: 2px;
    margin-right: 3px !important;
    color: var(--link);
  }

  .auto-add-area {
    display: flex;
    height: 42px;
    align-items: center;
    background-color: var(--xl-grey);
    padding: 0 !important;
    padding-left: 5px !important;
  }
  opacity-50 {
    opacity: 20% !important;
  }

  .recipe-menu-icon {
    font-size: 20px;
  }

  .recipe-menu-tab-text {
    position: relative;
    top: 1px;
    font-size: 14px;
    display: inline-block;

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
    border-right: 0;
    border-top: 0;
    color: var(--link);
    cursor: pointer;
    height: 42px;
    padding-top: 1%;
    padding-bottom: 3%;
    text-align: center !important;
  }

  .tab-inactive {
    border-left: 2px solid var(--xl-grey);
    border-bottom: 2px solid var(--xl-grey);
  }

  .tab-layout {
    height: 42px;
    background-color: white;
    align-items: center;
  }

</style>
