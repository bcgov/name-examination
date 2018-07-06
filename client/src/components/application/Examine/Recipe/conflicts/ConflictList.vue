/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="row ConflictList">

        <select v-model="conflictMatch" class="form-control" size="17" border="0"
                @change="setConflictInfo()">
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
        tmp: null,
      }
    },
    computed: {
      conflictData() {
        return  this.$store.getters.conflictList;
      },
      conflictMatch:  {
        get: function() {
          return '';
        },
        set: function(value) {
          console.log('set current conflict');
          console.log(value);
          this.$store.commit('currentConflict', value);
          console.log(this.$store.state.currentConflict);
          this.tmp = value
        }
      }
    },
    methods: {
      setConflictInfo() {
        console.log('setConflictInfo')
        this.$store.dispatch('getConflictInfo', this.tmp)
      },
      setConflicts(state,conflictJSon) {
        console.log('setting conflict values')
        //TODO - this isn't called here yet, it still resides in the store

        //3 sections from the solr json array :
        // Highlights : used for colouring results
        // Names : the actual names found that might be conflicting
        // Response : statistics on the results found; max score; number of conflicts found;
        state.conflictHighlighting =  conflictJSon['highlighting']
        state.conflictNames =  conflictJSon['names']
        state.conflictResponse =  conflictJSon['response']

        var k
        var c = 0
        state.conflictList = new Array()
        for( k in state.conflictNames) {
          var mID = state.conflictNames[c].id
          //Iterate through the list of names to create a new object that has the fields needed
          //state.conflictList.push({nrNumber: mID, text: conflictJSon['highlighting'][mID]['name'][0]})
          state.conflictList.push({nrNumber: mID, text: state.conflictNames[c].name, source: state.conflictNames[c].source})
          c++
        }
      },

    }
  }
</script>

<style scoped>
</style>
