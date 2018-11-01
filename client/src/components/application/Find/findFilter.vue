<!--eslint-disable-->
<template>
    <div>
      <div class="container-fluid">
        <table>
          <thead>
            <tr id="filter-header">
              <th>
                <select id="search-filter-state" v-model="stateSort" class="form-control">
                      <option v-for="state in states" :value="state">{{state}}</option>
                </select>
              </th>
              <th>
                <input id="search-filter-examiner" v-model="username" placeholder="Username" class="form-control" v-on:keypress="checkEnter"/>
              </th>
              <th>
                <input id="search-filter-nr-number" v-model="nrSearch" placeholder="NR Number" class="form-control" v-on:keypress="checkEnter"/>
              </th>
              <th>
                <input id="search-filter-company" v-model="compName" placeholder="Name" class="form-control" v-on:keypress="checkEnter"/>
              </th>
              <th></th>
              <th>
                <select id="search-filter-priority" v-model="ranking" class="form-control">
                      <option v-for="option in rankings" :value="option">{{option}}</option>
                </select>
              </th>
              <th>
                <select id="search-filter-furnished" v-model="notification" class="form-control">
                      <option v-for="option in notificationType" :value="option">{{option}}</option>
                </select>
              </th>
              <th>
                <select id="search-filter-submittedDate" v-model="interval" class="form-control">
                      <option v-for="option in timeIntervals" :value="option">{{option}}</option>
                </select>
              </th>
              <th></th>
              <th></th>
            </tr>
          </thead>
        </table>
        <h1>Search</h1>
        <span class="searchTable" id="search-table-container" v-on:click="loadNR">
          <b-row id="table-options">
            <b-col>
              <b-link id="clear-filter" @click="clearFilter">Clear Filters</b-link>
            </b-col>

            <b-col>
              <b-row id="pagination">
                <b-col>
                  <p id="results">Results: {{this.total}}</p>
                </b-col>

                <b-col>
                  <b-form-group id="display-selection" horizontal label="Display:">
                    <b-form-select :options="pageSizeOptions" v-model="perPage" style="width:60px; float:right; margin-right: 10px"/>
                  </b-form-group>
                </b-col>

                <b-col>
                  <b-form-group id="page-selection" horizontal label="Page:">
                    <b-form-select :options="pageNumbers" v-model="currentPage" style="width:60px; float:right"/>
                  </b-form-group>
                </b-col>

                <b-col>
                  <div id="prev-next-page">
                    <span>of {{this.numberOfPages}}</span>
                    <b-button-group>
                      <b-btn id="previous" @click="previousPage">&lsaquo;</b-btn>
                      <b-btn id="next" @click="nextPage">&rsaquo;</b-btn>
                    </b-button-group>
                  </div>
                </b-col>
              </b-row>
            </b-col>
          </b-row>

          <b-table id="search-table" show-empty striped hover fixed class="pre-line scroll" :fields="headers" :items="data">
            <template slot="NameRequestNumber" slot-scope="data">
              <a @click="examineNr(data.value)">{{data.value}}</a>
            </template>
          </b-table>
        </span>
      </div>
    </div>
</template>

