<!--eslint-disable-->
<template>
    <div>
      <div class="container-fluid">
        <div class="upper-div">
          <div class="search-select">
            <div class="upper-searches">
              <div style="margin-left: 0" class="filter">
                <h4>States:</h4>
                <select id="search-filter-state" v-model="stateSort">
                      <option v-for="state in states" :value="state">{{state}}</option>
                </select>
              </div>
              <div class="filter">
                <h4>NR</h4>
                <input id="search-filter-nr-number" v-model="nrSearch" placeholder="0000000"/>
              </div>
              <div class="filter">
                <h4>Examiner</h4>
                <input id="search-filter-examiner" v-model="username" placeholder="Username"/>
              </div>
              <div class="filter">
                <h4>Company Name</h4>
                <input id="search-filter-company" v-model="compName" placeholder="my company"/>
              </div>
            </div>
            <div class="lower-searches">
              <!--<h4 style="margin-left: 0" class="filter">By Priority:</h4>-->
              <!--<input type="checkbox" v-model="priority">-->
              <!--<br/>-->
              <h4 style="margin-left: 0" class="filter">Furnished:</h4>
              <input id="search-checkbox-furnished" type="checkbox" v-model="furnished">
              <br/>
              <h4 style="margin-left: 0" class="filter">Unfurnished:</h4>
              <input id="search-checkbox-unfurnished" type="checkbox" v-model="unfurnished">
              <!--uncomment if real-time search too slow-->
              <!--<div class="search-sort">-->
                <!--<button id="sort" class="btn btn-primary" type="button" v-on:click="sort">SORT</button>-->
              <!--</div>-->
            </div>
          </div>
          <div class="counts">
            <div class="search-load">
              <button id="load" class="btn" type="button" disabled v-on:click="examineNR">LOAD</button>
            </div>
            <div style="margin-right: 20px" class="count">
              <h3>Total: <span class="count-num">{{this.total}}</span></h3>
            </div>
          </div>
        </div>
        <span class="searchTable" id="search-table-container" v-on:click="loadNR">
            <datatable class="pre-line" v-bind="$data"/>
        </span>
      </div>
    </div>
</template>

