<!--eslint-disable-->
<template>
    <div>
      <div class="container-fluid">
        <div class="search-select">
          <h4 style="margin-left: 0" class="filter">States:</h4>
          <select v-model="stateSort">
                <option v-for="state in states" :value="state">{{state}}</option>
          </select>
          <h4 class="filter">NR</h4>
          <input v-model="nrSearch" placeholder="0000000"/>
          <h4 class="filter">Examiner:</h4>
          <input v-model="username" placeholder="Username"/>
          <h4 class="filter">By Priority:</h4>
          <input type="checkbox" v-model="priority">
        </div>
        <span class="searchTable" v-on:click="loadNR">
            <datatable v-bind="$data"/>
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
    searchData() {
      console.log('test: ',this.$store.getters.searchDataJSON);
      return this.$store.getters.searchDataJSON;
    },
    nrNum() {
      // this.$store.dispatch('resetValues');
      // document.getElementById('nameExamine').click();
      return this.$store.getters.nrNumber;
    },
    examiner(){
      console.log('examiner: ', this.username);
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
  },
  props: ['row'],
  data: () => ({
    props: ['row'],
    fixHeaderAndSetBodyMaxHeight: 400,
    tblStyle: {'table-layout': 'fixed'},
    tblClass: ['table-bordered'],
    columns: (() => {
      const cols =[
        {title: 'NR#', field: 'nrNum', label: 'nr', thStyle: {background: '#fffae6'}, visible: true, clickable: true},
        {title: 'Examiner', field: 'activeUser', thStyle: {background: '#fffae6'}, label: 'examiner', sortable: true, visible: true},
        {title: 'State', field: 'stateCd', thStyle: {background: '#fffae6'}, label: 'state', sortable: true, visible: true},
        {title: 'Priority', field: 'priorityCd', thStyle: {background: '#fffae6'}, label: 'priority', sortable: true, visible: true},
        {title: 'Furnished', field: 'furnished', label: 'furnished', thStyle: {background: '#fffae6'}, visible: true},
        {title: 'Req Type', field: 'requestTypeCd', label: 'reqType', thStyle: {background: '#fffae6'}, visible: true},
        {title: 'NOB', field: 'natureBusinessInfo', label: 'nob', thStyle: {background: '#fffae6'}, visible: true},
        {title: 'Names', field: 'names', label: 'name', thStyle: {background: '#fffae6'}, visible: true},
      ]
      // const groupsDef = {
      //   Normal:['NR#','Examiner','State','Priority','Furnished','Req Type','NOB','Names'],
      //   Sortable:[]
      // }
      // return cols.map(col=> {
      //   Object.keys(groupsDef).forEach(groupName => {
      //     if (groupsDef[groupName].includes(col.title)) {
      //       col.group = groupName;
      //     }
      //   })
      //   return col;
      // })
      return cols;
    })(),
    pageSizeOptions: [5, 10, 15, 20],
    data: [],
    sortedData: [],
    selection: [],
    item: [],
    total: 0,
    // query: {limit: 5, offset: 0, sort:'priority', order:'asc'}
    query: {},
    states:['ALL', 'HOLD', 'INPROGRESS', 'APPROVED', 'REJECTED', 'CANCELLED'],
    stateSort: "ALL",
    username: '',
    nrSearch: '',
    priority: true,
  }),
  mounted() {
    this.$store.dispatch('getSearchDataJSON');
    this.sortedData = this.populateTable(this.searchData);
    console.log('DATA',this.data);
  },
  watch: {
    selection: {
      handler() {
        let selection = this.selection;
        if (selection[0] !== undefined) {
          // console.log(selection[0]);
          console.log(selection[0]);
        }
      }
    },
    searchData: {
      handler() {
        this.sortedData = this.populateTable(this.searchData);
        this.filterBySearch(this.username,this.nrSearch, this.priority);
        this.handleQueryChange();
      }
    },
    stateSort: {
      handler(newState) {
        if (newState === 'ALL')
          newState = '';
        if (newState === 'HOLD')
          this.priority = true;
        this.$store.commit('searchQuery','?queue='+newState.toLowerCase());
        this.$store.dispatch('getSearchDataJSON');
      }
    },
    nrSearchVal: {
      handler(newNrSearch) {
        this.filterBySearch(this.username, newNrSearch, this.priority);
        this.handleQueryChange();
      }
    },
    examiner: {
      handler(username) {
        this.filterBySearch(username, this.nrSearch, this.priority);
        this.handleQueryChange();
      }
    },
    priorityChecked: {
      handler(priority) {
        this.filterBySearch(this.username, this.nrSearch, priority)
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

        // organize names column //
          for (let i=0; i<data.length;i++) {
            for (let namesIter=0; namesIter<data[i].names.length; namesIter++) {
              if (data[i].names[namesIter].choice !== undefined) {
                if (data[i].names[namesIter].choice !== namesIter + 1) {
                  let tmp = data[i].names[data[i].names[namesIter].choice - 1];
                  data[i].names[data[i].names[namesIter].choice - 1] = data[i].names[namesIter];
                  data[i].names[namesIter] = tmp;
                }
              }
            }
            // let namesStr = '';
            for (let namesIter=0; namesIter<data[i].names.length; namesIter++) {
              if (data[i].names[namesIter].choice !== undefined) {
                data[i].names[namesIter] = data[i].names[namesIter].choice + '. ' + data[i].names[namesIter].name;
                // namesStr += data[i].names[namesIter] + '\n';
              }
            }
            // console.log(namesStr);
            // data[i].names = namesStr;
          }
        // ----------------------------------- //
        return data;
      }
      return [];
    },

    filterBySearch(username,nrSearch,priority) {
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
      if (priority) {
        for (let i = 0; i < this.sortedData.length; i++) {
          if (this.sortedData[i].priorityCd != null && this.sortedData[i].priorityCd.toLowerCase() === 'y') {
            newData.splice(0,0,this.sortedData[i]);
          } else {
            newData.push(this.sortedData[i]);
          }
        }
        this.sortedData = newData;
      }
    },
    // searchByNR(search) {
    //   let allData = this.populateTable(this.searchData);
    //   let newData = [];
    //   if (search !== '') {
    //     for (let i = 0; i < allData.length; i++) {
    //       console.log('compare ',allData[i].nrNum.toLowerCase(), 'has ', search);
    //       let nr = allData[i].nrNum.replace(/^NR+/gm,'').trim()
    //       if (nr.search(search)!== -1)
    //         newData.push(allData[i]);
    //     }
    //     console.log('newData: ',newData);
    //     this.sortedData = newData;
    //     console.log('this.data: ',this.data);
    //   } else {
    //     this.sortedData = allData;
    //   }
    // },
    // searchByExaminer(search) {
    //   let allData = this.populateTable(this.searchData);
    //   search = search.toLowerCase();
    //   let newData = [];
    //   if (search !== '') {
    //     for (let i = 0; i < allData.length; i++) {
    //       console.log('compare ',allData[i].activeUser.toLowerCase(), 'has ', search);
    //       if (allData[i].activeUser.toLowerCase().search(search)!== -1)
    //         newData.push(allData[i]);
    //     }
    //     console.log('newData: ',newData);
    //     this.sortedData = newData;
    //     console.log('this.data: ',this.data);
    //   } else {
    //     this.sortedData = allData;
    //   }
    // },
    loadNR(event) {
      console.log(event);
      // check if this is a body row (ie: in tbody)
       var row = $(event.target).closest('tr')[0];
       if (row !== undefined) {
         if (row.parentNode.tagName === 'TBODY') {

           console.log('Row clicked: ', row);
           console.log('row[1] ', row.children[1].innerHTML.trim());

           let nr = row.children[1].innerHTML.trim();
           // this.$store.dispatch('resetValues');
           // this.$store.commit('nrNumber',nr);
           // console.log('new nr: ',this.nrNum);
           // document.getElementById('nameExamine').click(); //put in computed that fires based on nrNumber change

         } else {
           // do nothing
         }
       } else {
         // do nothing
       }
    },
    handleQueryChange(){
      let allData = this.populateTable(this.searchData);
      let data = [];
      let limit = this.query.limit;
      let offset = this.query.offset;
      // let sort = this.query.sort;
      // let order = this.query.order;
      // console.log(offset);
      // console.log(limit);
      // console.log(sort);

      for (let i = offset; i < offset + limit && i < this.sortedData.length; i++)
        data.push(this.sortedData[i]);
      this.data = data;

      this.total = this.sortedData.length;
    },
  },
}
</script>

<style scoped>
  .searchTable {
    background: #fffae6;
  }
  .filter {
    display: inline-block;
    margin-left: 10px;
  }
 </style>
