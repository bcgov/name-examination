<!--eslint-disable-->
<template>
  <div>
    <div class="container-fluid">
      <div class="row conflict-List-view">

        <select v-model="selectedConflict" class="form-control" size="17" border="0"
                @click="check_deselect">
          <option v-for="option in conflictData" :key="option.value"
            v-bind:value="{nrNumber: option.nrNumber, text: option.text, source: option.source}">
            {{ option.text }}
          </option>
        </select>

      </div>

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
        if (this.$store.getters.currentConflict == null && this.$store.getters.conflictList != null)
          this.selectedConflict = this.$store.getters.conflictList[0];
        else
          this.selectedConflict = this.$store.getters.currentConflict;
        return this.$store.getters.conflictList;
      },
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
      // setConflicts(state,conflictJSon) {
      //   console.log('setting conflict values')
      //   //TODO - this isn't called here yet, it still resides in the store
      //
      //   //3 sections from the solr json array :
      //   // Highlights : used for colouring results
      //   // Names : the actual names found that might be conflicting
      //   // Response : statistics on the results found; max score; number of conflicts found;
      //   state.conflictHighlighting =  conflictJSon['highlighting']
      //   state.conflictNames =  conflictJSon['names']
      //   state.conflictResponse =  conflictJSon['response']
      //
      //   var k
      //   var c = 0
      //   state.conflictList = new Array()
      //   for( k in state.conflictNames) {
      //     var mID = state.conflictNames[c].id
      //     //Iterate through the list of names to create a new object that has the fields needed
      //     //state.conflictList.push({nrNumber: mID, text: conflictJSon['highlighting'][mID]['name'][0]})
      //     state.conflictList.push({nrNumber: mID, text: state.conflictNames[c].name, source: state.conflictNames[c].source})
      //     c++
      //   }
      // },

    },
    watch: {
      selectedConflict: {
        handler(value) {
          this.$store.commit('currentConflict', value);
          this.setConflictInfo();
        }
      }
    }
  }
</script>

<style scoped>
  .conflict-List-view {
    /*background-color: #000000;*/
    padding: 10px;
  }
</style>
