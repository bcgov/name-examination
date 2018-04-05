/* eslint-disable */
<template>
  <div>
    <div class="container">
      <div class="name-sect">
        Names:<br />
        <div class="row">
          <div class="col name1-font">
            <input id="cmp1" v-model="compName1" onclick="setBorder('cmp1')" class='rtb'>
          </div>
        </div>

        <div class="row">
          <div class="col name2-font">
            <input id="cmp2" v-model="compName2" onclick="setBorder('cmp2')" class='rtb'>
          </div>
        </div>

        <div class="row">
          <div class="col name2-font">
            <input id="cmp3" v-model="compName3" onclick="setBorder('cmp3')" class='rtb'>
          </div>
        </div>

       </div>
     </div>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: 'CompName',
    computed: {
      compName1() {
        return this.$store.getters.compName1;
      },
      compName2() {
        return this.$store.getters.compName2;
      },
      compName3() {
        return this.$store.getters.compName3;
      }
    },
    methods: {
     setBorder(id) {
        var tb = document.getElementById(id);
        tb.borderWidth = "1";
     }
    }
  }
</script>

<style scoped>
  .name-sect {
    align-content: left;
    border: 2px solid #eee;
    padding: 4px;
    box-shadow: 0 2px 3px #ccc;
    height: 120px;
    background-color: #FFFFFF;
  }
  .name1-font{
    font-size: xx-large;
    text-align: left;
  }
  .name2-font{
    font-size:large;
    text-align: left;
  }
  .rtb {
    border: 0px;
  }
</style>
