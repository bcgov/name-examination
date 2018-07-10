<!--eslint-disable-->
<template>
    <div>
      <div class="container-fluid">
        <div class="search-select">
          <h4>Sort</h4>
          <!--<select id="stateSelect">-->
            <!--<option value="none">None</option>-->
            <!--<option value="HOLD">On Hold</option>-->
            <!--<option value="INPROGRESS">In Progress</option>-->
          <!--</select>-->
          <select v-model="state_sort">
                <option v-for="state in states" :value="state">{{state}}</option>
          </select>
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
    selection: [],
    item: [],
    total: 0,
    // query: {limit: 5, offset: 0, sort:'priority', order:'asc'}
    query: {},
    states:['none', 'HOLD', 'INPROGRESS', 'APPROVED', 'REJECTED'],
    state_sort: "none",
  }),
  mounted() {
    this.$store.dispatch('getSearchDataJSON');
    this.data = this.populateTable();
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
          console.log(selection[0]);
        }
      }
    },
    searchData: {
      handler() {
        this.data = this.populateTable();
      }
    },
    state_sort: {
      handler(val) {
        if (val === 'none')
          val = '';
        this.$store.commit('searchQuery','?queue='+val.toLowerCase());
        this.$store.dispatch('getSearchDataJSON');
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
    populateTable(){
      if (this.searchData != null) {
        let data = this.searchData.nameRequests;

        // organize names column //
        for (let i=0; i<data.length;i++) {
          for (let namesIter=0; namesIter<data[i].names.length; namesIter++) {
            if (data[i].names[namesIter].choice !== namesIter+1) {
              let tmp = data[i].names[data[i].names[namesIter].choice-1];
              data[i].names[data[i].names[namesIter].choice-1] = data[i].names[namesIter];
              data[i].names[namesIter] = tmp;
            }
          }
          // let namesStr = '';
          for (let namesIter=0; namesIter<data[i].names.length; namesIter++) {
            data[i].names[namesIter] = data[i].names[namesIter].choice + '. ' + data[i].names[namesIter].name;
            // namesStr += data[i].names[namesIter] + '\n';
          }
          // console.log(namesStr);
          // data[i].names = namesStr;
        }
        // ----------------------------------- //
        return data;
      }
      return [];
    },
    loadNR(event) {
      console.log(event);
      // check if this is a body row (ie: in tbody)
       var row = $(event.target).closest('tr')[0];
       if (row !== undefined) {
         if (row.parentNode.tagName === 'TBODY') {

           console.log('Row clicked: ', row);
           console.log('row[1] ', row.children[1].innerHTML.trim());

           let nr = row.children[1].innerHTML.trim();
           this.$store.dispatch('resetValues')
           this.$store.commit('nrNumber',nr)
           document.getElementById('nameExamine').click();

         } else {
           // do nothing
         }
       } else {
         // do nothing
       }
    }
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