<script defer>
/* eslint-disable */
export default {
  name: 'findfilter',
  options: {

  },
  computed: {
    currentStateSort: {
      get: function (){
        return this.$store.state.searchState;
      },
      set: function (val) {
        this.$store.commit('searchState',val);
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
    // priorityCheckBox(){
    //   if (this.priority)
    //     return true;
    //   return false;
    // },
    furnishedCheckBox(){
      if (this.furnished)
        return true;
      return false;
    },
    unfurnishedCheckBox(){
      if (this.unfurnished)
        return true;
      return false;
    },
    // searchQuerySpecial() {
    //   return this.$store.getters.searchQuerySpecial;
    // }
  },
  data: function () {
    return {
      fixHeaderAndSetBodyMaxHeight: 400,
      tblStyle: {'table-layout': 'fixed'},
      tblClass: ['table-bordered', 'search-table'],
      columns: (() => {
        const cols = [
          {title: 'NR#', field: 'nrNum', label: 'nr', thStyle: {background: '#fffae6'}, visible: true},
          {
            title: 'Examiner',
            field: 'activeUser',
            thStyle: {background: '#fffae6'},
            label: 'examiner',
            colStyle: {width: '15%'},
            visible: true
          },
          {title: 'State', field: 'stateCd', thStyle: {background: '#fffae6'}, label: 'state', visible: true},
          {title: 'Priority', field: 'priorityCd', thStyle: {background: '#fffae6'}, label: 'priority', visible: true},
          {title: 'Furnished', field: 'furnished', label: 'furnished', thStyle: {background: '#fffae6'}, visible: true},
          {title: 'NOB', field: 'natureBusinessInfo', label: 'nob', thStyle: {background: '#fffae6'}, visible: true},
          {
            title: 'Names',
            field: 'names',
            label: 'name',
            thStyle: {background: '#fffae6'},
            colStyle: {width: '15%'},
            visible: true
          },
          {
            title: 'Last Update',
            field: 'lastUpdate',
            label: 'lastUpdate',
            thStyle: {background: '#fffae6'},
            visible: true
          },
          {
            title: 'Submitted',
            field: 'submittedDate',
            label: 'submittedDate',
            thStyle: {background: '#fffae6'},
            visible: true
          },
          {
            title: 'Last Comment',
            field: 'comments',
            label: 'comments',
            thStyle: {background: '#fffae6'},
            visible: true
          },
          {
            title: 'Req Type',
            field: 'requestTypeCd',
            label: 'reqType',
            thStyle: {background: '#fffae6'},
            visible: false
          },
        ]
        return cols;
      })(),
      pageSizeOptions: [5, 10, 20, 50, 100],
      data: [],
      sortedData: [],
      total: 0,
      query: {},
      states: ['ALL', 'HOLD', 'INPROGRESS', 'DRAFT', 'EXPIRED', 'CANCELLED', 'APPROVED', 'CONDITIONAL', 'REJECTED'],
      stateSort: '',
      username: '',
      nrSearch: '',
      priority: true,
      furnished: true,
      unfurnished: true,
      compName: '',
      selectedNR: '',
      searchQuery: '?order=priorityCd:desc,submittedDate:asc&queue=hold&furnished=true&unfurnished=true&rows=10',
    }
  },
  mounted() {
    this.sortedData = this.populateTable(this.searchData);
    this.stateSort = this.currentStateSort;
    this.$store.dispatch('getSearchDataJSON');
  },
  watch: {

    searchData: {
      handler(newData) {
        this.total = newData.response.numFound;
        this.data = this.populateTable(newData);
      }
    },
    stateSort: {
      handler(newState) {
        this.currentStateSort = newState;
        if (newState === 'ALL') {
          newState = '';
        }
        this.updateQuery('queue', newState);
        this.query.offset = 0;
      }
    },
    nrSearch: {
      handler(nrNum) {
        this.updateQuery('nrNum',nrNum);
        this.query.offset = 0;
      }
    },
    username: {
      handler(activeUser) {
        this.updateQuery('activeUser',activeUser);
        this.query.offset = 0;
      }
    },
    compName: {
      handler(compName) {
        this.updateQuery('compName',compName);
        this.query.offset = 0;
      }
    },
    // priorityCheckBox: {
    //   handler(priorityCd) {
    //     this.updateQuery('priorityCd',priorityCd);
    //     this.query.offset = 0;
    //   }
    // },
    furnishedCheckBox: {
      handler(furnished) {
        this.updateQuery('furnished',furnished);
        this.query.offset = 0;
      }
    },
    unfurnishedCheckBox: {
      handler(unfurnished) {
        this.updateQuery('unfurnished',unfurnished);
        this.query.offset = 0;
      }
    },
    query: {
      handler() {
        this.handleQueryChange();
      },
      deep: true
    },
    searchQuery: {
      handler(newQuery) {
        console.log('new query = ', newQuery);
        this.$store.commit('searchQuery',newQuery);

        // comment this out if real-time search is too slow
        this.sort();
        // this.$store.dispatch('getSearchDataJSON');
      }
    },
    // searchQuerySpecial: {
    //   handler(newQuery) {
    //     console.log('special query fired: ', newQuery);
    //     this.$store.dispatch('getSearchDataJSON');
    //   }
    // }
  },
  methods: {
    populateTable(searchData){
      if (searchData != null) {
        let data = searchData.nameRequests[0];
        // organize names/dates //
        for (let i=0; i<data.length;i++) {
          // display last comment only/format it for table //
          if (data[i].comments != undefined && data[i].comments[0] != undefined) {
            let latestComment = data[i].comments[0];
            for (let commentIter = 0; commentIter < data[i].comments.length; commentIter++) {
              if (data[i].comments[commentIter].timestamp > latestComment.timestamp) {
                latestComment = data[i].comments[commentIter];
              }
            }
            data[i].comments = latestComment.comment;
          } else data[i].comments = null;

          // organize names column //
          for (let namesIter=0; namesIter<data[i].names.length; namesIter++) {
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
          for (let namesIter=0; namesIter<data[i].names.length; namesIter++) {
            if (data[i].names[namesIter] != undefined && data[i].names[namesIter].choice !== undefined) {
              if (this.compName != '') {
                if (data[i].names[namesIter].name.search(this.compName) != -1) {
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
          // organize names last update column //
          if (data[i].lastUpdate != undefined && data[i].lastUpdate[10]==="T") {
            let year = data[i].lastUpdate.slice(0,4);
            let month = data[i].lastUpdate.slice(5,7);
            let day = data[i].lastUpdate.slice(8,10);
            let hour = data[i].lastUpdate.slice(11,13);
            let min = data[i].lastUpdate.slice(14,16);
            let update = {'year': year,
                        'month': month,
                        'day': day,
                        'hour': hour,
                        'min': min};
            data[i].lastUpdate = `${update.hour}:${update.min}\n${update.month}/${update.day}/${update.year}`;
          }
          if (data[i].submittedDate != undefined && data[i].submittedDate[10]==="T") {
            let year = data[i].submittedDate.slice(0,4);
            let month = data[i].submittedDate.slice(5,7);
            let day = data[i].submittedDate.slice(8,10);
            let hour = data[i].submittedDate.slice(11,13);
            let min = data[i].submittedDate.slice(14,16);
            let submitDate = {'year': year,
                        'month': month,
                        'day': day,
                        'hour': hour,
                        'min': min};
            data[i].submittedDate = `${submitDate.hour}:${submitDate.min}\n${submitDate.month}/${submitDate.day}/${submitDate.year}`;
          }
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
         this.selectedNR = row.children[0].innerHTML.trim();

       } else {
         // do nothing
       }
      } else {
       // do nothing
      }
    },
    examineNR() {
      if (this.selectedNR != '') {
        this.$store.dispatch('newNrNumber',this.selectedNR);
        const path = '/nameExamination';
        this.$router.push(path);
      }
    },
    sort() {
      this.selectedNR = '';
      $(".select").removeClass('select');
      $("#load").removeClass("btn-primary");
      $("#load").prop('disabled', true);

      // this.updateQuery('start',0);
      this.$store.dispatch('getSearchDataJSON');
    },
    updateQuery(sort,value) {
      if (this.searchQuery.includes(sort)) {
        let start = this.searchQuery.indexOf(sort);
        let end = this.searchQuery.indexOf("&",start);
        if (end === -1)
          end = this.searchQuery.length;
        this.searchQuery = this.searchQuery.replace(this.searchQuery.substring(start,end),sort+'='+value);
      } else {
        this.searchQuery += '&'+sort+'='+value;
      }
      // if (sort === 'start')
      //   this.$store.commit('searchQuerySpecial',this.searchQuery);

    },
    handleQueryChange(){
      let rows = this.query.limit;
      let start = this.query.offset;
      this.updateQuery('rows',rows);
      this.updateQuery('start',start);

    },
  },
}
</script>

<style scoped>
  h3 {
  font-size: 13px;
  text-transform: uppercase;
  font-weight: bold;
  color: #9c9cb9;
  }
  .searchTable {
    background: #fffae6;
  }
  .search-select {
    border: 1px solid;
    border-radius: 4px;
    padding: 10px;
    width: 600px;
  }
  .lower-searches {
    margin: 20px;
  }
  .filter {
    display: inline-block;
    margin-left: 10px;
  }
  .pre-line {
    white-space: pre-line;
  }
  .count {
    display: inline-block;
    margin-right: 20px;
  }
  .counts {
    margin-top: 50px;
    margin-left: 10px;
  }
  .search-load {
    margin: 0 40px 0 20px;
    display: inline-block;
  }
  .search-sort {
    margin-top: 20px;
  }
</style>

<style>
  .table-striped tbody tr.select {
    background-color: #ffa;
  }
  .btn-group.pull-right {
    display: none;
  }
</style>
