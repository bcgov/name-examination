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
    query: {}
  }),
  mounted() {
    this.data = tmpJSON;
  },
  watch: {
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

      let i;
      let sortedData = [];
      if (sort === 'priority' && order === 'asc') {
        for (i = 0; i < tmpJSON.length; i++) {
          let insert = false;
          let s;
          for (s = 0; s < sortedData.length; s++) {
            if (tmpJSON[i].priority < sortedData[s].priority) {
              sortedData.splice(s,0,tmpJSON[i]);
              insert = true;
              break;
            }
          }
          if (insert !== true) {
            sortedData.push(tmpJSON[i]);
          }
        }
        this.data = sortedData;
        this.total = data.length;
      }
      else {
        for (i = offset; i < offset + limit && i < tmpJSON.length; i++)
          data.push(tmpJSON[i]);
        this.data = data;
      }
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
