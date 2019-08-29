<!--eslint-disable-->
<template>
<v-container id="stats-viewer" style="min-width: 99.5%; max-width: 99.5%">
  <v-layout pt-3 px-3 align-center>
    <v-flex grow px-1><h1>Statistics</h1></v-flex>
    <v-flex shrink mx-2 fs-14>hours:</v-flex>
    <v-flex shrink>
      <v-form @submit.prevent="getPagedStats">
        <v-text-field class="text-input-style"
                      ref="numberinput"
                      type="number"
                      v-model="timespan" />
      </v-form>
    </v-flex>
    <v-flex shrink>
      <v-btn flat
             class="yellow-button"
             @click="getPagedStats">Get Stats</v-btn>
    </v-flex>
  </v-layout>
  <v-layout pa-3>
    <v-flex pb-3 mb-3>
      <v-data-table :headers="fields"
                    header-key="key"
                    header-text="label"
                    :items="requests"
                    hide-actions>
        <template v-slot:headers="{ headers }">
          <tr>
            <th v-for="(header, i) in headers"
                :style="header.style"
                class="header-cell-style text-left"
                :key="`stats-th-${i}`">
              {{ header.label }}
            </th>
          </tr>
        </template>
        <template v-slot:items="{item, index}">
          <tr :style="index % 2 === 0 ? { backgroundColor: 'white' } : { backgroundColor: 'var(--xl-grey)' }">
            <td class="py-2">
              <v-container fluid ma-0 pa-0>
                <v-layout>
                  <v-flex fw-700 fs-15 my-2>{{ item.nrNum }}</v-flex>
                </v-layout>
                <v-layout v-for="(name, i) in item.names"
                          wrap
                          :key="`names-layout-${i}`">
                  <v-flex fs-14
                          style="font-weight: 600"
                          lg12 ml-2 mb-2>
                    {{ i + 1 }}. {{ name.name }}<span :class="getClass(name.state)" class="mx-2">{{ name.state }}</span>
                  </v-flex>
                  <v-layout fs-13 column>
                    <v-flex v-for="text in name.decision_text"
                            :key="`decision-text-flex-${i}`"
                            ft-ital mb-2 ml-4>{{ text }}</v-flex>
                  </v-layout>
                </v-layout>
                <v-layout v-if="item.comments.length > 0"
                          ml-2 mt-1 dk-grey fs-14 fw-600>LAST COMMENT</v-layout>
                <v-layout v-if="item.comments.length > 0"
                          dk-grey ml-2 mb-2 wrap>
                  <v-flex lg12 indent-10px>{{ item.comments[0].comment }}</v-flex>
                  <v-flex lg12 ft-ital indent-10px>
                    –{{ item.comments[0].examiner ? item.comments[0].examiner : 'unknown examiner' }},
                    {{ formatDate(item.comments[0].timestamp) }}
                  </v-flex>
                </v-layout>
              </v-container>
            </td>
            <td class="py-2" :class="getClass(item.stateCd)">
              {{ item.stateCd }}
            </td>
            <td class="py-2">
              {{ item.lastUpdate }}
            </td>
            <td class="py-2">
              {{ item.activeUser }}
            </td>
            <td class="py-2">{{ item.furnished }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script defer>
/* eslint-disable */
import axios from '@/axios-auth'
import moment from 'moment'

export default {
  name: 'stats',
  data() {
    return {
      timespan: 1, // number of hours back to look at
      requests: [],
      numRecords: null,
      currentPage: 1,
      perPage: 50,
      totalRows: null,
      fields: [
        {
          key: 'nrdetails',
          label: "Request Details",
          style: {width: '64%'}
        },
        {
          key: 'stateCd',
          label: 'Status',
          style: {width: '7%'}
        },
        {
          key: 'lastUpdate',
          label: 'Last Update',
          style: {width: '14%'}
        },
        {
          key: 'activeUser',
          label: 'Active User',
          style: {width: '10%'}
        },
        {
          key: 'furnished',
          label: "Back to NRO?",
          style: {width: '5%'}
        }
      ]
    }
  },
  mounted() {
    if (this.$refs.numberinput) his.$refs.numberinput.focus()
  },
  computed: {
    timespanHuman() {

      var retval = '';
      var tempTimespan = this.timespan;

      // days
      if (tempTimespan >= 24) {
        var days = Math.floor(tempTimespan / 24);
        retval += days + ' days ';
        tempTimespan = tempTimespan - (days * 24);
      }

      // hours
      if (tempTimespan >= 1) {
        retval += tempTimespan + ' hours ';
      }

      return retval;
    }
  },
  methods: {
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD, h:mm a')
    },
    getClass(state) {
      if (state === 'APPROVED') {
        return 'c-accepted'
      }
      if (state === 'REJECTED') {
        return 'rejected'
      }
      if (state === 'CONDITION' || state === 'CONDITIONAL') {
        return 'c-gold'
      }
    },
    getPagedStats() {
      this.requests = []
      if (this.currentPage === 0) this.currentPage = 1

      let params = '';
      if (this.timespan != '' && this.timespan != null) {
        params = '?timespan=' + this.timespan
      } else {
        params = '?timespan=1'
      }

      let currentPage = '&currentpage=' + this.currentPage
      let pageSize = '&perpage=' + this.perPage
      let url = '/api/v1/requests/stats' + params + currentPage + pageSize
      axios.get(url, {headers:
        {Authorization: `Bearer ${sessionStorage.getItem('KEYCLOAK_TOKEN')}`}
      }).then(response => {
        if (response.data && response.data.numRecords > 0) {
          let requests = response.data.nameRequests

          // sort names by choice number
          let r = requests.map((request) => {
            request.names = this.sortNames(request.names)
            request.lastUpdate = this.convertDate(request.lastUpdate)
            let regx1 = /\n\n/
            request.names.forEach(name => {
              if (name.decision_text) {
                name.decision_text = name.decision_text.split(regx1)
              }
            })
            return request
          })

          this.numRecords = response.data.numRecords
          this.requests = r
        }
      })
    },
    sortNames(data) {
      function compare(a,b) {
        if (a.choice < b.choice)
          return -1;
        if (a.choice > b.choice)
          return 1;
        return 0;
      }
      return data.sort(compare)
    },
    convertDate(thedate) {
        return new Date(thedate).toLocaleString('en-ca',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',year:'numeric'});
    },
    pageChanged(page) {
      this.currentPage = page
    }
  },
}
</script>

<style scoped>
  td {
    vertical-align: top !important;
  }

  .header-cell-style {
    background-color: var(--d-blue);
    color: white !important;
    height: 50px;
    font-size: 14px;
    font-weight: 700;
  }

  .indent-10px {
    padding-left: 10px;
  }
  .yellow-button {
    background-color: var(--gold);
    color: white;
    height: 38px;
    font-weight: 700 !important;
    padding: 0;
    margin: 0;
  }

  .text-pre-line {
    white-space: pre-line;
  }

  .text-input-style {
    height: 38px;
    border: 1px solid var(--outline);
    background-color: white;
    margin: 0;
    padding: 0 0 4px 8px;
  }

  .decision {
    font-weight: bold;
  }
  .decision.APPROVED, .decision.CONDITION {
    color: green;
  }
  .decision-reason {
    margin-left: 20px;
    white-space: pre-line;
  }
  .request-report {
    border-bottom: 1px solid darkgrey;
    margin-top: 10px;
  }
  .comment {
    padding-left: 40px;
  }
  .comment-text {
    white-space: pre-line;
  }
  .comment-timestamp, .comment-examiner {
    font-style: italic;
  }

</style>
