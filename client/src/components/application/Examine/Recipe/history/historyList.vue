<!--eslint-disable-->
<template>
  <div>
    <div class="container-fluid">
      <div class="row ConflictList">

        <select v-model="selectedHistory" class="form-control" size="17" border="0" @click="check_deselect">
          <option v-for="option in historyJSON.names"
                  v-bind:class="{fail: check_status(option)=='fail', concern: check_status(option)=='concern', pass: check_status(option)=='pass'}"
                  :key="option.value" v-bind:value="{id: option.id, name: option.name, score: option.score}">
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
    data: function() {
      return {
        selectedHistory: ''
      }
    },
    computed: {
      historyJSON() {
        console.log('json: ',this.$store.getters.historiesJSON)
        if (this.$store.getters.historiesJSON != null) {
          this.setSelectedHistory();
          return this.$store.getters.historiesJSON;
        } else {
          return {'names': []};
        }
      },
    },
    methods: {
      setHistoryInfo() {
        console.log('setHistoryInfo with: ', this.selectedHistory);
        if (this.selectedHistory != '')
          this.$store.dispatch('getHistoryInfo', this.selectedHistory);
      },
      setSelectedHistory() {
        console.log('setting selected history');
        if (this.$store.getters.currentHistory != null)
          this.selectedHistory = this.$store.getters.currentHistory;
        else
          this.selectedHistory = this.$store.getters.historiesJSON.names[0];
      },
      check_deselect() {
        if (this.$store.getters.currentHistory === this.selectedHistory)
          this.selectedHistory='';
      },
      check_status(option) {
        console.log(option);
        let test = Math.random()
        if (test > 0.5) {
          return 'pass'
        } else if (test > 0.25) {
          return 'concern'
        } else {
          return 'fail'
        }
        return true;
      }
    },
    watch: {
      selectedHistory: {
        handler(selection) {
          console.log('currentHistory set: ',selection);
          this.$store.commit('currentHistory', selection);
          this.setHistoryInfo();
        }
      },
    }
  }
</script>

<style scoped>
  .pass {
    background-color: #28a745;
  }
  .concern {
    background-color: #ffc107;
  }
  .fail {
    background-color: #ff9999;
  }
</style>
