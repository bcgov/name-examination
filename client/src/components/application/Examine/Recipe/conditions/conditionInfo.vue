/* eslint-disable */
<template>
      <table id="restrictedWords">
        <tr>
          <th>Word</th>
          <th>Allow Use</th>
          <th>Consent Required</th>
          <th>Condition Text</th>
        </tr>
        <tr>
          <td>{{testWord}}</td>
          <td>{{testAU}}</td>
          <td>{{testCR}}</td>
          <td>{{testCT}}</td>
        </tr>
      </table>
</template>

<script>
/* eslint-disable */

  export default {
    name: 'conditionInfo',
    computed: {

      testWord() {
        var conditions = this.$store.getters.conditionsJSON
        if (conditions != null) {
          return conditions;
        }
        else {
          return 'no rws';
        }
      },
      testAU() {
        return 'Y';
      },
      testCR() {
        return 'Y';
      },
      testCT() {
        return 'bla bla';
      }
    },
    mounted() {
      this.createRows();
    },
    methods: {
      createRows() {
        var cnds = {'restricted_words':[{'word_info': {'phrase': 'word1', 'id': '1'}, 'cnd_info':{'id':'2',
              'text':'bla bla', 'allow_use': 'Y', 'consent_required': 'Y', 'instructions':'?'}},{'word_info': {'phrase': 'word2', 'id': '1'}, 'cnd_info':{'id':'2',
              'text':'bla bla', 'allow_use': 'Y', 'consent_required': 'Y', 'instructions':'?'}},{'word_info': {'phrase': 'word3', 'id': '1'}, 'cnd_info':{'id':'2',
              'text':'bla bla', 'allow_use': 'Y', 'consent_required': 'Y', 'instructions':'?'}},{'word_info': {'phrase': 'word4', 'id': '1'}, 'cnd_info':{'id':'2',
              'text':'bla bla', 'allow_use': 'Y', 'consent_required': 'Y', 'instructions':'?'}},{'word_info': {'phrase': 'word', 'id': '1'}, 'cnd_info':{'id':'2',
              'text':'bla bla', 'allow_use': 'Y', 'consent_required': 'Y', 'instructions':'?'}},{'word_info': {'phrase': 'word', 'id': '1'}, 'cnd_info':{'id':'2',
              'text':'bla bla', 'allow_use': 'Y', 'consent_required': 'Y', 'instructions':'?'}},{'word_info': {'phrase': 'word', 'id': '1'}, 'cnd_info':{'id':'2',
              'text':'bla bla', 'allow_use': 'Y', 'consent_required': 'Y', 'instructions':'?'}},{'word_info': {'phrase': 'word', 'id': '1'}, 'cnd_info':{'id':'2',
              'text':'bla bla', 'allow_use': 'Y', 'consent_required': 'Y', 'instructions':'?'}},{'word_info': {'phrase': 'word', 'id': '1'}, 'cnd_info':{'id':'2',
              'text':'bla bla', 'allow_use': 'Y', 'consent_required': 'Y', 'instructions':'?'}},{'word_info': {'phrase': 'word', 'id': '1'}, 'cnd_info':{'id':'2',
              'text':'bla bla', 'allow_use': 'Y', 'consent_required': 'Y', 'instructions':'?'}},{'word_info': {'phrase': 'word', 'id': '1'}, 'cnd_info':{'id':'2',
              'text':'bla bla', 'allow_use': 'Y', 'consent_required': 'Y', 'instructions':'?'}}]}
        var table = document.getElementById("restrictedWords");
        var i;
        for (i=0;i<cnds.restricted_words.length;i++) {
          var row = table.insertRow(i+1);
          var word = row.insertCell(0);
          var allowUse = row.insertCell(1);
          var consentRequired = row.insertCell(2);
          var text = row.insertCell(3);
          word.innerHTML = cnds.restricted_words[i].word_info.phrase;
          allowUse.innerHTML = cnds.restricted_words[i].cnd_info.allow_use;
          consentRequired.innerHTML = cnds.restricted_words[i].cnd_info.consent_required;
          text.innerHTML = cnds.restricted_words[i].cnd_info.text;
        }
      }
    }
  }
</script>

<style scoped>
  #restrictedWords {
    border-collapse: collapse;
    width: 100%;
  }
  #restrictedWords td, #restrictedWords th {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }
  #restrictedWords th {
    background-color: #ffffcc;
  }
</style>
