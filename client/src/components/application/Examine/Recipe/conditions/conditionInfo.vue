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
      columns: [
        {title: 'Restricted Word', field: 'word', label: 'Word', sortable: false, visible: true},
        {title: 'Allow Use', field: 'allowUse', label: 'Allow', sortable: false, visible: true},
        {title: 'Consent Required', field: 'consentReq', label: 'Consent', sortable: false, visible: true},
        {title: 'Text', field: 'text', label: 'text', sortable: false, visible: true},
      ],
      pageSizeOptions: [5, 10, 15, 20],
      data: [],
      total: 0,
      query: {}
    }),
    mounted() {
      var conditionsInfo = this.$store.getters.conditionsJSON;
      var dataList = this.createDataList(conditionsInfo);
      this.data = dataList;
    },
    methods: {
        createDataList(conditionsInfo){
          var data = [];
          var wordIter;
          for (wordIter=0;wordIter<conditionsInfo.restricted_words_conditions.length; wordIter++) {
            var cndIter;
            for (cndIter=0;cndIter<conditionsInfo.restricted_words_conditions[wordIter].cnd_info.length; cndIter++) {
              var word = '';
              var allowUse;
              var consentReq;
              var text;
              if (cndIter == 0) {
                word = conditionsInfo.restricted_words_conditions[wordIter].word_info.phrase;
              }
              allowUse = conditionsInfo.restricted_words_conditions[wordIter].cnd_info[cndIter].allow_use;
              consentReq = conditionsInfo.restricted_words_conditions[wordIter].cnd_info[cndIter].consent_required;
              text = conditionsInfo.restricted_words_conditions[wordIter].cnd_info[cndIter].text;
              data.push({
                "word": word,
                "allowUse": allowUse,
                "consentReq": consentReq,
                "text": text,
              });
            }
          }
          return data;
        }
    }
  }
</script>

<style scoped>

</style>
