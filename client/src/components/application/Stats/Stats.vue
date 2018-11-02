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
            <b-pagination v-on:input="pageChanged" size="md" :total-rows="numRecords" :current-page="currentPage" :v-model="currentPage" :per-page=100>
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
      perPage: 0,
      totalRows: null,
      pageOptions: [ 50, 100, 200 ],
      fields: [
        {
          key: 'nrNum',
          sortable: true,
          label: 'NR Number'
        },
        {
          key: 'names',
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
          key: 'furnished'
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

      console.log("CTX", ctx)
        this.requests = null;
        if (this.currentPage === 0) this.currentPage = 1

        var params = '';
        if (this.timespan != '' && this.timespan != null) {
          params = '?timespan=' + this.timespan;
        } else {
          params = '?timespan=1'
        }

        let currentPage = ctx.currentPage ? '&currentpage=' + ctx.currentPage : this.currentPage ? '&currentpage=' + this.currentPage : '';
        let pageSize = ctx.perPage ? '&perpage=' + ctx.perPage : this.perPage ? '&perpage=' + this.perPage : '&perpage=100';
        let url = '/api/v1/requests/stats' + params + currentPage + pageSize;
        let promise = axios.get(url, {headers: {Authorization: `Bearer ${sessionStorage.getItem('KEYCLOAK_TOKEN')}`}});

        return promise.then(response => {

            if (response.data && response.data.numRecords > 0) {
                let requests = response.data.nameRequests;

                // sort names by choice number
                let r = requests.map((request)=> {
                   let names = this.sortNames(request.names);

                    request.names='<ol>'
                    names.forEach((name)=> {
                      request.names += `<li>${name.name}</li>`
                    })

                    request.names +='</ol>'
                    request.lastUpdate = this.convertDate(request.lastUpdate);
                    console.log(request.names)
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
      console.log("Page changed", page)
      this.currentPage = page
    }
  },
  watch: {
    currentPage: function(val) {
      console.log("CURRENT PAGE CHANGED: ", val)
    }
  }
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
