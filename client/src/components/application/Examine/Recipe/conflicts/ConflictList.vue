<!--eslint-disable-->
<template>
  <v-layout column id="conflict-list" fs-15 v-if="conflictData.length > 0">

    <!-- EXACT MATCH -->
    <v-flex :class="option.class"
            :key="option.value"
            @click="handleClick(option)"
            v-for="(option, index) in exactMatchData">
      <template v-if="option.class.indexOf('spinner') >= 0">
        <spinner className="mini" />
      </template>
      <template v-else>
        <v-flex fw-400 v-html="option.highlightedText">lala</v-flex>
      </template>
    </v-flex>

    <!-- SYNONYMS -->
    <v-flex :class="option.class"
            :key="option.value"
            :style="option.class.includes('collapsible expanded') ? {backgroundColor: 'var(--xl-grey)'} : ''"
            @click="handleClick(option)"
            v-for="(option, index) in synonymMatchData">

      <template v-if="option.class == 'conflict-synonym-title'">
        <v-layout justify-space-between fs-15 pl-3 fw-400>
          <v-flex grow>
            <span v-html="option.highlightedText" />
            <span class="conflict-meta"> - {{ option.meta }}</span>
          </v-flex>
          <v-flex shrink>
            {{ option.count }}
            <v-icon style="background-color:white; color:white; cursor: auto">keyboard_arrow_down</v-icon>
          </v-flex>
        </v-layout>
      </template>

      <template v-else-if="option.class.indexOf('conflict-synonym-title collapsible')==0">
        <v-layout justify-space-between fs-15 pl-3 fw-400>
          <v-flex grow>
            <span v-html="option.highlightedText"></span>
            <span class="conflict-meta"> - {{ option.meta }}</span>
          </v-flex>
          <v-flex v-if="option.class.includes('collapsible collapsed')" shrink>
            {{ option.count }}
            <v-icon class="negative-margin">keyboard_arrow_down</v-icon>
          </v-flex>
          <v-flex v-else shrink>
            {{ option.count }}
            <v-icon class="negative-margin">keyboard_arrow_up</v-icon>
          </v-flex>
        </v-layout>
      </template>

      <template v-else-if="option.class.indexOf('spinner') >= 0">
        <v-layout>
          <v-flex>
            <spinner className="mini" />
          </v-flex>
        </v-layout>
      </template>

      <template v-else>
        <v-layout>
          <v-flex  grow fw-400 v-html="option.highlightedText" />
        </v-layout>
      </template>
    </v-flex>

    <!-- COBRS PHONETIC -->
    <v-flex :class="option.class"
            :key="option.value"
            :style="option.class.includes('collapsible expanded') ? {backgroundColor: 'var(--xl-grey)'} : ''"
            @click="handleClick(option)"
            v-for="(option, index) in cobrsPhoneticData">

      <template v-if="option.class == 'conflict-cobrs-phonetic-title'">
        <v-layout justify-space-between fs-15 pl-3 fw-400>
          <v-flex grow> {{ option.text }} </v-flex>
          <v-flex shrink>
            {{ option.count }}
            <v-icon style="background-color:white; color:white; cursor: auto;">keyboard_arrow_down</v-icon>
          </v-flex>
        </v-layout>
      </template>

      <template v-else-if="option.class.indexOf('conflict-cobrs-phonetic-title collapsible')==0">
        <v-layout justify-space-between fs-15 pl-3 fw-400>
          <v-flex grow>
            <span>{{ option.text }}</span>
          </v-flex>
          <v-flex shrink  v-if="option.class.indexOf('collapsible collapsed') != -1">
            {{ option.count }}
            <v-icon class="negative-margin">keyboard_arrow_down</v-icon>
          </v-flex>
          <v-flex shrink  v-else>
            {{ option.count }}
            <v-icon class="negative-margin">keyboard_arrow_up</v-icon>
          </v-flex>
        </v-layout>
      </template>

      <template v-else-if="option.class.indexOf('spinner') >= 0">
        <v-layout>
          <v-flex>
            <spinner className="mini" />
          </v-flex>
        </v-layout>
      </template>

      <template v-else>
        <v-layout fs-15 pl-3 fw-400>
          <v-flex  v-html="option.highlightedText"></v-flex>
        </v-layout>
      </template>
    </v-flex>

    <!-- PHONETIC (EXPERIMENTAL) -->
    <v-flex :class="option.class"
            :key="option.value"
            @click="handleClick(option)"
            v-for="(option, index) in phoneticData">

      <template v-if="option.class == 'conflict-phonetic-title'">
        <v-layout justify-space-between fs-15 pl-3 fw-400>
          <v-flex grow>
            <span>{{ option.text }}</span>
          </v-flex>
          <v-flex shrink>
            {{ option.count }}
            <v-icon style="background-color:white; color:white; cursor: auto;">keyboard_arrow_down</v-icon>
          </v-flex>
        </v-layout>
      </template>

      <template v-else-if="option.class.indexOf('conflict-phonetic-title collapsible')==0">
        <v-layout justify-space-between fs-15 pl-3 fw-400>
          <v-flex grow>
            <span>{{ option.text }}</span>
          </v-flex>
          <v-flex shrink  v-if="option.class.indexOf('collapsible collapsed') != -1">
            {{ option.count }}
            <v-icon class="negative-margin">keyboard_arrow_down</v-icon>
          </v-flex>
          <v-flex v-else shrink>
            {{ option.count }}
            <v-icon class="negative-margin">keyboard_arrow_up</v-icon>
          </v-flex>
        </v-layout>
      </template>

      <template v-else-if="option.class.indexOf('spinner') >= 0">
        <v-layout>
          <v-flex>
            <spinner className="mini" />
          </v-flex>
        </v-layout>
      </template>

      <template v-else>
        <v-layout pl-3>
          <v-flex grow fw-400  v-html="option.highlightedText"></v-flex>
        </v-layout>
      </template>
    </v-flex>

  </v-layout>
