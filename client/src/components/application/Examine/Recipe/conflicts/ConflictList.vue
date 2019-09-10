<!--eslint-disable-->
<template>
  <v-container container-style
               id="conflicts-container">
    <spinner className="conflict-container-spinner hidden"/>
    <template v-for="(title, i) in conflictTitles">
      <!--CASE: EXACT MATCHES ONLY-->
      <v-layout :class="title.class"
                :conflict-highlighted="index === i && focus === 'conflicts' && index !== 0"
                :id="title.id"
                :key="`exact-layout-${i}`"
                :pt-1="expandedID === title.id ? true: false"
                align-center
                exact-match-layout
                px-4
                v-if="title.nrNumber">
        <v-flex width-5>
          <v-checkbox :disabled="checkboxDisabled"
                      id="`check-${item.nrNumber}`"
                      :input-value="selectedNRs"
                      :value="title.nrNumber"
                      @click.prevent.stop="setCheckbox(title)"
                      class="shift-up"/>
        </v-flex>
        <v-flex @click="clickExactMatch(title, i)"
                width-60
                cursor-pointer
                lg8
                style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                v-html="title.highlightedText"/>
        <v-flex cursor-pointer
                width-15
                v-if="title.nrNumber">{{ title.nrNumber }}
        </v-flex>
        <v-flex cursor-pointer
                width-5
                v-if="title.jurisdiction">{{ $store.getters.getShortJurisdiction(title.jurisdiction) }}
        </v-flex>
        <v-flex cursor-pointer
                width-15
                text-right
                v-if="title.startDate">{{ formatDate(title.startDate) }}
        </v-flex>
      </v-layout>

      <!--CASE:  TITLES WITH CHILDREN / COUNT OF 1 OR MORE / EXPAND COLLAPSE ICONS-->
      <v-layout :class="title.class"
                :conflict-highlighted="index === i && focus === 'conflicts' && openBucketIndex===null"
                :id="title.id"
                :key="`count-layout-${i}`"
                @click="clickBucket(i)"
                title-layout
                v-else-if="title.count > 0">
        <v-flex cursor-pointer grow>
          <span v-html="title.highlightedText"></span>
          <span class="conflict-meta" v-if="title.meta"> - {{ title.meta }}</span>
        </v-flex>
        <v-flex cursor-pointer shrink v-if="openBucketIndex === i">
          {{ title.count }}
          <v-icon class="negative-margin" cursor-pointer>keyboard_arrow_up</v-icon>
        </v-flex>
        <v-flex cursor-pointer shrink v-else>
          {{ title.count }}
          <v-icon class="negative-margin">keyboard_arrow_down</v-icon>
        </v-flex>
      </v-layout>

      <!--CASE:  TITLES WITHOUT CHILDREN / 0 COUNTS / NO ICONS -->
      <v-layout :class="title.class"
                :conflict-highlighted="index === i && focus === 'conflicts' && openBucketIndex===null"
                :id="title.id"
                :key="`no-count-layout-${i}`"
                v-else
                zero-count-title-layout>
        <v-flex grow>
          <span v-html="title.highlightedText"></span>
          <span class="conflict-meta" v-if="title.meta"> - {{ title.meta }}</span>
        </v-flex>
      </v-layout>

      <!--CASE:  RENDERED AFTER ALREADY VISIBLE TITLE WITH COUNT WHEN ITS THE CURRENT INDEX-->
      <v-flex :key="`vl-flex-${i}`"
              class="bucket-list"
              id="bucket-list"
              v-if="children && openBucketIndex === i">
          <virtual-list :remain="14"
                        :bench="10"
                        :scrollelement="$el"
                        :size="32">
            <ConflictListItem :child="child"
                              :childIndex="childIndex"
                              :clickChild="clickChild"
                              :containerDivEl="$el"
                              :expandedID="expandedID"
                              :focus="focus"
                              :checkboxDisabled="checkboxDisabled"
                              :key="child.id"
                              :n="n"
                              :selectedNRs="selectedNRs"
                              :setCheckbox="setCheckbox"
                              v-for="(child, n) of children"/>
          </virtual-list>
      </v-flex>
      <v-layout :key="`exact-info-${i}`"
                conflict-layout
                v-if="expandedID === title.id">
        <ConflictInfo class="conflict-detail" />
      </v-layout>
    </template>
  </v-container>

