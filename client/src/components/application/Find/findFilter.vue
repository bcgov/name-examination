/* eslint-disable */
<template>
    <span class="searchTable">
        <datatable v-bind="$data" />
    </span>
</template>

<script defer>
/* eslint-disable */
var tmpJSON = [
  {
    "name": "my good goods",
    "nr": "5432198",
    "examiner": "kial",
    "approved": false,
    "rejected": true,
    "unfurnished": false,
    "priority": 10,
    "h": false,
    "edited": true
  },
  {
    "name": "my goodies",
    "nr": "5432190",
    "examiner": "kial",
    "approved": false,
    "rejected": false,
    "unfurnished": true,
    "priority": 9,
    "h": true,
    "edited": false
  },
  {
    "name": "my goods",
    "nr": "5432191",
    "examiner": "jeff",
    "approved": true,
    "rejected": false,
    "unfurnished": true,
    "priority": 8,
    "h": false,
    "edited": true
  },
  {
    "name": "my goodly goods",
    "nr": "5432192",
    "examiner": "jeff",
    "approved": false,
    "rejected": false,
    "unfurnished": true,
    "priority": 5,
    "h": true,
    "edited": false
  },
  {
    "name": "my goodly goods",
    "nr": "5432192",
    "examiner": "jeff",
    "approved": false,
    "rejected": false,
    "unfurnished": true,
    "priority": 5,
    "h": true,
    "edited": false
  },
  {
    "name": "my goodly goods",
    "nr": "5432192",
    "examiner": "jeff",
    "approved": false,
    "rejected": false,
    "unfurnished": true,
    "priority": 5,
    "h": true,
    "edited": false
  },
  {
    "name": "my goodly goods",
    "nr": "5432192",
    "examiner": "jeff",
    "approved": false,
    "rejected": false,
    "unfurnished": true,
    "priority": 7,
    "h": true,
    "edited": false
  },
  {
    "name": "my goodly goods",
    "nr": "5432192",
    "examiner": "jeff",
    "approved": false,
    "rejected": false,
    "unfurnished": true,
    "priority": 5,
    "h": true,
    "edited": false
  },
  {
    "name": "my goodly goods",
    "nr": "5432192",
    "examiner": "jeff",
    "approved": false,
    "rejected": false,
    "unfurnished": true,
    "priority": 5,
    "h": true,
    "edited": false
  },
  {
    "name": "my goody goods",
    "nr": "5432192",
    "examiner": "jeff",
    "approved": false,
    "rejected": false,
    "unfurnished": true,
    "priority": 4,
    "h": true,
    "edited": false
  },
  {
    "name": "my goodly goods",
    "nr": "5432192",
    "examiner": "jeff",
    "approved": false,
    "rejected": false,
    "unfurnished": true,
    "priority": 1,
    "h": true,
    "edited": false
  },
];

export default {
  name: 'findfilter',
  data: () => ({
    fixHeaderAndSetBodyMaxHeight: 400,
    tblStyle: {'table-layout': 'fixed'},
    tblClass: ['table-bordered'],
    columns: (() => {
      const cols =[
        {title: 'Name', field: 'name', label: 'name', thStyle: {background: '#fffae6'}, sortable: true, visible: true},
        {title: 'NR#', field: 'nr', label: 'nr', thStyle: {background: '#fffae6'}, sortable: true, visible: true},
        {title: 'Examiner', field: 'examiner', thStyle: {background: '#fffae6'}, label: 'examiner', sortable: true, visible: true},
        {title: 'Approved', field: 'approved', thStyle: {background: '#fffae6'}, label: 'approved', sortable: true, visible: true},
        {title: 'Rejected', field: 'rejected', thStyle: {background: '#fffae6'}, label: 'rejected', sortable: true, visible: true},
        {title: 'Unfurnished', field: 'unfurnished', label: 'unfurnished', thStyle: {background: '#fffae6'}, sortable: true, visible: true},
        {title: 'Priority', field: 'priority', label: 'priority', thStyle: {background: '#fffae6'}, sortable: true, visible: true},
        {title: 'Hold Que', field: 'h', label: 'h', thStyle: {background: '#fffae6'}, sortable: true, visible: true},
        {title: 'Edited', field: 'edited', label: 'edited', thStyle: {background: '#fffae6'}, sortable: true, visible: true},
      ]
      const groupsDef = {
        Normal:['Name','NR#','Examiner','Approved','Rejected','Unfurnished'],
        Sortable:['Priority','Hold Que','Edited']
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
    total: tmpJSON.length,
    // query: {limit: 5, offset: 0, sort:'priority', order:'asc'}
    query: {},
    options: {
      columnsDropdown: true,
      columnsDisplay: ['examiner']
    },
  }),
  mounted() {
    this.data = tmpJSON;
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
    query: {
      handler() {
        this.handleQueryChange();
      },
      deep: true
    }
  },
  methods: {
    handleQueryChange(){
      let data = [];
      let limit = this.query.limit;
      let offset = this.query.offset;
      let sort = this.query.sort;
      let order = this.query.order;
      // console.log(offset);
      // console.log(limit);
      // console.log(sort);

      let i;
      let sortedData = tmpJSON; //make this = this.data when thinking of applying multiple sorts -- have a clear sorts button
      if (sort !== '') {
        sortedData = [];
        for (i = 0; i < tmpJSON.length; i++) {
          let insert = false;
          if (sort === 'h' && tmpJSON[i].h === false) {insert = true;}
          if (sort === 'edited' && tmpJSON[i].edited === false) {insert = true;}
          if (sort === 'unfurnished' && tmpJSON[i].unfurnished === false) {insert = true;}
          if (sort === 'approved' && tmpJSON[i].approved === false) {insert = true;}
          if (sort === 'rejected' && tmpJSON[i].rejected === false) {insert = true;}

          let s;
          for (s = 0; s < sortedData.length; s++) {
            if (sort === 'priority' || sort === 'h') {
              // if (order === 'asc' || sort === 'h') {
                if (tmpJSON[i].priority < sortedData[s].priority && !insert) {
                  sortedData.splice(s, 0, tmpJSON[i]);
                  insert = true;
                  break;
                }
              // } else {
              //   if (tmpJSON[i].priority > sortedData[s].priority) {
              //     sortedData.splice(s, 0, tmpJSON[i]);
              //     insert = true;
              //     break;
              //   }
              // }
            }
            if (sort === 'examiner' || sort === 'edited' || sort === 'unfurnished' || sort === 'approved' || sort === 'rejected') {
              if (tmpJSON[i].examiner < sortedData[s].examiner && !insert) {
                sortedData.splice(s, 0, tmpJSON[i]);
                insert = true;
                break;
              }
            }
            if (sort === 'name') {
              if (tmpJSON[i].name < sortedData[s].name) {
                sortedData.splice(s, 0, tmpJSON[i]);
                insert = true;
                break;
              }
            }
            if (sort === 'nr') {
              if (tmpJSON[i].nr < sortedData[s].nr) {
                sortedData.splice(s, 0, tmpJSON[i]);
                insert = true;
                break;
              }
            }
          }
          if (insert !== true) {
            sortedData.push(tmpJSON[i]);
          }
        }
        this.total = sortedData.length;
        this.data = sortedData;
      }

      for (i = offset; i < offset + limit && i < sortedData.length; i++)
        data.push(sortedData[i]);
      this.data = data;

      // this.total = data.length;
    },
  },
}
</script>

<style scoped>
  .searchTable {
    background: #fffae6;
  }
 </style>