<script defer>
/* eslint-disable */
export default {
  name: 'findfilter',
  data: function () {
    return {
      headers:[
        {key:'Status', label: 'Status', thClass:'search-header status-col', class: 'text-center'},
        {key:'LastModifiedBy', label: 'Last Modified By', thClass:'search-header username-col'},
        {key:'NameRequestNumber', label: 'Name Request Number', class: 'text-center link', thClass:'search-header nr-col', formatter: (value) => {return value.trim()}},
        {key:'Names', label: 'Names', thClass:'search-header name-col'},
        {key:'NatureOfBusiness', label: 'Nature Of Business', thClass:'search-header nob-col', class: 'text-cutoff'},
        {key:'Priority', label: 'Priority', thClass:'search-header priority-col', class: 'text-center'},
        {key:'ClientNotification', label: 'Client Notification', thClass:'search-header notification-col', class: 'text-center'},
        {key:'Submitted', label: 'Submitted', thClass:'search-header submitted-col', class: 'text-center'},
        {key:'LastUpdate', label: 'Last Update', thClass:'search-header last-update-col', class: 'text-center'},
        {key:'LastComment', label: 'Last Comment', thClass:'search-header comment-col'},
      ],
      data: [],
      pageSizeOptions: [5, 10, 20, 50, 100],
      currentPage: 1,
      pageNumbers: [1],
      numberOfPages: 1,
      perPage: 10,
      total: 0,
      states: ['ALL', 'HOLD', 'INPROGRESS', 'DRAFT', 'EXPIRED', 'CANCELLED', 'APPROVED', 'CONDITIONAL', 'REJECTED'],
      stateSort: 'HOLD',
      username: '',
      nrSearch: '',
      ranking: 'All',
      rankings:['All','Priority','Standard'],
      notification: 'All',
      notificationType:['All','Notified','Not Notified'],
      compName: '',
      selectedNR: '',
      interval: '30 days',
      timeIntervals:['Today','7 days','30 days','90 days','1 year','3 years','5 years','All'],
      searchQuery: '?order=priorityCd:desc,submittedDate:asc&queue=hold&ranking=All&notification=All&interval=30 days&rows=10',
      clearing: false,
      mounting: false,
    }
  },
  computed: {
    currentStateSort: {
      get: function () {
        return this.$store.state.searchState;
      },
      set: function (val) {
        this.$store.commit('searchState',val);
      }
    },
    currentNrSearch: {
      get: function () {
        return this.$store.state.searchNr;
      },
      set: function (val) {
        this.$store.commit('searchNr',val);
      }
    },
    currentUsername: {
      get: function () {
        return this.$store.state.searchUsername;
      },
      set: function (val) {
        this.$store.commit('searchUsername',val);
      }
    },
    currentCompName: {
      get: function () {
        return this.$store.state.searchCompName;
      },
      set: function (val) {
        this.$store.commit('searchCompName',val);
      }
    },
    currentRanking: {
      get: function () {
        return this.$store.state.searchRanking;
      },
      set: function (val) {
        this.$store.commit('searchRanking',val);
      }
    },
    currentNotification: {
      get: function () {
        return this.$store.state.searchNotification;
      },
      set: function (val) {
        this.$store.commit('searchNotification',val);
      }
    },
    currentInterval: {
      get: function () {
        return this.$store.state.searchInterval;
      },
      set: function (val) {
        this.$store.commit('searchInterval',val);
      }
    },
    currentPerPage: {
      get: function () {
        return this.$store.state.searchPerPage;
      },
      set: function (val) {
        this.$store.commit('searchPerPage',val);
      }
    },
    storeCurrentPage: {
      get: function () {
        return this.$store.state.searchCurrentPage;
      },
      set: function (val) {
        this.$store.commit('searchCurrentPage',val);
      }
    },
    searchData() {
      return this.$store.getters.searchDataJSON;
    },
    nrNum() {
      return this.$store.getters.nrNumber;
    },
    examiner(){
      return this.username;
    },
  },
  mounted() {
    // attach filter header to b-table (under main table header)
    let tr = $('#filter-header');
    $('#search-table thead').append(tr);

    // get rows from saved search filter info or if none saved then default search filter info
    this.mounting = true;
    if (this.stateSort === this.currentStateSort)
      this.updateQuery('queue',this.stateSort);
    else
      this.stateSort = this.currentStateSort;

    $('#search-table table').addClass('scroll');
  },
  methods: {
    populateTable(searchData){
      if (searchData != null) {
        let data = searchData.nameRequests[0];
        // organize names/dates //
        for (let i=0; i<data.length;i++) {

          // organize names column and adjust count inflated by compName filter//
          if (data[i].names != null) {
            for (let namesIter = 0; namesIter < data[i].names.length; namesIter++) {
              if (data[i].names[namesIter] != undefined && data[i].names[namesIter].choice !== undefined) {
                if (data[i].names[namesIter].choice !== namesIter + 1) {
                  let tmp = data[i].names[data[i].names[namesIter].choice - 1];
                  data[i].names[data[i].names[namesIter].choice - 1] = data[i].names[namesIter];
                  data[i].names[namesIter] = tmp;
                }
              }
            }
            let adjustCount = false;
            let namesStr = '';
            for (let namesIter = 0; namesIter < data[i].names.length; namesIter++) {
              if (data[i].names[namesIter] != undefined && data[i].names[namesIter].choice !== undefined) {
                if (this.compName != '') {
                  if (data[i].names[namesIter].name.search(this.compName.toUpperCase()) != -1) {
                    if (adjustCount)
                      this.total--;
                    else
                      adjustCount = true;
                  }
                }
                data[i].names[namesIter] = data[i].names[namesIter].choice + '. ' + data[i].names[namesIter].name;
                namesStr += data[i].names[namesIter] + ' \n';
              }
            }
            if (namesStr !== '')
              data[i].names = namesStr;
          }
          // truncate nature of business if too long
          if (data[i].natureBusinessInfo != null && data[i].natureBusinessInfo.length > 100) {
            data[i].natureBusinessInfo = [data[i].natureBusinessInfo.slice(0,75), '...'];
          }
          // display priority (priority/standard)
          if (data[i].priorityCd === 'Y')
            data[i].priorityCd = 'Priority';
          else
            data[i].priorityCd = 'Standard';

          // display furnished (notified/not notified)
          if (data[i].furnished === 'Y')
            data[i].furnished = 'Notified';
          else
            data[i].furnished = 'Not Notified';

          // organize dates //
          if (data[i].lastUpdate != undefined) {
            data[i].lastUpdate = new Date(data[i].lastUpdate).toLocaleString('en-ca', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
            data[i].lastUpdate = [data[i].lastUpdate.slice(0,12),'\n',data[i].lastUpdate.slice(12,-1)];
          }
          if (data[i].submittedDate != undefined) {
            data[i].submittedDate = new Date(data[i].submittedDate).toLocaleString('en-ca', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
            data[i].submittedDate = [data[i].submittedDate.slice(0,12),'\n',data[i].submittedDate.slice(12,-1)];
          }
          // display last comment only/format it for table //
          if (data[i].comments != undefined && data[i].comments[0] != undefined) {
            let latestComment = data[i].comments[0];
            for (let commentIter = 0; commentIter < data[i].comments.length; commentIter++) {
              if (data[i].comments[commentIter].timestamp > latestComment.timestamp) {
                latestComment = data[i].comments[commentIter];
              }
            }
            data[i].comments = latestComment.comment;
            if (data[i].comments.length > 100) {
              data[i].comments = [data[i].comments.slice(0,75), '...'];
            }
          } else data[i].comments = null;

          data[i] = this.buildTableRow(data[i]);
        }
        return data;
      }
      return [];
    },
    loadNR(event) {
      console.log(event);
      // check if this is a body row (ie: in tbody)

      var row = $(event.target).closest('tr')[0];
      console.log()
      if (row !== undefined) {

       if (row.parentNode.tagName == 'TBODY') {

         $(row).closest('tbody').find('tr').removeClass('select');
         $(row).addClass('select');
         $("#load").addClass("btn btn-primary");
         $("#load").prop('disabled', false);
         if (this.selectedNR === row.children[2].children[0].innerHTML.trim() && this.selectedNR != '') {
           this.examineNr(this.selectedNR)
         } else {
           this.selectedNR = row.children[2].children[0].innerHTML.trim();
         }

       } else {
         // do nothing
       }
      } else {
       // do nothing
      }
    },
    examineNr(nr) {
      if (nr != '') {
        this.$store.dispatch('newNrNumber', nr);
        const path = '/nameExamination';
        this.$router.push(path);
      }
    },
    sort() {
      this.selectedNR = '';
      $(".select").removeClass('select');
      this.$store.dispatch('getSearchDataJSON', this.searchQuery);
    },
    updateQuery(sort,value) {
      if (this.searchQuery.includes(sort)) {
        let start = this.searchQuery.indexOf(sort);
        let end = this.searchQuery.indexOf("&", start);
        if (end === -1)
          end = this.searchQuery.length;
        this.searchQuery = this.searchQuery.replace(this.searchQuery.substring(start, end), sort + '=' + value);
      } else {
        this.searchQuery += '&' + sort + '=' + value;
      }
      // checks that all filters are at default values before calling 'sort()' if 'clearing' is true
      if (this.clearing) {
        if (this.nrSearch != '') {
          this.nrSearch = '';
        } else if (this.username != '')
          this.username = '';
        else if (this.compName != '')
          this.compName = '';
        else if (this.ranking !== 'All')
          this.ranking = 'All';
        else if (this.notification !== 'All')
          this.notification = 'All';
        else if (this.interval !== '30 days')
          this.interval = '30 days';
        else if (this.perPage !== 10)
          this.perPage = 10;
        else {
          this.clearing = false;
          this.sort();
        }
      } else if (this.mounting) {
        if (this.nrSearch !== this.currentNrSearch)
          this.nrSearch = this.currentNrSearch;
        else if (this.username !== this.currentUsername)
          this.username = this.currentUsername;
        else if (this.compName !== this.currentCompName)
          this.compName = this.currentCompName;
        else if (this.ranking !== this.currentRanking)
          this.ranking = this.currentRanking;
        else if (this.notification !== this.currentNotification)
          this.notification = this.currentNotification;
        else if (this.interval !== this.currentInterval)
          this.interval = this.currentInterval;
        else if (this.perPage !== this.currentPerPage)
          this.perPage = this.currentPerPage;
        else if (this.currentPage !== this.storeCurrentPage)
          this.currentPage = this.storeCurrentPage;
        else {
          this.mounting = false;
          this.sort();
        }
      } else if (['nrNum','activeUser','compName'].includes(sort)) {
        //do nothing
      } else if (this.currentPage !== 1 && sort !== 'start')
        this.currentPage = 1;
      else
        this.sort();

    },
    buildTableRow(val) {
      return {
        Status:val.stateCd,
        NameRequestNumber:val.nrNum,
        LastModifiedBy:val.activeUser,
        Names:val.names,
        Priority:val.priorityCd,
        ClientNotification:val.furnished,
        NatureOfBusiness:val.natureBusinessInfo,
        LastUpdate:val.lastUpdate,
        Submitted:val.submittedDate,
        LastComment:val.comments,
      }
    },
    buildPages() {
      let pages = [1];
      let count = 1;
      for (let i=this.perPage; i<this.total;i+=this.perPage) {
        count++;
        pages.push(count);
      }
      this.numberOfPages = count;
      return pages;
    },
    previousPage() {
      if (this.currentPage === 1)
        $('#previous').prop('disabled', true);
      else {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage === this.pageNumbers[this.pageNumbers.length-1])
        $('#next').prop('disabled', true);
      else
        this.currentPage++;
    },
    clearFilter() {
      this.clearing = true;
      if (this.stateSort === 'HOLD')
        this.updateQuery('queue', 'HOLD'); //if already filtered by hold still need to clear other vals
      else
        this.stateSort = 'HOLD';
    },
    checkEnter(val) {
      if (val.keyCode === 13) {
        if (this.currentPage !== 1)
          this.currentPage = 1;
        else
          this.sort();
      }
    }
  },
  watch: {

    searchData: function (val) {
      console.log('searchData watcher fired: ', val);
      this.total = val.response.numFound;
      this.pageNumbers = this.buildPages();
      this.data = this.populateTable(val);
    },
    stateSort: function (val) {
      console.log('stateSort watcher fired: ', val);
      this.currentStateSort = val;
      if (val === 'ALL') {
        val = '';
      }
      this.updateQuery('queue', val);
    },
    nrSearch: function (val) {
      console.log('nrSearch watcher fired: ', val);
      this.currentNrSearch = val;
      this.updateQuery('nrNum', val);
    },
    username: function (val) {
      console.log('username watcher fired: ', val);
      this.currentUsername = val;
      this.updateQuery('activeUser', val);
    },
    compName: function (val) {
      console.log('compName watcher fired: ', val);
      this.currentCompName = val;
      this.updateQuery('compName', val);
    },
    perPage: function (val) {
      console.log('perPage watcher fired: ', val);
      this.pageNumbers = this.buildPages();
      this.currentPerPage = val;
      this.updateQuery('rows',val);
    },
    currentPage: function (val) {
      console.log('currentPage watcher fired: ', val);
      if (val === 1) {
        $('#previous').prop('disabled', true);
        $('next').prop('disabled', false);
      } else if (val === this.pageNumbers[this.pageNumbers.length-1]) { //if val == last page
        $('#previous').prop('disabled', false);
        $('next').prop('disabled', true);
      } else {
        $('#previous').prop('disabled', false);
        $('next').prop('disabled', false);
      }
      this.storeCurrentPage = val;
      this.updateQuery('start',(val-1)*this.perPage);
    },
    ranking: function (val) {
      console.log('ranking watcher fired: ', val);
      this.currentRanking = val;
      this.updateQuery('ranking',val);
    },
    notification: function (val) {
      console.log('notification watcher fired: ', val);
      this.currentNotification = val;
      this.updateQuery('notification',val);
    },
    interval: function (val) {
      console.log('interval watcher fired: ', val);
      this.currentInterval = val;
      this.updateQuery('interval',val);
    }
  },
}
</script>

<style scoped>
  h1 {
    margin: 0;
    padding: 0;
  }
  .searchTable {
    padding: 0;
    margin: 0;
  }
  .pre-line {
    white-space: pre-line;
  }
  #pagination {
    float: right;
    width: 425px;
  }
  #pagination .col {
    padding: 0;
    margin: 0;
  }
  .btn-secondary {
    background-color: #ffffff;
    border: 1px solid #ced4da;
    border-radius: .2rem;
    color: #7f7f7f;
    height: 30px;
    padding-top: 2px;
  }
  .btn-secondary:hover{
    background-color: #ced4da;
  }
  #clear-filter {
    float: left;
    width: 100px;
    margin-top: 27px;
  }
  #results {
    margin-top: 27px;
  }
  #display-selection {
    width:118px;
    margin-top: 20px;
    margin-bottom: 0;
  }
  #page-selection {
    width:95px;
    float: right;
    margin-right:5px;
    margin-top: 20px;
    margin-bottom: 0;
  }
  #prev-next-page {
    float:left;
    margin-top: 20px;
    margin-bottom: 0;
  }
  #filter-header {
    background-color: #b3cce6;
  }
  #search-filter-state {
    height: 30px !important;
  }
  #search-filter-priority {
    height: 30px !important;
  }
  #search-filter-furnished {
    height: 30px !important;
  }
  #search-filter-submittedDate {
    height: 30px !important;
  }

</style>

<style>
  .link {
    color: #1a5a96;
    cursor: pointer;
    text-decoration: underline;
  }
  .search-header {
    color: #FFFFFF;
    background-color: #336699;
    text-decoration: none;
    width: 100px;
  }
  .name-col {
    width: 300px;
  }
  .username-col {
    width: 120px;
  }
  .text-cutoff {
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .table-striped tbody tr:hover {
    background-color:#96c0e6;
  }
  .table-striped tbody tr.select {
    background-color: #96c0e6;
  }
  .btn-group.pull-right {
    display: none;
  }
</style>
