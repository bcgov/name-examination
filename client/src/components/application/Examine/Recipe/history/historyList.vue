<!--eslint-disable-->
<template>
  <div>
    <div class="container-fluid">
      <div class="row ConflictList">

        <select v-model="selectedHistory" class="form-control" size="17" border="0" @click="check_deselect">
          <option style="margin: 1px" v-for="option in historyJSON.names"
                  v-bind:class="{fail: check_status(option)=='fail', concern: check_status(option)=='concern'}"
                  :key="option.value" v-bind:value="{ name_state_type_cd: option.name_state_type_cd, submit_count: option.submit_count, nr_num: option.nr_num, name: option.name, score: option.score}">
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
        if (this.selectedHistory != '') {
          this.$store.dispatch('resetHistoriesInfo');
          this.$store.dispatch('getHistoryInfo', this.selectedHistory);
        }
      },
      setSelectedHistory() {
        if (this.$store.getters.currentHistory != null)
          this.selectedHistory = this.$store.getters.currentHistory;
        else
          this.selectedHistory = this.$store.getters.historiesJSON.names[0];
      },
      check_deselect() {
        if (this.$store.getters.currentHistory === this.selectedHistory) {
          this.selectedHistory = '';
          this.$store.dispatch('resetHistoriesInfo');
        }
      },
      check_status(option) {
        if (option.submit_count < 4 && option.name_state_type_cd!='R') {
          return 'concern'
        } else {
          return 'fail'
        }
      },
    },
    watch: {
      selectedHistory: {
        handler(selection) {
          if (this.check_status(selection) == 'concern') {
            $("#historyInfo").removeClass();
            $("#historyInfo").addClass("col history-info-view border-concern");
            $("#currentHistoryName").removeClass();
            $("#currentHistoryName").addClass("concern");
          }
          else {
            $("#historyInfo").removeClass();
            $("#historyInfo").addClass("col history-info-view border-fail");
            $("#currentHistoryName").removeClass();
            $("#currentHistoryName").addClass("fail");
          }
          this.$store.commit('currentHistory', selection);
          this.setHistoryInfo();
        }
      },
    }
  }
</script>

<style scoped>
</style>
<style>
  .concern {
    background-color: #ffe680;
  }
  .fail {
    background-color: #ff9999;
  }
  .border-fail {
    border: 1px solid #ff9999;
  }
  .border-concern {
    border: 1px solid #ffe680;
  }
</style>
