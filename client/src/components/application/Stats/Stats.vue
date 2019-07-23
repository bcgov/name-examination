<!--eslint-disable-->
<template>
    <div>
      <div class="container-fluid">
        <div class="row">
          <div class="col">
            <form class="form-inline" @submit.prevent="onGetStatsClick" >
              <input class="form-control" type="number" placeholder="hrs"
                     v-model="timespan" style="width: 100px;">
              <button class="btn btn-success btn-sm" style="margin-left: 10px;" type="submit">Get Stats</button>
            </form>
            <div class="font-italic" style="width: 100px; text-align: center;">hours</div>
          </div>

          <div class="col">
            <div class="float-right">Decisions in the past {{ timespanHuman }}: {{ numRecords }}</div>
          </div>
        </div>
<br>
        <div class="row">
          <div class="col">
            <b-pagination v-on:input="pageChanged" size="md" :total-rows="numRecords" :current-page="currentPage" :v-model="currentPage" :per-page="perPage">
            </b-pagination>
          </div>
        </div>


        <div class="b-table">
          <b-table striped hover
                   show-empty
                   responsive
                   ref="table"
                   :items="getPagedStats"
                   :fields="fields"
                   :current-page="currentPage"
                   :per-page="perPage"
                   :v-model="requests"
          >
            <span slot="names" slot-scope="data" v-html="data.value"></span>
            <template slot="nrdetails" slot-scope="data">
              <span class="add-top-padding"><b>{{data.item.nrNum}}</b></span>
              <span class="row">
                  <ol class="add-top-padding">
                  <li v-for="name in data.item.names">
                   {{ name.name }}
                    <span v-if="name.state != 'NE'" class="decision" :class="name.state">{{ name.state }}</span>
                    <p class="decision-reason">{{ name.decision_text }}</p>
                  </li>
                </ol>
              </span>
               <div class="row">
              <div class="col comment" v-if="data.item.comments.length">
                <h3>Last Comment</h3>
                <p>
                  <span class="comment-examiner">{{ data.item.comments[data.item.comments.length-1].examiner }}</span>
                   -
                  <span class="comment-timestamp">{{ new Date(data.item.comments[data.item.comments.length-1].timestamp).toLocaleString('en-ca',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',year:'numeric'}) }}</span>
                </p>
                <p class="comment-text">{{ data.item.comments[data.item.comments.length-1].comment }}</p>
              </div>

            </div>
          </template>
          </b-table>
        </div>
     </div>
    </div>
</template>

<script defer>
/* eslint-disable */
import axios from '@/axios-auth'

export default {
  name: 'stats',
  data: function () {
    return {
      timespan: 1, // number of hours back to look at
      requests: null,
      numRecords: null,
      currentPage: 1,
      perPage: 50,
      totalRows: null,
      fields: [
        {
          key: 'nrdetails',
          label: "Request Details",
          _showDetails: true
        },
        {
          key: 'stateCd',
          sortable: true,
          label: 'Status'
        },
        {
          key: 'lastUpdate',
          sortable: true
        },
        {
          key: 'activeUser',
          sortable: false
        },
        {
          key: 'furnished',
          label: "Sent back to NRO?"
        }
      ]
    }
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
    onGetStatsClick(e) {
        this.$refs.table.refresh();
    },
    getPagedStats(ctx) {

        this.requests = null;
        if (this.currentPage === 0) this.currentPage = 1

        var params = '';
        if (this.timespan != '' && this.timespan != null) {
          params = '?timespan=' + this.timespan;
        } else {
          params = '?timespan=1'
        }

        let currentPage = ctx.currentPage ? '&currentpage=' + ctx.currentPage : this.currentPage ? '&currentpage=' + this.currentPage : '';
        let pageSize = ctx.perPage ? '&perpage=' + ctx.perPage : this.perPage;
        let url = '/api/v1/requests/stats' + params + currentPage + pageSize;
        let promise = axios.get(url, {headers: {Authorization: `Bearer ${sessionStorage.getItem('KEYCLOAK_TOKEN')}`}});

        return promise.then(response => {

            if (response.data && response.data.numRecords > 0) {
                let requests = response.data.nameRequests;

                // sort names by choice number
                let r = requests.map((request)=> {
                    request.names = this.sortNames(request.names);
                    request.lastUpdate = this.convertDate(request.lastUpdate);
                    return request
                });

                this.numRecords = response.data.numRecords;
                return r
            }
        })
        .catch(error => console.log('ERROR: ' + error))

    },
    sortNames(data) {
      function compare(a,b) {
        if (a.choice < b.choice)
          return -1;
        if (a.choice > b.choice)
          return 1;
        return 0;
      }
      return data.sort(compare);
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
