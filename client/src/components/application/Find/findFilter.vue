<!--eslint-disable-->
<template>
    <div>
      <div class="container-fluid">
        <div class="search-select">
          <h4>Sort</h4>
          <select>
            <option value="none">None</option>
            <option value="HOLD">On Hold</option>
            <option value="INPROGRESS">In Progress</option>
          </select>
        </div>
        <span class="searchTable">
            <datatable v-bind="$data" />
        </span>
      </div>
    </div>
</template>

<script defer>
/* eslint-disable */
// var tmpJSON = [
//   {
//     "name": "my good goods",
//     "nr": "5432198",
//     "examiner": "kial",
//     "approved": false,
//     "rejected": true,
//     "unfurnished": false,
//     "priority": 10,
//     "h": false,
//     "edited": true
//   },
//   {
//     "name": "my goodies",
//     "nr": "5432190",
//     "examiner": "kial",
//     "approved": false,
//     "rejected": false,
//     "unfurnished": true,
//     "priority": 9,
//     "h": true,
//     "edited": false
//   },
//   {
//     "name": "my goods",
//     "nr": "5432191",
//     "examiner": "jeff",
//     "approved": true,
//     "rejected": false,
//     "unfurnished": true,
//     "priority": 8,
//     "h": false,
//     "edited": true
//   },
//   {
//     "name": "my goodly goods",
//     "nr": "5432192",
//     "examiner": "jeff",
//     "approved": false,
//     "rejected": false,
//     "unfurnished": true,
//     "priority": 5,
//     "h": true,
//     "edited": false
//   },
//   {
//     "name": "my goodly goods",
//     "nr": "5432192",
//     "examiner": "jeff",
//     "approved": false,
//     "rejected": false,
//     "unfurnished": true,
//     "priority": 5,
//     "h": true,
//     "edited": false
//   },
//   {
//     "name": "my goodly goods",
//     "nr": "5432192",
//     "examiner": "jeff",
//     "approved": false,
//     "rejected": false,
//     "unfurnished": true,
//     "priority": 5,
//     "h": true,
//     "edited": false
//   },
//   {
//     "name": "my goodly goods",
//     "nr": "5432192",
//     "examiner": "jeff",
//     "approved": false,
//     "rejected": false,
//     "unfurnished": true,
//     "priority": 7,
//     "h": true,
//     "edited": false
//   },
//   {
//     "name": "my goodly goods",
//     "nr": "5432192",
//     "examiner": "jeff",
//     "approved": false,
//     "rejected": false,
//     "unfurnished": true,
//     "priority": 5,
//     "h": true,
//     "edited": false
//   },
//   {
//     "name": "my goodly goods",
//     "nr": "5432192",
//     "examiner": "jeff",
//     "approved": false,
//     "rejected": false,
//     "unfurnished": true,
//     "priority": 5,
//     "h": true,
//     "edited": false
//   },
//   {
//     "name": "my goody goods",
//     "nr": "5432192",
//     "examiner": "jeff",
//     "approved": false,
//     "rejected": false,
//     "unfurnished": true,
//     "priority": 4,
//     "h": true,
//     "edited": false
//   },
//   {
//     "name": "my goodly goods",
//     "nr": "5432192",
//     "examiner": "jeff",
//     "approved": false,
//     "rejected": false,
//     "unfurnished": true,
//     "priority": 1,
//     "h": true,
//     "edited": false
//   },
// ];

