/* eslint-disable */
<template>
  <span>
    <datatable v-bind="$data" />
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
    mounted() {
      var conditionsInfo = this.$store.getters.conditionsJSON;
      var dataList = this.createDataList(conditionsInfo);
      if (dataList.length == 0) {dataList.push()}
      this.data = dataList;
    },
    methods: {
      //goes through the JSON with conditions info and returns each restricted word and their conditions in a list
        createDataList(conditionsInfo){

          // looping through each word and its list of conditions
          var data = [];
          var wordIter;
          for (wordIter=0;wordIter<conditionsInfo.restricted_words_conditions.length; wordIter++) {

            // looping through the list of conditions for each word (some words have more than 1 possible condition)
            var cndIter;
            for (cndIter=0;cndIter<conditionsInfo.restricted_words_conditions[wordIter].cnd_info.length; cndIter++) {

              // these params are the ones being displayed in the conditions table
              var word = '';
              var allowUse;
              var consentReq;
              var text;
              var instructions;
              if (cndIter == 0) {
                word = conditionsInfo.restricted_words_conditions[wordIter].word_info.phrase;
              }
              allowUse = conditionsInfo.restricted_words_conditions[wordIter].cnd_info[cndIter].allow_use;
              consentReq = conditionsInfo.restricted_words_conditions[wordIter].cnd_info[cndIter].consent_required;
              instructions = conditionsInfo.restricted_words_conditions[wordIter].cnd_info[cndIter].instructions;
              text = conditionsInfo.restricted_words_conditions[wordIter].cnd_info[cndIter].text;
              data.push({
                "word": word,
                "allowUse": allowUse,
                "consentReq": consentReq,
                "text": text,
                "instructions": instructions,
              });
            }
          }
          // returns a list of json-like params for the datatable -> each element in the list is a row
          return data;
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
