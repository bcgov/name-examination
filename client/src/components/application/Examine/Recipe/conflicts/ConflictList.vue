<!--eslint-disable-->
<template>

    <div class="col conflict-list-parent-col">
      <div class="row conflict-list-view">
        <select id="conflict-list" v-if="conflictData.length > 0"  v-model="selectedConflict" class="form-control" size="17" border="0"
                @click="check_deselect" tabindex="2">
          <option v-for="(option, index) in conflictData" :key="option.value"
            v-bind:value="{nrNumber: option.nrNumber, text: option.text, source: option.source, index: index}">
            {{ option.text }}
          </option>

        </select>
        <div v-else class="empty-list">( No data )</div>

      </div>

    </div>

</template>

<script>
/* eslint-disable */
  export default {
    name: 'ConflictList',
    data: function () {
      return {
        selectedConflict: '',
      }
    },
    computed: {
      conflictData() {
        var data = [{ text:'< no exact match >' }];
        if (this.$store.getters.exactMatchesConflicts && this.$store.getters.exactMatchesConflicts.length > 0) {
          data = this.$store.getters.exactMatchesConflicts;
        }
        data = data.concat([{ text:'***' }]);
        if (this.$store.getters.synonymMatchesConflicts && this.$store.getters.synonymMatchesConflicts.length)
          data = data.concat(this.$store.getters.synonymMatchesConflicts);
        else
          data = data.concat([{ text:'< no synonym match >' }]);
        data = data.concat([{ text:'***' }]);
        if (this.$store.getters.conflictList && this.$store.getters.conflictList.length > 0) {
          data = data.concat(this.$store.getters.conflictList);
        }
        return data;
      },
    },
    mounted() {
      this.selectedConflict = '';
      this.setSelectedConflict();
    },
    methods: {
      check_deselect() {
        if (this.$store.getters.currentConflict === this.selectedConflict)
          this.selectedConflict='';
      },
      setConflictInfo() {
        if (this.selectedConflict != '')
          this.$store.dispatch('getConflictInfo', this.selectedConflict);
      },
      setSelectedConflict() {
        if (this.$store.getters.currentConflict == null && this.conflictData && this.conflictData.length > 0)
          this.selectedConflict = this.conflictData[0];
        else if (this.$store.getters.currentConflict != null)
          this.selectedConflict = this.$store.getters.currentConflict;
      }

    },
    watch: {
      selectedConflict: {
        handler(value) {
          console.log('selectedConflict watcher fired: ', value)
          if (value.source)
            this.$store.commit('currentConflict', value);
          else
            this.$store.commit('currentConflict', null);
          this.setConflictInfo();
        }
      },
      conflictData: {
        handler() {
          console.log('conflict data watcher fired')
          this.$store.commit('currentConflict', null);
          this.setSelectedConflict();
        }
      }
    }
  }
</script>

<style scoped>
  .conflict-list-parent-col {
    min-width: 800px;
  }

  .conflict-list-view {
    padding: 0 10px;
    height: 100%;
  }

  .conflict-list-view option {
    padding: 5px;
  }

  h3, h2 {
    font-size: 15px;
  }

  p {
    font-size: 14px;
  }

</style>
