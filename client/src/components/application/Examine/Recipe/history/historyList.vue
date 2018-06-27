/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="row ConflictList">

        <select v-model="conflictMatch" class="form-control" size="17" border="0"
                @change="setConflictInfo()">
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
    name: 'historyList',
    data: {
      tmp: null,
    },
    computed: {
      conflictData() {
        return  this.$store.getters.conflictList;
      },
      conflictMatch:  {
        get: function() {
          return '';
        },
        set: function(value) {
          this.$store.commit('currentMatch', value);
          this.tmp = value
        }
      }
    },
    methods: {
      setConflictInfo() {
        console.log('setConflictInfo')
        this.$store.dispatch('getConflictInfo', this.tmp)
      }
    }
  }
</script>

<style scoped>
</style>