export default {
  name: 'findfilter',
  computed: {
    searchData() {
      if (this.$store.getters.searchDataJSON != null) {
        console.log('search data: ', this.$store.getters.searchDataJSON.nameRequests);
        this.total = this.$store.getters.searchDataJSON.nameRequests.length;
        return this.$store.getters.searchDataJSON.nameRequests;
      }
      return null;
    }
  },
  data: () => ({
    fixHeaderAndSetBodyMaxHeight: 400,
    tblStyle: {'table-layout': 'fixed'},
    tblClass: ['table-bordered'],
    columns: (() => {
      const cols =[
        {title: 'NR#', field: 'nrNum', label: 'nr', thStyle: {background: '#fffae6'}, sortable: true, visible: true},
        {title: 'Examiner', field: 'activeUser', thStyle: {background: '#fffae6'}, label: 'examiner', sortable: true, visible: true},
        {title: 'State', field: 'stateCd', thStyle: {background: '#fffae6'}, label: 'state', sortable: true, visible: true},
        {title: 'Priority', field: 'priorityCd', thStyle: {background: '#fffae6'}, label: 'priority', sortable: true, visible: true},
        {title: 'Furnished', field: 'furnished', label: 'furnished', thStyle: {background: '#fffae6'}, visible: true},
        {title: 'Req Type', field: 'requestTypeCd', label: 'reqType', thStyle: {background: '#fffae6'}, visible: true},
        {title: 'NOB', field: 'natureBusinessInfo', label: 'nob', thStyle: {background: '#fffae6'}, sortable: true, visible: true},
        {title: 'Names', field: 'names', label: 'name', thStyle: {background: '#fffae6'}, sortable: true, visible: true},
      ]
      const groupsDef = {
        Normal:['NR#','Examiner','State','Priority','Furnished','Req Type','NOB','Names'],
        Sortable:[]
      }
      return cols.map(col=> {
        Object.keys(groupsDef).forEach(groupName => {
          if (groupsDef[groupName].includes(col.title)) {
            col.group = groupName;
          }
        })
        return col;
      })
    })(),
    pageSizeOptions: [5, 10, 15, 20],
    data: [],
    selection: [],
    total: 0,
    // query: {limit: 5, offset: 0, sort:'priority', order:'asc'}
    query: {},
    options: {
      columnsDropdown: true,
      columnsDisplay: ['examiner']
    },
  }),
  mounted() {
    console.log(this.$store.dispatch('getSearchDataJSON'));
    // this.data = tmpJSON;
    console.log(this.searchData);
    console.log(this.data);
    if (this.searchData != null)
      this.data = this.searchData;
    // console.log('populateTable');
    // this.data = this.populateTable(this.searchData);
    // console.log('this.data: ',this.data)
  },
  watch: {
    HeaderSettings: {
      handler() {
        console.log('button click')
      }
    },
    selection: {
      handler() {
        let selection = this.selection;
        if (selection[0] !== undefined) {
          // console.log(selection[0]);
          console.log(selection[0].name);
        }
      }
    },
    // query: {
    //   handler() {
    //     this.handleQueryChange();
    //   },
    //   deep: true
    // }
  },
  methods: {
    // populateTable(data){
    //   let info = [];
    //   let i;
    //   for (i=0;i<data.length;i++) {
    //     console.log(data[i]);
    //     info.push({
    //       "activeUser": data[i].activeUser,
    //       "nrNum": "test",
    //       "stateCd": "test",
    //       "priorityCd": "test",
    //       "furnished": "test",
    //       "requestTypeCd": "test",
    //       "natureBusinessInfo": "test",
    //       "names": "test",
    //     })
    //   }
    //   console.log(info);
    //   // console.log(tmpJSON);
    //   return info;
    // },
    // handleQueryChange(){
    //   let data = [];
    //   let limit = this.query.limit;
    //   let offset = this.query.offset;
    //   let sort = this.query.sort;
    //   let order = this.query.order;
    //   // console.log(offset);
    //   // console.log(limit);
    //   // console.log(sort);
    //
    //   let i;
    //   let sortedData = tmpJSON; //make this = this.data when thinking of applying multiple sorts -- have a clear sorts button
    //   if (sort !== '') {
    //     sortedData = [];
    //     for (i = 0; i < tmpJSON.length; i++) {
    //       let insert = false;
    //       if (sort === 'h' && tmpJSON[i].h === false) {insert = true;}
    //       if (sort === 'edited' && tmpJSON[i].edited === false) {insert = true;}
    //       if (sort === 'unfurnished' && tmpJSON[i].unfurnished === false) {insert = true;}
    //       if (sort === 'approved' && tmpJSON[i].approved === false) {insert = true;}
    //       if (sort === 'rejected' && tmpJSON[i].rejected === false) {insert = true;}
    //
    //       let s;
    //       for (s = 0; s < sortedData.length; s++) {
    //         if (sort === 'priority' || sort === 'h') {
    //           // if (order === 'asc' || sort === 'h') {
    //             if (tmpJSON[i].priority < sortedData[s].priority && !insert) {
    //               sortedData.splice(s, 0, tmpJSON[i]);
    //               insert = true;
    //               break;
    //             }
    //           // } else {
    //           //   if (tmpJSON[i].priority > sortedData[s].priority) {
    //           //     sortedData.splice(s, 0, tmpJSON[i]);
    //           //     insert = true;
    //           //     break;
    //           //   }
    //           // }
    //         }
    //         if (sort === 'examiner' || sort === 'edited' || sort === 'unfurnished' || sort === 'approved' || sort === 'rejected') {
    //           if (tmpJSON[i].examiner < sortedData[s].examiner && !insert) {
    //             sortedData.splice(s, 0, tmpJSON[i]);
    //             insert = true;
    //             break;
    //           }
    //         }
    //         if (sort === 'name') {
    //           if (tmpJSON[i].name < sortedData[s].name) {
    //             sortedData.splice(s, 0, tmpJSON[i]);
    //             insert = true;
    //             break;
    //           }
    //         }
    //         if (sort === 'nr') {
    //           if (tmpJSON[i].nr < sortedData[s].nr) {
    //             sortedData.splice(s, 0, tmpJSON[i]);
    //             insert = true;
    //             break;
    //           }
    //         }
    //       }
    //       if (insert !== true) {
    //         sortedData.push(tmpJSON[i]);
    //       }
    //     }
    //     this.total = sortedData.length;
    //     this.data = sortedData;
    //   }
    //
    //   for (i = offset; i < offset + limit && i < sortedData.length; i++)
    //     data.push(sortedData[i]);
    //   this.data = data;
    //
    //   // this.total = data.length;
    // },
  },
}
</script>

<style scoped>
  .searchTable {
    background: #fffae6;
  }
 </style>
