/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="row ConflictList">

        <select v-model="historyMatch" class="form-control" size="17" border="0"
                @change="setHistoryInfo()">
          <option v-for="option in historyList" :key="option.value"
            v-bind:value="{nrNumber: option.nrNumber, text: option.text}">
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
    name: 'historyList',
    computed: {
      historyJSON() {
        return this.$store.getters.historiesJSON;
      },
      historyData() {
            return this.historyList
      },
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
    mounted() {
      console.log('HistoryInfo mounted')
      var historyList = this.makeHistoryList(this.historyJSON);
    },
    methods: {
      setHistoryInfo() {
        console.log('setHistoryInfo')
        this.$store.dispatch('getHistoryInfo', this.tmp)
      },
      makeHistoryList(historyInfo) {
        console.log('makeHistoryList')
        //var highlighting =  historyInfo["highlighting"]
        //var response =  historyInfo["response"]
        var names =  historyInfo["names"]
        console.log('makeHistoryList names array=' + names)

        var k = 0
        this.historyList = new Array()
        for (var histName in names) {
          this.historyList.push({
            nrNumber: histName.nr_num,
            text: histName.name
          })
          k++
        }
        console.log('makeHistoryList finished ' + k)
      }
    }
  }
</script>

<style scoped>
</style>
