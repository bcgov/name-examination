<!--eslint-disable-->
<template>
  <v-container fluid ma-0 pa-0 id="find-filter">
    <v-layout pa-0 mt-3 px-4><h1>Search</h1></v-layout>
    <v-layout pa-0 px-4 align-center>
      <v-flex><a @click="clearFilter()">Clear Filters</a></v-flex>
      <v-flex shrink mx-4>Results: {{ total }}</v-flex>
      <v-flex shrink mx-2>Display:</v-flex>
      <v-flex shrink><v-select :items="pageSizeOptions"
                               attach
                               browser-autocomplete="off"
                               id="display-selection"
                               style="width: 75px"
                               class="text-input-style"
                               v-model="perPage" /></v-flex>
      <v-flex shrink mx-2>Page: </v-flex>
      <v-flex shrink>
        <v-select :items="pageNumbers"
                  browser-autocomplete="off"
                  id="page-selection"
                  style="width: 75px"
                  v-model="currentPage"
                  attach
                  class="text-input-style" />
      </v-flex>
      <v-flex shrink mx-2>of {{ numberOfPages }}</v-flex>
      <v-flex ml-2 shrink>
        <v-btn id="previous"
               flat
               class="ma-0 pa-0"
               style="height: 32px; background-color: var(--gold); color: white;"
               @click="previousPage">
          <span class="fw-700 fs-16">{{ '<' }}</span>
      </v-btn></v-flex>
      <v-flex shrink>
        <v-btn id="next"
               flat
               class="ma-0 pa-0 ml-1"
               style="height: 32px; background-color: var(--gold); color: white;"
               @click="nextPage">
          <span class="fw-700 fs-16">{{ '>' }}</span>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-data-table :headers="headers"
                      class="ma-3"
                      :items="data"
                      hide-actions>
          <template v-slot:headers="{headers}">
            <tr>
              <th v-for="header in headers"
                  :style="header.style"
                  class="text-left header-row-1 pa-0 pl-2">
                {{ header.text }}
              </th>
            </tr>
            <tr class="header-row-2">
              <th class="pa-0 px-1">
                <v-select id="search-filter-state"
                          browser-autocomplete="off"
                          class="text-input-style"
                          v-model="stateSort"
                          :items="states"
                          attach
                          :menu-props="selectProps"
                          value="state" />
              </th>
              <th class="pa-0 px-1">
                <v-text-field id="search-filter-examiner"
                              browser-autocomplete="off"
                              class="text-input-style"
                              v-model="username"
                              placeholder="Username"
                              v-on:keypress="checkEnter" />
              </th>
              <th class="pa-0 px-1">
                <v-text-field id="search-filter-nr-number"
                              browser-autocomplete="off"
                              class="text-input-style"
                              v-model="nrSearch"
                              placeholder="NR Number"
                              v-on:keypress="checkEnter" />
              </th>
              <th class="pa-0 px-1">
                <v-text-field id="search-filter-company"
                              browser-autocomplete="off"
                              class="text-input-style"
                              v-model="compName"
                              placeholder="Name"
                              v-on:keypress="checkEnter" />
              </th>
              <th class="pa-0 px-1"/>
              <th class="pa-0 px-1">
                <v-select id="search-filter-priority"
                          browser-autocomplete="off"
                          class="text-input-style"
                          :items="rankings"
                          :menu-props="priorityProps"
                          attach
                          value="option"
                          v-model="ranking" />
              </th>
              <th class="pa-0 px-1">
                <v-select id="search-filter-furnished"
                          class="text-input-style"
                          browser-autocomplete="off"
                          :items="notificationType"
                          attach
                          value="option"
                          v-model="notification" />
              </th>
              <th class="pa-0 px-1">
                <v-select id="search-filter-submittedDate"
                          class="text-input-style"
                          browser-autocomplete="off"
                          :items="submittedDateIntervals"
                          value="option"
                          attach
                          v-model="submittedInterval" />
              </th>
              <th class="pa-0 px-1">
                <v-select id="search-filter-lastUpdate"
                          class="text-input-style"
                          browser-autocomplete="off"
                          v-model="lastUpdateInterval"
                          attach
                          value="option"
                          :items="lastUpdateIntervals" />
              </th>
              <th />
            </tr>
          </template>
          <template v-slot:items="{item, index}">
            <tr>
              <td class="pa-2">{{ item.Status }}</td>
              <td class="pa-2">{{ item.LastModifiedBy }}</td>
              <td class="pa-2">
                <a @click="examineNr(item.NameRequestNumber)">{{ item.NameRequestNumber }}</a>
              </td>
              <td class="pa-2 cell-pre-line">{{ item.Names }}</td>
              <td class="pa-2 cell-pre-line">{{ item.NatureOfBusiness }}</td>
              <td class="pa-2">{{ item.Priority }}</td>
              <td class="pa-2">{{ item.ClientNotification }}</td>
              <td class="pa-2">{{ item.Submitted }}</td>
              <td class="pa-2">{{ item.LastUpdate }}</td>
              <td class="pa-2 cell-pre-line">{{ item.LastComment }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
export default {
  name: 'findfilter',
  data: function () {
    return {
      selectProps: {
        minWidth: '130px',
        minHeight: '400px'
      },
      priorityProps: {
        minWidth: '100px'
      },
      headers:[
        {value:'Status', text: 'Status', style: {width: '6%'}, },
        {value:'LastModifiedBy', text: 'Modified By', style: {width: '5%'}, },
        {value:'NameRequestNumber', text: 'NR Number', style: {width: '6%'}, },
        {value:'Names', text: 'Names', style: {width: '29%'}, },
        {value:'NatureOfBusiness', text: 'Nature Of Business', style: {width: '10%'}, },
        {value:'Priority', text: 'Priority', style: {width: '6%'}, },
        {value:'ClientNotification', text: 'Notified', style: {width: '6%'}, },
        {value:'Submitted', text: 'Submitted', style: {width: '6%'}, },
        {value:'LastUpdate', text: 'Last Update', style: {width: '6%'}, },
        {value:'LastComment', text: 'Last Comment', style: {width: '20%'}, },
      ],
      data: [],
      pageSizeOptions: [5, 10, 20, 50, 100],
      currentPage: 1,
      pageNumbers: [1],
      numberOfPages: 1,
      perPage: 10,
      total: 0,
      states: ['ALL', 'HOLD', 'INPROGRESS', 'DRAFT', 'EXPIRED', 'CANCELLED', 'APPROVED', 'CONDITIONAL', 'REJECTED', 'COMPLETED'],
      stateSort: 'HOLD',
      username: '',
      nrSearch: '',
      ranking: 'All',
      rankings:['All','Priority','Standard'],
      notification: 'All',
      notificationType:['All','Notified','Not Notified'],
      compName: '',
      selectedNR: '',
      submittedInterval: 'All',
      submittedDateIntervals:['Today','7 days','30 days','90 days','1 year','3 years','5 years','All'],
      lastUpdateInterval: 'All',
      lastUpdateIntervals:['Today','Yesterday','2 days','7 days','30 days','All'],
      searchQuery: '?order=priorityCd:desc,submittedDate:asc&queue=hold&ranking=All&notification=All&' +
                   'submittedInterval=All&lastUpdateInterval=All&rows=10',
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
    currentSubmittedInterval: {
      get: function () {
        return this.$store.state.searchSubmittedInterval;
      },
      set: function (val) {
        this.$store.commit('searchSubmittedInterval',val);
      }
    },
    currentLastUpdatedInterval: {
      get: function () {
        return this.$store.state.searchLastUpdatedInterval;
      },
      set: function (val) {
        this.$store.commit('searchLastUpdatedInterval',val);
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

    // get rows from saved search filter info or if none saved then default search filter info
    this.mounting = true;
    if (this.stateSort === this.currentStateSort)
      this.updateQuery('queue',this.stateSort);
    else
      this.stateSort = this.currentStateSort;
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
            data[i].natureBusinessInfo = `${ data[i].natureBusinessInfo.slice(0, 75) }...`;
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
            data[i].lastUpdate = `${ data[i].lastUpdate.slice(0, 12) } \n ${ data[i].lastUpdate.slice(12, -1) }`;
          }
          if (data[i].submittedDate != undefined) {
            data[i].submittedDate = new Date(data[i].submittedDate).toLocaleString('en-ca', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
            data[i].submittedDate = `${ data[i].submittedDate.slice(0, 12) } \n ${ data[i].submittedDate.slice(12, -1) }`;
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
            if (data[i].comments) {
              if (data[i].comments.length > 100) {
                data[i].comments = `${ data[i].comments.slice(0, 75) }...`;
              }
            }
          } else { data[i].comments = null };

          data[i] = this.buildTableRow(data[i]);
        }
        return data;
      }
      return [];
    },
    loadNR(event) {
      // check if this is a body row (ie: in tbody)
      var row = $(event.target).closest('tr')[0];
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
        else if (this.submittedInterval !== 'All')
          this.submittedInterval = 'All';
        else if (this.lastUpdateInterval !== 'All')
          this.lastUpdateInterval = 'All';
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
        else if (this.submittedInterval !== this.currentSubmittedInterval)
          this.submittedInterval = this.currentSubmittedInterval;
        else if (this.lastUpdateInterval !== this.currentLastUpdatedInterval)
          this.lastUpdateInterval = this.currentLastUpdatedInterval;
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

      this.total = val.response.numFound;
      this.pageNumbers = this.buildPages();
      this.data = this.populateTable(val);
    },
    stateSort: function (val) {

      this.currentStateSort = val;
      if (val === 'ALL') {
        val = '';
      }
      this.updateQuery('queue', val);
    },
    nrSearch: function (val) {

      this.currentNrSearch = val;
      this.updateQuery('nrNum', val);
    },
    username: function (val) {

      this.currentUsername = val;
      this.updateQuery('activeUser', val);
    },
    compName: function (val) {

      this.currentCompName = val;
      this.updateQuery('compName', val);
    },
    perPage: function (val) {

      this.pageNumbers = this.buildPages();
      this.currentPerPage = val;
      this.updateQuery('rows',val);
    },
    currentPage: function (val) {

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

      this.currentRanking = val;
      this.updateQuery('ranking',val);
    },
    notification: function (val) {

      this.currentNotification = val;
      this.updateQuery('notification',val);
    },
    submittedInterval: function (val) {

      this.currentSubmittedInterval = val;
      this.updateQuery('submittedInterval',val);
    },
    lastUpdateInterval: function (val) {

      this.currentLastUpdatedInterval = val;
      this.updateQuery('lastUpdateInterval',val);
    }
  },
}
</script>

<style scoped>
  a {
    color: var(--link) !important;
  }

  td {
    vertical-align: top !important;
  }

  .text-input-style {
    background-color: white !important;
    border: 1px solid var(--outline);
    height: 32px;
    padding: 0 0 5px 8px;
    font-size: 13px;
    margin: 0;
    color: var(--text)
  }

  .cell-pre-line {
    white-space: pre-line;
  }

  .header-row-1 {
    background-color: var(--d-blue);
    color: white !important;
    height: 50px;
    font-size: 14px;
    font-weight: 700;
  }

  .header-row-2 {
    background-color: var(--l-blue);
    padding: 10px;
  }
</style>