</template>

<script>
  /* eslint-disable */
  import ConflictInfo from './ConflictInfo'
  import ConflictListItem from './ConflictListItem'
  import moment from 'moment'
  import spinner from '@/components/application/spinner.vue'
  import virtualList from 'vue-virtual-scroll-list'
  import { mapGetters } from 'vuex'

  const debounce = require('lodash/debounce')

  export default {
    name: 'ConflictList',
    components: { virtualList, ConflictListItem, ConflictInfo, spinner },
    data() {
      return {
        prevIndex: '',
        focus: 'conflicts',
      }
    },
    activated() {
      this.addListeners()
    },
    deactivated() {
      this.removeListeners()
    },
    mounted() {
      this.$root.$on('setconflictfocus', (area) => {
        this.setFocus(area)
      })
      this.$root.$on('initializeconflicts', () => {
        this.initialize()
        this.setInitialFocus()
      })
    },
    beforeDestroy() {
      this.removeListeners()
    },
    computed: {
      ...mapGetters({
        cobrsPhoneticConflicts: 'cobrsPhoneticConflicts',
        exactMatchesConflicts: 'exactMatchesConflicts',
        is_making_decision: 'is_making_decision',
        is_editing: 'is_editing',
        phoneticConflicts: 'phoneticConflicts',
        conflicts: 'selectedConflicts',
        selectedConflictID: 'selectedConflictID',
        expandedConflictID: 'expandedConflictID',
        openBucket: 'openBucket',
        synonymMatchesConflicts: 'synonymMatchesConflicts',
        comparedConflicts: 'comparedConflicts',
        conflictTitles: 'conflictTitles',
        conflictsIndex: 'conflictsIndex',
        conflictsChildIndex: 'conflictsChildIndex',
        conflictsChildren: 'conflictsChildren',
        conflictsScrollPosition: 'conflictsScrollPosition',
        currentRecipeCard: 'currentRecipeCard',
        conflictsAutoAdd: 'conflictsAutoAdd',
        decisionPanel: 'decisionPanel',
        selectedConflictNRs: 'selectedConflictNRs',
      }),
      checkboxDisabled() {
        return this.decisionPanel.functionalityDisabled
      },
      autoAdd() {
        return this.conflictsAutoAdd
      },
      index: {
        get() {
          return this.conflictsIndex
        }, set(value) {
          this.$store.commit('setConflictsIndex', value)
        }
      },
      childIndex: {
        get() {
          return this.conflictsChildIndex
        }, set(value) {
          this.$store.commit('setConflictsChildIndex', value)
        }
      },
      children: {
        get() {
          return this.conflictsChildren
        }, set(value) {
          this.$store.commit('setConflictsChildren', value)
        }
      },
      expandedID: {
        get() {
          return this.expandedConflictID
        }, set(id) {
          this.$store.commit('setExpandedConflictID', id)
        }
      },
      savedScrollPosition: {
        get() {
          return this.conflictsScrollPosition
        }, set(value) {
          this.$store.commit('setConflictsScrollPosition', value)
        }
      },
      lastIndex() {
        //finds the index of the last clickable conflictTitle
        if (this.conflictTitles && this.conflictTitles.length > 0) {
          for (let i = this.conflictTitles.length - 1; i >= 0; i--) {
            if (this.conflictTitles[i].count > 0) return i
            return null
          }
        }
      },
      lastChildIndex() {
        if (this.children) return this.children.length - 1
      },
      openBucketIndex: {
        get() {
          return this.openBucket
        }, set(index) {
          this.$store.commit('setOpenBucket', index)
        }
      },
      selectedConflicts: {
        get() {
          return this.conflicts
        }, set(item) {
          this.$store.commit('setSelectedConflicts', item)
        }
      },
      selectedNRs() {
        return this.selectedConflictNRs
      },
    },
    watch: {
      conflictTitles(newData) {
        this.initialize()
        this.setInitialFocus(newData)
      },
      currentRecipeCard(newData) {
        //restores the scroll offset when switching between tabs
        if (newData === 'Conflicts' && this.savedScrollPosition !== 0) {
          this.$nextTick(function () {
            document.getElementById('conflicts-container').scrollTo({ top: this.savedScrollPosition })
          })
        }
      }
    },
    methods: {
      initialize() {
        this.index = null
        this.childIndex = 0
        this.children = []
        this.openBucketIndex = null
        this.expandedID = null
        this.selectedConflicts = []
        this.focus = 'conflicts'
      },
      addListeners() {
        this.removeListeners()
        document.addEventListener('keydown', this.manageEventListener)
        this.$el.addEventListener('scroll', debounce(this.saveScrollPosition), 350)
      },
      clickBucket(index) {
        this.focus = 'conflicts'
        this.expandedID = null
        if (this.openBucketIndex && index === this.openBucketIndex) {
          this.children = null
          this.index = this.openBucketIndex
          this.openBucketIndex = null
          this.childIndex = 0
          return
        }
        this.children = this.conflictTitles[index].children
        this.childIndex = 0
        this.index = null
        this.openBucketIndex = index
      },
      clickChild(match, index) {
        this.focus = 'conflicts'
        if (this.expandedID === match.id) {
          this.expandedID = null
          return
        }
        if (this.expandedID !== null) {
          this.expandedID = null
        }
        this.$store.dispatch('getConflictInfo', match)
        this.childIndex = index
        this.expandedID = match.id
      },
      clickExactMatch(match, index) {
        if (this.expandedID !== null) {
          if (this.expandedID == match.id) {
            this.expandedID = null
            return
          }
          this.expandedID = null
        }
        this.focus = 'conflicts'
        this.$store.dispatch('getConflictInfo', match)
        this.openBucketIndex = null
        this.childIndex = 0
        this.children = null
        this.index = index
        this.expandedID = match.id
      },
      formatDate(d) {
        return moment(d).parseZone().format('YYYY-MM-DD')
      },
      manageEventListener(event) {
        let types = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Space']
        //return the event without taking action / modifying it in any way when...
        // 1) key pressed is not on the list of keys we are listening for (so we never care about it)
        // 2) when the focus is inside a text area (so that all events go to the text area unmodified)
        // 3) when the editing panel is expanded by clicking Edit Request Button (and ConflictList is not visible)
        if (!types.includes(event.code) || event.target.type === 'textarea' || this.is_editing) {
          return event
        }
        //suppress space keypress event when !is_making_decision to prevent items from being added
        //to the Decision / Compare Panel when panels not visible
        if (event.code === 'Space' && !this.is_making_decision) {
          return event
        }
        //having triggered none of the exclusions above, we want to capture the event if the focus is not in
        //an INPUT tag or generally if it is a Tab keypress, and outside of those conditions, return the event
        if (event.target.tagName !== 'INPUT' || event.code === 'Tab') {
          event.preventDefault()
          this.handleKeyboardEvent(event)
        } else {
          return event
        }
      },
      handleKeyboardEvent(event) {
        const moveDown = () => {
          for (let i = this.index + 1; i < this.conflictTitles.length; i++) {
            if (this.conflictTitles[i].count > 0 || this.conflictTitles[i].nrNumber) {
              this.index = i
              return
            }
          }
          return
        }
        switch (event.code) {
          case 'ArrowDown':
            this.expandedID = null

            if (this.openBucketIndex !== null) {
              //Case:  There is an open bucket and the last item in it is not highlighted
              //Advance childIndex bt one
              if (this.childIndex < this.lastChildIndex) {
                this.childIndex++
                let { id } = this.children[this.childIndex]
                this.scrollIntoView(id)
                return
              }
              //Case: Highlighting Last Item in Open Bucket
              //Close the bucket and advance the regular index
              if (this.childIndex === this.lastChildIndex) {
                if (this.openBucketIndex === this.lastIndex) return
                this.openBucketIndex = null
                this.children = null
                this.childIndex = 0
                moveDown()
                return
              }
              return
            }
            //Case: No open bucket.  Just call MoveDown()
            moveDown()
            let { id } = this.conflictTitles[this.index]
            this.scrollIntoView(id)
            return

          case 'ArrowUp':
            if (this.expandedID !== null) {
              this.expandedID = null
              return
            }
            if (this.openBucketIndex !== null) {
              if (this.childIndex > 0) {
                this.childIndex--
                let { id } = this.children[this.childIndex]
                this.scrollIntoView(id)
                return
              }
              this.openBucketIndex = null
              this.children = null
              this.scrollIntoView(this.conflictTitles[this.index].id)
              return
            }
            for (let i = this.index - 1; i >= 0; i--) {
              if (this.conflictTitles[i].count > 0 || this.conflictTitles[i].nrNumber) {
                this.index = i
                let { id } = this.conflictTitles[i]
                this.scrollIntoView(id)
                return
              }
            }
            return

          case 'ArrowLeft':
            if (this.expandedID !== null) {
              this.expandedID = null
              return
            }
            if (this.openBucketIndex !== null) {
              this.scrollIntoView(this.conflictTitles[this.index].id)
              this.openBucketIndex = null
              this.children = null
              this.childIndex = 0
            }
            return

          case 'ArrowRight':
            if (this.openBucketIndex !== null) {
              let item = this.children[this.childIndex]
              this.$store.dispatch('getConflictInfo', item)
              this.expandedID = item.id
              this.scrollIntoView(item.id)
              return
            }
            if (this.openBucketIndex === null && this.conflictTitles[this.index].nrNumber) {
              let item = this.conflictTitles[this.index]
              this.$store.dispatch('getConflictInfo', item)
              this.expandedID = item.id
              this.scrollIntoView(item.id)
              return
            }
            this.openBucketIndex = this.index
            let item = this.conflictTitles[this.index]
            this.children = item.children
            this.childIndex = 0
            this.scrollIntoView(item.children[0].id)
            return

          case 'Space':
            if (this.checkboxDisabled) {
              return
            }
            //if child menu is open, then children[childIndex] must be conflict-result
            if (this.children) {
              this.setCheckbox(this.children[this.childIndex])
              return
            }
            if (this.openBucketIndex === null) {
              //if no open bucket, only an exact-match will have a checkbox.
              //exact-matches are the only item not rendered under a title with a nrNumber.
              if (this.conflictTitles[this.index].nrNumber) {
                this.setCheckbox(this.conflictTitles[this.index])
              }
            }
            return

          case 'Tab':
            this.setFocus()
            return
        }
      },
      removeListeners() {
        document.removeEventListener('keydown', this.manageEventListener)
        this.$el.removeEventListener('scroll',debounce(this.saveScrollPosition))
      },
      saveScrollPosition(e) {
        this.savedScrollPosition = e.target.scrollTop
        return e
      },
      scrollIntoView(id, opt=true) {
        this.$nextTick(function() {
          let el = document.getElementById(id)
          if (el) el.scrollIntoViewIfNeeded()
        })
      },
      setCheckbox(conflict) {
        this.$store.dispatch('toggleConflictCheckbox', conflict)
      },
      setExactMatchesOnLoad(newData) {
        if (!newData) newData = this.conflictTitles
        let exactMatches = []
        for (let title of newData) {
          if (title.nrNumber && exactMatches.length < 3) {
            exactMatches.push(title)
          }
        }
        exactMatches.forEach( match => {
          this.setCheckbox(match)
        })
      },
      setFocus(area) {
        if (!area) {
          if (this.focus === 'conflicts') area = 'regular'
          if (this.focus === 'regular') area = 'exact'
          if (this.focus === 'exact') area = 'conflicts'
        }
        if (area === 'regular') {
          this.$root.$emit('setcompnamefocus', {ref: 'regularsearchfield'})
          this.focus = 'regular'
          return
        }
        if (area === 'exact') {
          this.$root.$emit('setcompnamefocus', {ref: 'exactsearchfield'})
          this.focus = 'exact'
          return
        }
        if (area === 'conflicts') {
          this.$root.$emit('setcompnamefocus', {ref:'exactsearchfield', type: 'blur'})
          this.$root.$emit('setcompnamefocus', { ref: 'regularsearchfield', type: 'blur' })
          this.focus = 'conflicts'
          return
        }
      },
      setInitialFocus(newData) {
        if (!newData) newData = this.conflictTitles
        for (let i = 0; i < newData.length; i++) {

          //case: Exact Match in conflict titles
          if (newData[i].nrNumber) {
            this.children = null
            this.index = i
            this.focus = 'conflicts'
            this.$root.$emit('setcompnamefocus', { ref: 'regularsearchfield', type: 'blur' })
            this.openBucketIndex = null
            this.setExactMatchesOnLoad(newData)
            this.scrollIntoView(newData[i].id)
            return
          }
          //case: No exact match, but there is a title with count > 0
          if (newData[i].count > 0) {
            this.childIndex = 0
            this.children = newData[i].children
            this.openBucketIndex = i
            this.focus = 'conflicts'
            this.$root.$emit('setcompnamefocus', {ref: 'regularsearchfield', type: 'blur'})
            this.index = i
            this.scrollIntoView(newData[i].children[0].id)
            return
          }
        }
        //case: there are no conflicts at all
        this.openBucketIndex = null
        this.children = null
        this.index = null
        this.setFocus('regular')
      },
    }
  }
