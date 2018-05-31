/* eslint-disable */
<template>
  <span>
    <div class="row">

      <!-- details col 1 - Alberta -->
      <div id='div1' class="col-md-6" >
        Alberta
        <div class="row">
          <div class="col">
            <p v-if="!is_editing">{{ nuans }}</p>
            <input v-else v-model="nuans" class="form-control" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <p v-if="!is_editing">{{ nuansDate }}</p>
            <input v-else v-model="nuansDate" class="form-control" />
          </div>
        </div>
<p>------------------------------------------------------</p>
        <div class="row">
            <div class="col add-top-padding" >
                <p v-if="!is_editing">{{ assumedNuans }}</p>
                <input v-else v-model="assumedNuans" class="form-control" />
            </div>
        </div>
        <div class="row">
            <div class="col">
              <p v-if="!is_editing">{{ assumedNuansDate }}</p>
              <input v-else v-model="assumedNuansDate" class="form-control" />
            </div>
        </div>
        <div class="row">
           <div class="col">
               <p v-if="!is_editing">{{ assumedNuansName }}</p>
              <input v-else v-model="assumedNuansName" class="form-control" />
           </div>
        </div>

      </div>

      <!-- details col 2 - Saskatchewan -->
      <div id='div2' class="col-md-6">
       Saskatchewan
        <div class="row">
          <div class="col">
            <p v-if="!is_editing">{{ skNumber }}</p>
            <input v-else v-model="skNumber" class="form-control" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <p v-if="!is_editing">{{ skNumberDate }}</p>
            <input v-else v-model="skNumberDate" class="form-control" />
          </div>
        </div>
<p>------------------------------------------------------</p>
        <div class="row">
            <div class="col add-top-padding" >
                <p v-if="!is_editing">{{ assumedskNumber }}</p>
                <input v-else v-model="assumedskNumber" class="form-control" />
            </div>
        </div>
        <div class="row">
            <div class="col">
              <p v-if="!is_editing">{{ assumedskNumberDate }}</p>
              <input v-else v-model="assumedskNumberDate" class="form-control" />
            </div>
        </div>
        <div class="row">
           <div class="col">
               <p v-if="!is_editing">{{ assumedskName }}</p>
              <input v-else v-model="assumedskName" class="form-control" />
           </div>
        </div>

      </div>

    </div>
</span>
</template>

<script>
  /* eslint-disable */

  export default {
    name: 'nuansInfo',
    computed: {
      is_editing() {
        return  this.$store.getters.is_editing;
      },
      nuans: {
        get: function() {
          return this.$store.getters.nuans;
        },
        set: function(value) {
          this.$store.commit('nuans', value);
        }
      },
      nuansDate: {
        get: function() {
          return this.$store.getters.nuansDate;
        },
        set: function(value) {
          this.$store.commit('nuansDate', value);
        }
      },
      assumedNuans: {
        get: function() {
          return this.$store.getters.assumedNuans;
        },
        set: function(value) {
          this.$store.commit('assumedNuans', value);
        }
      },
      assumedNuansDate: {
        get: function() {
          return this.$store.getters.assumedNuansDate;
        },
        set: function(value) {
          this.$store.commit('assumedNuansDate', value);
        }
      },
      assumedNuansName: {
        get: function() {
          return this.$store.getters.assumedNuansName;
        },
        set: function(value) {
          this.$store.commit('assumedNuansName', value);
        }
      },
      skNumber: {
        get: function() {
          return this.$store.getters.skNumber;
        },
        set: function(value) {
          this.$store.commit('skNumber', value);
        }
      },
      skNumberDate: {
        get: function() {
          return this.$store.getters.skNumberDate;
        },
        set: function(value) {
          this.$store.commit('skNumberDate', value);
        }
      },
      assumedskNumber: {
        get: function() {
          return this.$store.getters.assumedskNumber;
        },
        set: function(value) {
          this.$store.commit('assumedskNumber', value);
        }
      },
      assumedskNumberDate: {
        get: function() {
          return this.$store.getters.assumedskNumberDate;
        },
        set: function(value) {
          this.$store.commit('assumedskNumberDate', value);
        }
      },
      assumedskName: {
        get: function() {
          return this.$store.getters.assumedskName;
        },
        set: function(value) {
          this.$store.commit('assumedskName', value);
        }
      }
    },
    mounted(){
      this.setInterface();
    },
    methods: {
      setInterface(){
      },
      toggleDetails() {
      },
      edit() {
        this.$store.state.is_editing = true;
      },
      save() {
        this.$store.state.is_editing = false;
      }
    }
  }
</script>

<style scoped>
</style>
