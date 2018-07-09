/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="row ConflictList">

        <select v-model="historyMatch" class="form-control" size="17" border="0"
                @change="setHistoryInfo()">
          <option v-for="option in historyJSON.names" :key="option.value"
            v-bind:value="{nrNumber: option.nr_num, text: option.name}">
            {{ option.name }}
          </option>
        </select>

      </div>

    </div>

  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: 'historyList',
    computed: {
      historyJSON() {
        console.log('historyJSON: ', this.$store.getters.historiesJSON);
        return this.$store.getters.historiesJSON;
      },
      // historyData() {
      //   console.log('historyList: ', this.historyList);
      //   return this.historyList;
      // },
      historyMatch: {
        get: function () {
          return '';
        },
        set: function (value) {
          this.$store.commit('historyMatch', value);
          this.tmp = value
        }
      }
    },
    // mounted() {
    //   console.log('HistoryInfo mounted');
    //   console.log(this.historyJSON);
    //   var historyList = this.makeHistoryList(this.historyJSON);
    // },
    methods: {
      setHistoryInfo() {
        console.log('setHistoryInfo with: ', this.tmp);
        this.$store.dispatch('getHistoryInfo', this.tmp);
      },
      // makeHistoryList(historyInfo) {
      //   console.log('makeHistoryList');
      //   console.log(historyInfo.names);
      //   //var highlighting =  historyInfo["highlighting"]
      //   //var response =  historyInfo["response"]
      //   var names =  historyInfo.names;
      //   console.log('makeHistoryList names array=' + names);
      //
      //   var k = 0;
      //   this.historyList = [];
      //   for (k=0; k<names.length;k++) {
      //     console.log(names[k]);
      //     this.historyList.push({
      //       nrNumber: names[k].nr_num,
      //       text: names[k].name
      //     });
      //   }
      //   console.log('makeHistoryList finished ' + k);
      //   console.log(this.historyList);
      //   console.log(this.historyData);
      // }
    }
  }
</script>

<style scoped>
</style>
