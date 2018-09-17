/* eslint-disable */
<template>
  <span v-on:click="setSelection($event);">
    <datatable v-bind="$data"/>
  </span>
</template>

<script>
/* eslint-disable */

  export default {
    name: 'conditionInfo',
    data: () => ({
      fixHeaderAndSetBodyMaxHeight: 300,
      tblStyle: 'table-layout: fixed',
      tblClass: 'table-bordered',
      columns: [
        {title: 'Restricted Word', field: 'word', label: 'Word', thStyle: {background: '#fffae6'},colStyle: {width:'150px'}, sortable: false, visible: true},
        {title: 'Allow Use', field: 'allowUse', label: 'Allow', thStyle: {background: '#fffae6'}, colStyle: {width:'75px'}, sortable: false, visible: true},
        {title: 'Consent Required', field: 'consentReq', label: 'Consent', thStyle: {background: '#fffae6'}, colStyle: {width:'75px'}, sortable: false, visible: true},
        {title: 'Examiner Information', field: 'text', label: 'text', thStyle: {background: '#fffae6'}, colStyle: {width:'300px'}, sortable: false, visible: true},
        {title: 'Customer Instructions', field: 'instructions', label: 'instructions', thStyle: {background: '#fffae6'}, colStyle: {width:'300px'}, sortable: false, visible: true},
      ],
      pageSizeOptions: [5, 10, 15, 20],
      data: [],
      total: 0,
      query: {}
    }),
    computed: {
      currentCondition: {
        get: function () {
          return this.$store.getters.currentCondition;
        },
        set: function (value) {
          this.$store.commit('currentCondition', value);
        }
      },
      conditionsInfo() {
        return this.$store.getters.conditionsJSON;
      }
    },
    mounted() {
      this.data = this.createDataList(this.conditionsInfo);
    },
    methods: {
      //goes through the JSON with conditions info and returns each restricted word and their conditions in a list
        createDataList(conditionsInfo, rows=10, offset=0){

          if (conditionsInfo.restricted_words_conditions == undefined) {
            this.total = 0;
            return [];
          }

          // looping through each word and its list of conditions
          var data = [];

          for (let wordIter=offset;wordIter<conditionsInfo.restricted_words_conditions.length && wordIter<rows+offset; wordIter++) {

            var word = conditionsInfo.restricted_words_conditions[wordIter].word_info.phrase;
            var allowUse = '';
            var consentReq = '';
            var text = '';
            var instructions = '';

            // looping through the list of conditions for each word (some words have more than 1 possible condition)
            for (let cndIter=0;cndIter<conditionsInfo.restricted_words_conditions[wordIter].cnd_info.length; cndIter++) {

              allowUse = conditionsInfo.restricted_words_conditions[wordIter].cnd_info[cndIter].allow_use;
              consentReq = conditionsInfo.restricted_words_conditions[wordIter].cnd_info[cndIter].consent_required;
              instructions = conditionsInfo.restricted_words_conditions[wordIter].cnd_info[cndIter].instructions;
              text = conditionsInfo.restricted_words_conditions[wordIter].cnd_info[cndIter].text;

              // if there is more than 1 condition for the word:
              if (conditionsInfo.restricted_words_conditions[wordIter].cnd_info.length > 1) {
                if (cndIter != 0) word = '';
                if (cndIter < conditionsInfo.restricted_words_conditions[wordIter].cnd_info.length-1) {
                  data.push({
                    "word": word,
                    "allowUse": allowUse,
                    "consentReq": consentReq,
                    "text": text,
                    "instructions": instructions,
                  });
                }
              }
            }
            // add row to table
            data.push({
              "word": word,
              "allowUse": allowUse,
              "consentReq": consentReq,
              "text": text,
              "instructions": instructions,
            });
          }
          // returns a list of json-like params for the datatable -> each element in the list is a row
          this.total = conditionsInfo.restricted_words_conditions.length;
          return data;
        },
      setSelection(event) {
        // check if this is a body row (ie: in tbody)
        var row = $(event.target).closest('tr')[0];
        if (row !== undefined) {
          if (row.parentNode.tagName == 'TBODY') {

            // remove any other row's "selected" status, then add "selected" to this row
            $(row).closest('tbody').find('tr').removeClass('selected');
            $(row).addClass('selected');

            // save version of this record with word, text, and instructions to be used to pick out
            // correct condition in decision dropdown
            this.currentCondition = {
              word: row.children[0].innerHTML.trim(),
              allow_use: row.children[1].innerHTML.trim(),
              consent_required: row.children[2].innerHTML.trim(),
              text: row.children[3].innerHTML.trim(),
              instructions: row.children[4].innerHTML.trim(),
            }
          } else {
            // do nothing
          }
        } else {
          // do nothing
        }
      }
    },
    watch: {
      conditionsInfo: function (val) {
        console.log('conditionsInfo watcher fired: ', val);
        if (val != null)
          this.data = this.createDataList(val);
        else {
          this.data = [];
          this.total = 0;
        }
      },
      query: {
        handler (val) {
          console.log('conditions query watcher fired: ', val);
          if (this.conditionsInfo != null)
            this.data = this.createDataList(this.conditionsInfo, val.limit, val.offset);
          else {
            this.data = [];
            this.total = 0;
          }
        },
        deep: true
      }
    }
  }
</script>

<style scoped>
  .small {
    color: #c69500;
    width: 50px;
  }
</style>

<!-- unscoped style -->
<style>

  .table-striped tbody tr.selected {
    background-color: #ffa;
  }
</style>
