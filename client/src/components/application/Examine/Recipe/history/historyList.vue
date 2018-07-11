/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="row ConflictList">

        <select v-model="historyMatch" class="form-control" size="17" border="0"
                @change="setHistoryInfo()">
          <option v-for="option in historyJSON.names" :key="option.value"
            v-bind:value="{nrNumber: option.nr_num, text: option.name}">
            {{ option.name }}
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
    computed: {
      historyJSON() {
        return this.$store.getters.historiesJSON;
      },
      historyMatch: {
        get: function () {
          return '';
        },
        set: function (value) {
          this.$store.commit('historyMatch', value);
          this.tmp = value
        }
      }
    },
    methods: {
      setHistoryInfo() {
        console.log('setHistoryInfo with: ', this.tmp);
        this.$store.dispatch('getHistoryInfo', this.tmp);
      },
    }
  }
</script>

<style scoped>
</style>
