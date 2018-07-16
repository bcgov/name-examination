<!--eslint-disable-->
<template>
    <div>
      <div class="container-fluid">
        <div class="search-select">
          <div style="margin-left: 0" class="filter">
            <h4>States:</h4>
            <select v-model="stateSort">
                  <option v-for="state in states" :value="state">{{state}}</option>
            </select>
          </div>
          <div class="filter">
            <h4>NR</h4>
            <input v-model="nrSearch" placeholder="0000000"/>
          </div>
          <div class="filter">
            <h4>Examiner</h4>
            <input v-model="username" placeholder="Username"/>
          </div>
          <div class="filter">
            <h4>Company Name</h4>
            <input v-model="compName" placeholder="my company"/>
          </div>
          <div style="margin-right: 20px" class="count">
            <h3>Total: <span class="count-num">{{this.total}}</span></h3>
          </div>
          <div class="count">
            <h3>Priorities: <span class="count-num">{{this.priorityCount}}</span></h3>
          </div>
          <div class="count">
            <h3>Updated Today: <span class="count-num">{{this.updatedToday}}</span></h3>
          </div>
          <br/>
          <br/>
          <h4 style="margin-left: 0" class="filter">By Priority:</h4>
          <input type="checkbox" v-model="priority">
          <br/>
          <h4 style="margin-left: 0" class="filter">Furnished:</h4>
          <input type="checkbox" v-model="furnished">
          <br/>
          <h4 style="margin-left: 0" class="filter">Unfurnished:</h4>
          <input type="checkbox" v-model="unfurnished">
        </div>
        <div id="load-button">
          <button id="load" class="btn" type="button" v-on:click="examineNR">LOAD</button>
        </div>
        <span class="searchTable" v-on:click="loadNR">
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
    nrSearchVal(){
      return this.nrSearch;
    },
    priorityChecked(){
      if (this.priority)
        return true;
      return false;
    },
    furnishedChecked(){
      if (this.furnished)
        return true;
      return false;
    },
    unfurnishedChecked(){
      if (this.unfurnished)
        return true;
      return false;
    },
  },
  data: () => ({
    fixHeaderAndSetBodyMaxHeight: 400,
    tblStyle: {'table-layout': 'fixed'},
    tblClass: ['table-bordered'],
    columns: (() => {
      const cols =[
        {title: 'NR#', field: 'nrNum', label: 'nr', thStyle: {background: '#fffae6'},visible: true},
        {title: 'Examiner', field: 'activeUser', thStyle: {background: '#fffae6'}, label: 'examiner', colStyle: {width:'15%'},visible: true},
        {title: 'State', field: 'stateCd', thStyle: {background: '#fffae6'}, label: 'state', visible: true},
        {title: 'Priority', field: 'priorityCd', thStyle: {background: '#fffae6'}, label: 'priority', visible: true},
        {title: 'Furnished', field: 'furnished', label: 'furnished', thStyle: {background: '#fffae6'}, visible: true},
        {title: 'NOB', field: 'natureBusinessInfo', label: 'nob', thStyle: {background: '#fffae6'}, visible: true},
        {title: 'Names', field: 'names', label: 'name', thStyle: {background: '#fffae6'}, colStyle: {width:'15%'},visible: true},
        {title: 'Last Update', field: 'lastUpdate', label: 'lastUpdate', thStyle: {background: '#fffae6'}, visible: true},
        {title: 'Submitted', field: 'submittedDate', label: 'submittedDate', thStyle: {background: '#fffae6'}, visible: true},
        {title: 'Req Type', field: 'requestTypeCd', label: 'reqType', thStyle: {background: '#fffae6'}, visible: false},
      ]
      return cols;
    })(),
    pageSizeOptions: [5, 10, 20, 50, 100],
    data: [],
    sortedData: [],
    total: 0,
    query: {},
    states:['ALL', 'HOLD', 'INPROGRESS', 'DRAFT', 'EXPIRED', 'CANCELLED', 'APPROVED', 'CONDITIONAL', 'REJECTED'],
    stateSort: '',
    username: '',
    nrSearch: '',
    priority: true,
    furnished: true,
    unfurnished: true,
    compName: '',
    selectedNR:'',
    priorityCount:null,
    updatedToday: null,
  }),
  mounted() {
    this.$store.dispatch('getSearchDataJSON');
    this.sortedData = this.populateTable(this.searchData);
    this.stateSort = this.currentStateSort;
    console.log('DATA',this.data);
  },
  watch: {

    searchData: {
      handler() {
        this.sortedData = this.populateTable(this.searchData);
        this.filterBySearch(this.username,this.nrSearch, this.priority, this.compName, this.furnished, this.unfurnished);
        this.handleQueryChange();
      }
    },
    stateSort: {
      handler(newState) {
        this.currentStateSort = newState;
        if (newState === 'ALL')
          newState = '';
        if (newState === 'HOLD')
          this.priority = true;
        this.$store.commit('searchQuery','?queue='+newState.toLowerCase());
        this.$store.dispatch('getSearchDataJSON');
      }
    },
    nrSearch: {
      handler(newNrSearch) {
        this.filterBySearch(this.username, newNrSearch, this.priority, this.compName, this.furnished, this.unfurnished);
        this.handleQueryChange();
      }
    },
    username: {
      handler(username) {
        this.filterBySearch(username, this.nrSearch, this.priority, this.compName, this.furnished, this.unfurnished);
        this.handleQueryChange();
      }
    },
    compName: {
      handler(compName) {
        this.filterBySearch(this.username, this.nrSearch, this.priority, compName, this.furnished, this.unfurnished);
        this.handleQueryChange();
      }
    },
    priorityChecked: {
      handler(priority) {
        this.filterBySearch(this.username, this.nrSearch, priority, this.compName, this.furnished, this.unfurnished);
        this.handleQueryChange();
      }
    },
    furnishedChecked: {
      handler(furnished) {
        this.filterBySearch(this.username, this.nrSearch, this.priority, this.compName, furnished, this.unfurnished);
        this.handleQueryChange();
      }
    },
    unfurnishedChecked: {
      handler(unfurnished) {
        this.filterBySearch(this.username, this.nrSearch, this.priority, this.compName, this.furnished, unfurnished);
        this.handleQueryChange();
      }
    },
    query: {
      handler() {
        this.handleQueryChange();
      },
      deep: true
    }
  },
  methods: {
    populateTable(searchData){
      if (searchData != null) {
        let data = searchData.nameRequests;
        let orderedBySubmitData =[];
        // organize names and dates //
          for (let i=0; i<data.length;i++) {
            // organize names column //
            if (data[i].activeUser != undefined)
              data[i].activeUser += ' ';
            for (let namesIter=0; namesIter<data[i].names.length; namesIter++) {
              if (data[i].names[namesIter].choice !== undefined) {
                if (data[i].names[namesIter].choice !== namesIter + 1) {
                  let tmp = data[i].names[data[i].names[namesIter].choice - 1];
                  data[i].names[data[i].names[namesIter].choice - 1] = data[i].names[namesIter];
                  data[i].names[namesIter] = tmp;
                }
              }
            }
            let namesStr = '';
            for (let namesIter=0; namesIter<data[i].names.length; namesIter++) {
              if (data[i].names[namesIter].choice !== undefined) {
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
            orderedBySubmitData.splice(0,0,data[i]);
          }
        // ----------------------------------- //
        return orderedBySubmitData;
      }
      return [];
    },

    filterBySearch(username,nrSearch,priority,compName,furnished,unfurnished) {
      this.query.offset = 0;

      let allData = this.populateTable(this.searchData);
      let newData = [];

      nrSearch = nrSearch.replace(/^NR+/gm,'').trim();
      if (nrSearch !== '') {
        for (let i = 0; i < allData.length; i++) {
          let nr = allData[i].nrNum.replace(/^NR+/gm,'').trim()
          if (nr.search(nrSearch)!== -1)
            newData.push(allData[i]);
        }
        this.sortedData = newData;
      } else {
        this.sortedData = allData;
      }
      newData = [];
      if (username !== '') {
        for (let i = 0; i < this.sortedData.length; i++) {
          if (this.sortedData[i].activeUser.toLowerCase().search(username)!== -1)
            newData.push(this.sortedData[i]);
        }
        this.sortedData = newData;
      }
      newData = [];
      if (compName !== '') {
        for (let i = 0; i < this.sortedData.length; i++) {
          if (typeof this.sortedData[i].names === "string" && this.sortedData[i].names.toLowerCase().search(compName.toLowerCase())!== -1)
            newData.push(this.sortedData[i]);
        }
        this.sortedData = newData;
      }
      newData = [];
      let priCount = 0;
      if (priority) {
        for (let i = 0; i < this.sortedData.length; i++) {
          if (this.sortedData[i].priorityCd != null && this.sortedData[i].priorityCd.toLowerCase() === 'y') {
            newData.splice(0,0,this.sortedData[i]);
            priCount++;
          } else {
            newData.push(this.sortedData[i]);
          }
        }
        this.sortedData = newData;
        this.priorityCount = priCount;
      }
      newData = [];
      if (!furnished) {
        console.log("sorting not furnished")
        for (let i = 0; i < this.sortedData.length; i++) {
          if (this.sortedData[i].furnished == undefined || this.sortedData[i].furnished.toUpperCase() !== 'Y')
            newData.push(this.sortedData[i]);
        }
        this.sortedData = newData;
      }
      newData = [];
      if (!unfurnished) {
        console.log("sorting not unfurnished")
        for (let i = 0; i < this.sortedData.length; i++) {
          if (this.sortedData[i].furnished == undefined || this.sortedData[i].furnished.toUpperCase() !== 'N')
            newData.push(this.sortedData[i]);
        }
        this.sortedData = newData;
      }
      let date = new Date();
      let today = date.getDate();
      this.updatedToday = 0;
      for (let i = 0; i < this.sortedData.length; i++)
        if (this.sortedData[i].lastUpdate != undefined && this.sortedData[i].lastUpdate.substring(9,11) === String(today))
          this.updatedToday++;
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
    handleQueryChange(){
      this.selectedNR = '';
      $(".select").removeClass('select');
      let data = [];
      let limit = this.query.limit;
      let offset = this.query.offset;

      for (let i = offset; i < offset + limit && i < this.sortedData.length; i++)
        data.push(this.sortedData[i]);
      this.data = data;

      this.total = this.sortedData.length;
      this.selectedNR = null;
      $("#load").removeClass("btn-primary");
    },
  },
}
</script>

<style scoped>
  h3 {
  font-size: 11px;
  text-transform: uppercase;
  font-weight: bold;
  color: #9c9cb9;
  }
  .searchTable {
    background: #fffae6;
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
    float: right;
    margin-left: 20px;
  }
  #load-button {
    display: inline-block;
    margin: 30px 0 0;
  }
</style>
<style>
  .table-striped tbody tr.select {
    background-color: #ffa;
  }

</style>
