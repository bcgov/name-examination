<!--eslint-disable-->
<template>

    <div class="col conflict-list-parent-col">
      <div class="row conflict-list-view">
        <select id="conflict-list" v-if="conflictData.length > 0"  v-model="selectedConflict" class="form-control" size="17" border="0"
                @click="check_deselect" tabindex="2">
          <option v-for="(option, index) in conflictData" :key="option.value" :class="option.class"
            v-bind:value="{nrNumber: option.nrNumber, text: option.text, source: option.source, index: index}"
            v-bind:disabled="!option.source"
          >
            {{ option.text }}
          </option>

        </select>
        <div v-else class="empty-list">( No data )</div>

      </div>

    </div>

</template>

<script>
/* eslint-disable */
  export default {
    name: 'ConflictList',
    data: function () {
      return {
        selectedConflict: '',
      }
    },
    computed: {
      conflictData() {

        var data = [];

        // add Exact Match header
        data = data.concat([{ text: 'Exact Match', class: 'exact-match-title'}]);

        // add Exact Match data
        if (this.$store.getters.exactMatchesConflicts && this.$store.getters.exactMatchesConflicts.length > 0) {
          data = data.concat(this.$store.getters.exactMatchesConflicts);
        }
        else {
          data = data.concat([{ text:'No Exact Match', class: 'conflict-no-match' }]);
        }

        // add Synonym Match header
        data = data.concat([{ text: 'Exact Word Order + Synonym Match', class: 'synonym-match-title'}]);

        // add Synonym Match data
        if (this.$store.getters.synonymMatchesConflicts && this.$store.getters.synonymMatchesConflicts.length)
          data = data.concat(this.$store.getters.synonymMatchesConflicts);
        else
          data = data.concat([{ text:'No Match', class: 'conflict-no-match' }]);
        return data;
      },
    },
    mounted() {
      this.selectedConflict = '';
      this.setSelectedConflict();
    },
    methods: {
      check_deselect() {
        if (this.$store.getters.currentConflict === this.selectedConflict)
          this.selectedConflict='';
      },
      setConflictInfo() {
        if (this.selectedConflict != '')
          this.$store.dispatch('getConflictInfo', this.selectedConflict);
      },
      setSelectedConflict() {
        if (this.$store.getters.currentConflict == null && this.conflictData &&
          this.conflictData.length > 1 && this.conflictData[1].source
        ) {
          this.selectedConflict = {
              index:1,
              text:this.conflictData[1].text,
              source:this.conflictData[1].source,
              nrNumber:this.conflictData[1].nrNumber
          }
        }
        else if (this.$store.getters.currentConflict != null)
          this.selectedConflict = this.$store.getters.currentConflict;
      }

    },
    watch: {
      selectedConflict: {
        handler(value) {
          console.log('selectedConflict watcher fired: ', value)
          if (value && value.source)
            this.$store.commit('currentConflict', value);
          else
            this.$store.commit('currentConflict', null);
          this.setConflictInfo();
        }
      },
      conflictData: {
        handler() {
          console.log('conflict data watcher fired')
          this.$store.commit('currentConflict', null);
          this.setSelectedConflict();
        }
      }
    }
  }
</script>

<style scoped>
  .conflict-list-parent-col {
    min-width: 800px;
  }

  .conflict-list-view {
    padding: 0 10px;
    height: 100%;
  }

  .exact-match-title, .synonym-match-title {
    background-color: #dedede;
    font-weight: bold;
    padding: 8px 5px;
    color: black;
  }
  .synonym-match-title {
    margin-top: 10px;
  }

  .conflict-synonym-title {
    padding: 5px;
    margin-top: 5px;
    text-transform: uppercase;
    font-weight: bold;
    color: black;
  }

  .conflict-result, .conflict-no-match {
    padding: 5px;
    padding-left: 40px;
  }

  .conflict-no-match {
    color: #CCC;
  }

  .conflict-result {
    color: #3979bd;
  }

  .conflict-exact-match {
    color: red;
    font-weight: bold;
  }

  /* when selected, highlight synonym matches in blue */
  .conflict-list-view option.conflict-result:checked {
    background: #3979bd linear-gradient(0deg, #3979bd 0%, #3979bd 100%);
  }
  /* when selected, highlight exact match in red */
  .conflict-list-view option.conflict-exact-match:checked {
    background: red linear-gradient(0deg, red 0%, red 100%);
  }

  h3, h2 {
    font-size: 15px;
  }

  p {
    font-size: 14px;
  }

</style>