</template>

<script>
/* eslint-disable */
  import spinner from '@/components/application/spinner.vue';

  export default {
    name: 'ConflictList',
    components: {
      spinner,
    },
    data() {
      return {
        selectedConflict: '',
        conflictEntries: [],
        selection: {class: ''}
      }
    },
    computed: {
      conflictData() {
        let data = [];
        data = data.concat(this.exactMatchData);
        data = data.concat(this.synonymMatchData);
        data = data.concat(this.cobrsPhoneticData);
        data = data.concat(this.phoneticData);

        this.conflictEntries = data;

        return data;
      },
      exactMatchData() {
        let data = [];

        // add Exact Match header & spinner
        data = data.concat([{ highlightedText: 'Exact Match', class: 'exact-match-title'}]);
        data = data.concat([{text: '', class: 'exact-match-spinner spinner-wrapper hidden'}]);

        // add Exact Match data
        if (this.$store.getters.exactMatchesConflicts && this.$store.getters.exactMatchesConflicts.length > 0) {
          data = data.concat(this.$store.getters.exactMatchesConflicts);
        }
        else {
          data = data.concat([{ highlightedText:'No Exact Match', class: 'conflict-no-match' }]);
        }

        return data;
      },
      synonymMatchData() {
        let data = [];

        // add Synonym Match header & spinner
        data = data.concat([{ highlightedText: 'Exact Word Order + Synonym Match', class: 'synonym-match-title'}]);
        data = data.concat([{text: '', class: 'synonym-match-spinner spinner-wrapper hidden'}]);

        // add Synonym Match data
        if (this.$store.getters.synonymMatchesConflicts && this.$store.getters.synonymMatchesConflicts.length) {
          data = data.concat(this.$store.getters.synonymMatchesConflicts);
        }
        else {
          data = data.concat([{ highlightedText:'No Match', class: 'conflict-no-match' }]);
        }

        return data;
      },
      cobrsPhoneticData() {
        let data = [];

        // add cobrs phonetic match header & spinner
        data = data.concat([{ highlightedText: 'Character Swap Match', class: 'cobrs-phonetic-match-title'}]);
        data = data.concat([{text: '', class: 'cobrs-phonetic-match-spinner spinner-wrapper hidden'}]);

        // add cobrs phonetic data
        if (this.$store.getters.cobrsPhoneticConflicts && this.$store.getters.cobrsPhoneticConflicts.length > 0) {
          data = data.concat(this.$store.getters.cobrsPhoneticConflicts);
        }
        else {
          data = data.concat([{ highlightedText:'No Match', class: 'conflict-no-match' }]);
        }

        return data;
      },
      phoneticData() {
        let data = [];

        // add phonetic match header & spinner
        data = data.concat([{ highlightedText: 'Phonetic Match (experimental)', class: 'phonetic-match-title'}]);
        data = data.concat([{text: '', class: 'phonetic-match-spinner spinner-wrapper hidden'}]);

        // add phonetic data
        if (this.$store.getters.phoneticConflicts && this.$store.getters.phoneticConflicts.length) {
          data = data.concat(this.$store.getters.phoneticConflicts);
        }
        else {
          data = data.concat([{ highlightedText:'No Match', class: 'conflict-no-match' }]);
        }

        return data;
      },
    },
    mounted() {
      this.selectedConflict = '';
      this.setSelectedConflict();
    },
    methods: {
      handleClick(option) {
        if (option.class.indexOf('conflict-synonym-title collapsible') == 0) {
          this.expand_collapse(option, 'synonym')
        }
        if (option.class.indexOf('conflict-cobrs-phonetic-title collapsible') == 0) {
          this.expand_collapse(option, 'cobrsPhonetic')
        }
        if (option.class.indexOf('conflict-phonetic-title collapsible') == 0) {
          this.expand_collapse(option, 'phonetic')
        }
        if (option.class.indexOf('conflict-result') == 0) {
          this.unselectPreviousSelection()
          option.class += ' conflict-result-selected'
          this.selection = option
          this.selectedConflict = option
          this.check_deselect()
        }
      },
      unselectPreviousSelection() {
        this.selection.class = this.selection.class.replace(' conflict-result-selected', '')
        this.conflictEntries
        for (let entry of this.conflictEntries) {
          if (entry.class.includes('conflict-result')) {
            entry.class = entry.class.replace(' conflict-result-selected', '')
          }
        }
      },
      expand_collapse(option, bucket) {
        let toggleIt = false
        if (bucket == 'synonym') {
          for (let i = 0; i < this.$store.getters.synonymMatchesConflicts.length; i++) {
            let entry = this.$store.getters.synonymMatchesConflicts[i]
            if (entry.class.indexOf('conflict-synonym-title collapsible') == 0) {
              if (entry.text == option.text) {
                toggleIt = true
                if (entry.class == 'conflict-synonym-title collapsible collapsed') {
                  entry.class = 'conflict-synonym-title collapsible expanded'
                } else {
                  entry.class = 'conflict-synonym-title collapsible collapsed'
                }
              } else {
                toggleIt = false
              }
            }
            if (entry.class.indexOf('conflict-result') != -1 && toggleIt) {
              if (entry.class.indexOf('conflict-result-hidden') != -1) {
                entry.class = entry.class.replace('conflict-result-hidden', 'conflict-result-displayed')
              } else {
                entry.class = entry.class.replace('conflict-result-displayed', 'conflict-result-hidden')
              }
            }
          }
        }
        if (bucket == 'cobrsPhonetic') {
          for (let i = 0; i < this.$store.getters.cobrsPhoneticConflicts.length; i++) {
            let entry = this.$store.getters.cobrsPhoneticConflicts[i]
            if (entry.class.indexOf('conflict-cobrs-phonetic-title collapsible') == 0) {
              if (entry.text == option.text) {
                toggleIt = true
                if (entry.class == 'conflict-cobrs-phonetic-title collapsible collapsed') {
                  entry.class = 'conflict-cobrs-phonetic-title collapsible expanded'
                } else {
                  entry.class = 'conflict-cobrs-phonetic-title collapsible collapsed'
                }
              } else {
                toggleIt = false
              }
            }
            if (entry.class.indexOf('conflict-result') != -1 && toggleIt) {
              if (entry.class.indexOf('conflict-result-hidden') != -1) {
                entry.class = entry.class.replace('conflict-result-hidden', 'conflict-result-displayed')
              } else {
                entry.class = entry.class.replace('conflict-result-displayed', 'conflict-result-hidden')
              }
            }
          }
        }
        if (bucket == 'phonetic') {
          for (let i = 0; i < this.$store.getters.phoneticConflicts.length; i++) {
            let entry = this.$store.getters.phoneticConflicts[i]
            if (entry.class.indexOf('conflict-phonetic-title collapsible') == 0) {
              if (entry.text == option.text) {
                toggleIt = true
                if (entry.class == 'conflict-phonetic-title collapsible collapsed') {
                  entry.class = 'conflict-phonetic-title collapsible expanded'
                } else {
                  entry.class = 'conflict-phonetic-title collapsible collapsed'
                }
              } else {
                toggleIt = false
              }
            }
            if (entry.class.indexOf('conflict-result') != -1 && toggleIt) {
              if (entry.class.indexOf('conflict-result-hidden') != -1) {
                entry.class = entry.class.replace('conflict-result-hidden', 'conflict-result-displayed')
              } else {
                entry.class = entry.class.replace('conflict-result-displayed', 'conflict-result-hidden')
              }
            }
          }
        }
      },
      check_deselect() {
        if (this.$store.getters.currentConflict === this.selectedConflict) {
          this.selectedConflict = '';
        }
      },
      setConflictInfo() {
        if (this.selectedConflict != '')
          this.$store.dispatch('getConflictInfo', this.selectedConflict);
      },
      setSelectedConflict() {
        // find first actual result in list - looking for exact match
        let exactMatch = this.conflictData.find(obj => {
          return obj.class.indexOf('conflict-exact-match') >= 0;
        });

        if (this.$store.getters.currentConflict == null && this.conflictData && exactMatch !== undefined) {
          this.selectedConflict = {
            class: exactMatch.class,
            text: exactMatch.text,
            highlightedText: exactMatch.highlightedText,
            source: exactMatch.source,
            nrNumber: exactMatch.nrNumber
          }
        }
        else if (this.$store.getters.currentConflict != null) {
          this.selectedConflict = this.$store.getters.currentConflict;
        }
      }

    },
    watch: {
      selectedConflict: {
        handler(value) {
          if (value && value.source)
            this.$store.commit('currentConflict', value);
          else
            this.$store.commit('currentConflict', null);
          this.setConflictInfo();
        }
      },
      conflictData: {
        handler() {
          this.$store.commit('currentConflict', null);
          this.setSelectedConflict();
        }
      }
    }
  }
