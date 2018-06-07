/* eslint-disable */
<template>
  <div>
    <div class="name-sect">
      <div class="row">
        <div id="name1Col" class="col name1-font">
          <p v-shortkey.once="['arrowdown']" @shortkey="moveDown()">{{ compName1 }}</p>
          <input v-model="compName1" class="form-control" />
        </div>
      </div>

      <div class="row">
        <div id="name2Col" class="col name2-font">
          <p v-shortkey.once="['arrowdown']" @shortkey="moveDown()">{{ compName2 }}</p>
          <input v-model="compName2" class="form-control" />
        </div>
      </div>

      <div class="row">
        <div id="name3Col" class="col name2-font">
          <p v-shortkey.once="['arrowdown']" @shortkey="moveDown()">{{ compName3 }}</p>
          <input v-model="compName3" class="form-control" />
        </div>
      </div>

      <div class="row">
        <div id="name4Col" class="col">
          <input v-model="currentName" class="form-control" />
          <button>Manual Search</button>
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
      },
      currentName() {
        return this.$store.currentName;
      },
      choiceNum() {
        return this.$store.currentChoice;
      }
    },
    mounted() {
      this.$store.dispatch('getpostgrescompNo');
      this.runRecipe()
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
      moveDown(){
        alert("Here")
        this.$store.dispatch('setNextChoice');
        setFontClassForNames()
        setFocus("name" + choiceNum )
        this.runRecipe()
      },
      runRecipe() {
        this.$store.dispatch('checkConflicts');
        //this.$store.dispatch('checkTradmarks');
        //this.$store.dispatch('checkConsent');
        //this.$store.dispatch('checkHistory');
        //this.$store.dispatch('checkFormat');
      },
      setFontClassForNames(){

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
