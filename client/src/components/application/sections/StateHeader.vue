<!--eslint-disable-->
<template>
  <div class="stateheaderview" v-bind:style="{ 'background-color': bgColor }">
    <p class="state-text">{{currentState}}</p>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: "stateHeader",
    data: function () {
      return {
        bgColor: '',
      }
    },
    computed: {
      currentState() {
        return this.$store.getters.currentState;
      },
    },
    methods: {
      setBGC() {
        switch(this.$store.getters.currentState) {
          case 'HOLD':
            this.bgColor = 'yellow';
            break;
          case 'INPROGRESS':
            this.bgColor = 'green';
            break;
          case 'DRAFT':
            this.bgColor = 'violet';
            break;
          case 'EXPIRED':
            this.bgColor = 'orange';
            break;
          case 'CANCELLED':
            this.bgColor = 'red';
            break;
          case 'APPROVED':
            this.bgColor = 'dodgerblue';
            break;
          case 'CONDITIONAL':
            this.bgColor = 'dodgerblue';
            break;
          case 'REJECTED':
            this.bgColor = 'red';
            break;
          default:
            this.bgColor = 'grey';
        }
      },
    },
    watch: {
      currentState: function (val) {
        this.setBGC();
      }
    }
  }
</script>

<style scoped>
  .stateheaderview {
    margin-left: -15px;
    margin-right: -15px;
    margin-top: -22px;
    margin-bottom: 10px;
  }

  .state-text {
    text-align: center;
    font-size: 1.5em;
  }
</style>
