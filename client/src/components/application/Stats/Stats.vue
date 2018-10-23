<!--eslint-disable-->
<template>
    <div>
      <div class="container-fluid">
        <div class="row">
          <div class="col">
            <form class="form-inline" @submit.prevent="getReportData">
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

        <div class="row">
          <div class="col-12 add-top-padding request-report" v-for="request in requests">
            <div class="row">
              <div class="col">
                <h2>{{ request.nrNum }}</h2>
              </div>
              <div class="col">{{ request.stateCd }}</div>
              <div class="col">
                <p>{{ request.activeUser }}</p>
              </div>
              <div class="col">
                <p>{{ convertDate(request.lastUpdate) }}</p>
              </div>
              <div class="col">
                Sent back to NRO? {{ request.furnished }}
              </div>
            </div>
            <ol class="add-top-padding">
              <li v-for="name in request.names">
                {{ name.name }}
                <span v-if="name.state != 'NE'" class="decision" :class="name.state">{{ name.state }}</span>
                <p class="decision-reason">{{ name.decision_text }}</p>
              </li>
            </ol>
            <div class="row">
              <div class="col comment" v-if="request.comments.length">
                <h3>Last Comment</h3>
                <p>
                  <span class="comment-examiner">{{ request.comments[request.comments.length-1].examiner }}</span>
                  -
                  <span class="comment-timestamp">{{ new Date(request.comments[request.comments.length-1].timestamp).toLocaleString('en-ca',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',year:'numeric'}) }}</span>
                </p>
                <p class="comment-text">{{ request.comments[request.comments.length-1].comment }}</p>
              </div>
              <div class="col"></div>

            </div>
          </div>
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
  mounted() {
    this.getReportData();
  },
  methods: {
    gotoNR() {
      if (this.selectedNR != '') {
        this.$store.dispatch('newNrNumber',this.selectedNR);
        const path = '/nameExamination';
        this.$router.push(path);
      }
    },
    getReportData() {

      // clear data
      this.requests = null;

      var params = '';
      if (this.timespan != '' && this.timespan != null) params = '?timespan=' + this.timespan;
      const url = '/api/v1/requests/stats' + params
      return axios.get(url, {headers: {Authorization: `Bearer ${sessionStorage.getItem('KEYCLOAK_TOKEN')}`}}).then(response => {
        console.log(response);
        if (response.data && response.data.numRecords > 0) {
          this.requests = response.data.nameRequests;
          console.log(this.requests);

          // sort names by choice number
          for (let request of this.requests) {
            request.names = this.sortNames(request.names);
          }

          this.numRecords = response.data.numRecords;
        }
      })
        .catch(error => console.log('ERROR: ' + error))
    },
    sortNames(data) {
      console.log('got to sortNames() for ');
      console.log(data);
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