</script>

<style scoped>
  #conflict-list {
    overflow-y: scroll !important;
    max-height: 480px !important;
  }

  .cobrs-phonetic-match-title {
    padding-left: 5px !important;
    height: 32px !important;
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

  .conflict-meta {
    text-transform: lowercase !important;
    font-weight: 400 !important;
    font-style: italic !important;
  }

  .conflict-no-match {
    color: #CCC;
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

  .conflict-result, .conflict-no-match {
    padding: 5px;
    padding-left: 40px;
    height: 32px !important;
  }

  .conflict-result-displayed {
	  display:block
  }

  .conflict-result-hidden {
	  display:none
  }

  .conflict-result-selected {
	  background-color: #3979bd;
	  color: white;
  }

  .conflict-synonym-title {
    padding: 5px;
    margin-top: 0;
    height: 32px !important;
    text-transform: uppercase;
    color: var(--text);
    font-weight: 400;
  }

  .conflict-title {
	  font-weight: 600;
  }

  .exact-match-title, .synonym-match-title, .cobrs-phonetic-match-title, .phonetic-match-title {
    background-color: var(--l-grey);
    font-weight: 600;
    padding: 5px 8px 5px 20px;
    color: var(--text);
    margin-bottom: 1px;
  }

  .phonetic-match-title {
    padding: 5px;
    margin-top: 5px;
    position: relative;
  }

  .spinner-wrapper:not(.hidden) + .conflict-no-match {
    display: none;
  }

  .conflict-result-displayed:hover {
    cursor: pointer !important;
  }

  .synonym-match-title {
    background-color: var(--l-grey);
    margin-top: 0;
  }

  /* when selected, highlight synonym matches in blue */
  #conflict-list option.conflict-result:checked {
    background: #b3d9ff linear-gradient(0deg, #b3d9ff 0%, #b3d9ff 100%);
  }
  #conflict-list:focus option.conflict-result:checked {
    background: #3979bd linear-gradient(0deg, #3979bd 0%, #3979bd 100%);
  }
  /* when selected, highlight exact match in red */
  #conflict-list option.conflict-exact-match:checked {
    background: #ff9999 linear-gradient(0deg, #ff9999 0%, #ff9999 100%);
  }
  #conflict-list:focus option.conflict-exact-match:checked {
    background: red linear-gradient(0deg, red 0%, red 100%);
  }
</style>
