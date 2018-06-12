/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="row ConflictList">

          <select v-model="nrNumberMatch" class="form-control" size="15" >
            <option v-for="option in conflictData" v-bind:value="option.nrNumber"
                    v-bind:key="option.nrNumber">
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
    computed: {
      name() {
        return  this.$store.getters.firstName;
      },
      conflictData() {
        return  this.$store.getters.conflictList;
      },
      nrNumberMatch: {
        get: function() {
          return this.$store.getters.nrNumberMatch;
        },
        set: function(value) {
          console.log("match:" + value)
          this.$store.commit('nrNumberMatch', value);
        }
      },

    },
    methods: {
    }
  }
</script>

<style scoped>
</style>
