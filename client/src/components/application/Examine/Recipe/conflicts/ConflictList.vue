<!--eslint-disable-->
<template>
  <div>
    <div class="container-fluid">
      <div class="row conflict-List-view">

        <select v-model="selectedConflict" class="form-control" size="17" border="0"
                @click="check_deselect">
          <option v-for="option in conflictData" :key="option.value"
            v-bind:value="{nrNumber: option.nrNumber, text: option.text, source: option.source}">
            {{ option.text }}
          </option>
        </select>

      </div>

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
        return this.$store.getters.conflictList;
      },
    },
    mounted() {
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
        if (this.$store.getters.currentConflict == null && this.$store.getters.conflictList != null && this.$store.getters.conflictList[0] != null)
          this.selectedConflict = this.$store.getters.conflictList[0];
        else if (this.$store.getters.currentConflict != null)
          this.selectedConflict = this.$store.getters.currentConflict;
      }

    },
    watch: {
      selectedConflict: {
        handler(value) {
          if (value === '')
            this.$store.commit('currentConflict', null);
          else
            this.$store.commit('currentConflict', value);
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
  .conflict-List-view {
    /*background-color: #000000;*/
    padding: 10px;
  }
</style>