</script>

<style scoped>
  .conflict-container-spinner:not(.hidden) ~ .exact-match-layout,
  .conflict-container-spinner:not(.hidden) ~ .zero-count-title-layout,
  .conflict-container-spinner:not(.hidden) ~ .bucket-list,
  .conflict-container-spinner:not(.hidden) ~ .conflict-layout,
  .conflict-container-spinner:not(.hidden) ~ .title-layout {
    display: none;
  }

  .cursor-pointer, .title-match, .bucket-list {
    cursor: pointer !important;
  }

  .container-style {
    width: 100%;
    margin: 0;
    padding: 3px 0 0 0;
    font-weight: 400;
    font-size: 15px;
    height: 445px;
    max-height: 445px;
    overflow-y: scroll;
  }

  .conflict-cobrs-phonetic-title {
    padding: 5px;
    margin: 0 !important;
    text-transform: uppercase;
    color: var(--text);
    font-weight: 400;
    height: 32px !important;
  }

  .conflict-exact-match {
    color: var(--priority) !important;
    font-weight: 400;
  }

  .conflict-heading {
    background-color: var(--l-grey);
    font-weight: 600;
    padding: 5px 8px 5px 8px;
    color: var(--text);
    margin-bottom: 1px;
  }

  .conflict-highlighted {
    background-color: #dceffa;
  }

  .conflict-meta {
    text-transform: lowercase !important;
    font-weight: 400 !important;
    font-style: italic !important;
  }

  .conflict-no-match {
    color: var(--l-grey);
    height: 32px !important;
    padding: 3px 0 0 8px;

  }

  .conflict-phonetic-title {
    padding: 5px;
    margin: 0;
    text-transform: uppercase;
    color: var(--text);
    font-weight: 400;
    height: 32px !important;
  }

  .conflict-result {
    color: #38598a;
  }

  .conflict-synonym-title {
    padding: 5px;
    margin-top: 0;
    height: 32px !important;
    text-transform: uppercase;
    color: var(--text);
    font-weight: 400;
  }

  .container-style {
    width: 100%;
    margin: 0;
    padding: 0;
    font-weight: 400;
    font-size: 15px;
    height: 445px;
    max-height: 445px;
    overflow-y: scroll;
  }

  .cursor-pointer, .title-match, .bucket-list {
    cursor: pointer !important;
  }

  .shift-up {
    position: relative;
    top: 4px !important;
  }

  .width-15 {
    width: 15%;
  }

  .width-5 {
    width: 5%;
  }

  .width-60 {
    width: 60%;
  }


</style>
