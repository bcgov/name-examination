/* eslint-disable */
<template>
  <div>
    <div class="name-sect">
      <div class="row">
        <div class="col name1-font">
          <p v-shortkey.once="['f1']" @shortkey="runAlert()" v-if="!is_editing">{{ compName1 }}</p>
          <input v-else v-model="compName1" class="form-control" />
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
    mounted() {
    },
    methods: {
      setBorder(id) {
        const tb = document.getElementById(id);
        tb.borderWidth = "1";
      },
      setFocus(id) {
        const ell = document.getElementById(id);
        ell.focus();
      },
      runAlert(){
        alert("Here")
      }
    }
  }
</script>


<style scoped>
  .name-sect {
  }
  .name1-font{
    font-size: 2.2em;
    text-align: left;
  }
  .name2-font{
    font-size:1.2em;
    text-align: left;
  }
  .rtb {
    border: 0px;
  }
</style>
