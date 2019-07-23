<!--eslint-disable-->
<template>
  <v-container fluid ma-0 pa-0>
    <spinner className="history-spinner hidden" />
    <v-layout id="history-list-view" ma-0 pa-0>
      <v-flex v-if="historiesJSON.length > 0">
        <v-data-table :headers="headers"
                      :items="historiesJSON"
                      class="conditions-table-style"
                      hide-actions>
          <template v-slot:items="props">
            <tr :active="props.item.nr_num == currentNrNum"
                @click="setHistoryInfo(props.item)">
              <td class="text-xs-left history-item">{{ props.item.name }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
  import spinner from '@/components/application/spinner.vue';

  export default {
    name: 'HistoryList',
    components: {
      spinner,
    },
    data: function() {
      return {
        headers: [
          { text: 'Name', value: 'name', align: 'left', sortable: false, },
        ],
      }
    },
    computed: {
      historiesJSON() {
        if (this.$store.getters.historiesJSON && this.$store.getters.historiesJSON.names) {
          return this.$store.getters.historiesJSON.names;
        } else {
          return []
        }
      },
      currentNrNum() {
        if (this.currentHistory && this.currentHistory.nr_num) return this.currentHistory.nr_num
        return null
      },
      currentHistory: {
        get() {
          if (this.$store.getters.currentHistory) return this.$store.getters.currentHistory
          return null
        },
        set(item) {
          this.$store.commit('currentHistory', item)
        }
      },
    },
    watch: {
      currentHistory: {
        handler(selection) {
          if (selection != undefined) {
            if (this.check_status(selection) == 'pass') {
              $("#historyInfo").removeClass();
              $("#historyInfo").addClass("col history-info-view border-pass");
              $("#currentHistoryName").removeClass();
              $("#currentHistoryName").addClass("pass");
            } else {
              $("#historyInfo").removeClass();
              $("#historyInfo").addClass("col history-info-view border-fail");
              $("#currentHistoryName").removeClass();
              $("#currentHistoryName").addClass("fail");
            }
          } else {
            $("#historyInfo").removeClass();
            $("#historyInfo").addClass("col history-info-view border-fail");
          }
        }
      },
    },
    methods: {
      setHistoryInfo(item) {
        if (this.currentNrNum && item.nr_num == this.currentNrNum) {
          this.currentHistory = ''
          this.$store.dispatch('resetHistoriesInfo')
          return
        }
        this.currentHistory = item
        this.$store.dispatch('resetHistoriesInfo')
        this.$store.dispatch('getHistoryInfo', item);
      },
      check_status(item) {
        if (item.submit_count < 4 && ( item.name_state_type_cd != 'R' )) {
          return 'pass'
        } else {
          return 'fail'
        }
      },
    },
  }
</script>

<style scoped>
</style>
<style>

  /* hide the panel content when spinner is showing, ie: results are loading */
  .spinner:not(.hidden) ~ #history-list-view {
    display: none;
  }

  .history-list-view option {
    padding: 5px;
  }

  .pass {
    background-color: #b6d7a8;
  }

  .concern {
    background-color: #ffe680;
  }

  .fail {
    background-color: #ea9999;
  }

  .border-fail {
    border: 1px solid #ea9999;
  }

  .border-concern {
    border: 1px solid #ffe680;
  }

  .border-pass {
    border: 1px solid #b6d7a8;
  }
</style>
