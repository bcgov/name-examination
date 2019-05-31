/* eslint-disable */

<template>
  <div>
    <!-- error msgs from backend -->
    <div class="modal fade" id="error-message-modal" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div v-if="errorMsg != ''">
            <div class="modal-header modal-header-error" id="errorModalLabel">
              <h5 class="modal-title">ERROR</h5>
            </div>
            <div class="modal-body pre-line">
              <section><i>{{ errorMsg }}</i></section>
            </div>
          </div>
          <div v-if="warningMsg != ''">
            <div class="modal-header modal-header-warning" id="warningModalLabel">
              <h5 class="modal-title">WARNING</h5>
            </div>
            <div class="modal-body pre-line">
              <section><i>{{ warningMsg }}</i></section>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-sm btn-primary"
                    data-dismiss="modal">Continue</button>
          </div>
        </div>
      </div>
    </div>
    <div id="app">
        <std-header style="z-index: 2"> </std-header>
      <div>
        <router-view style="z-index: 1"></router-view>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import StdHeader from '@/components/application/sections/StdHeader.vue'

export default {
    name: 'App',
    data: function() {
      return {
        errorMsg: '',
        warningMsg: '',
      }
    },
    components:{
      StdHeader
    },
    created () {
      this.$store.dispatch('loadSetUp');
    },
    computed: {
      errorJSON() {
        return this.$store.getters.errorJSON
      },
    },
    watch: {
      errorJSON: function(val) {
        console.log('errorJSON watcher fired')
        this.errorMsg = '';
        this.warningMsg = '';
        //if the errorJSON has new data populates the error/warning messages and triggers the popup
        if (val != null) {
          $('#error-message-modal').modal()
          let i;

          if (val.warnings != undefined) {
            for (i = 0; i < val.warnings.length; i++) {
              let msg = val.warnings[i].message;
              this.warningMsg += `${i + 1}) ` + msg + '\n';
            }
          }

          if (val.errors != undefined) {
            for (i = 0; i < val.errors.length; i++) {
              let error = Object.keys(val.errors[i].message)[0];
              let msg = val.errors[i].message[error][0];

              this.errorMsg += `${i + 1}) ` + error;
              this.errorMsg += ': ' + msg + '\n';
            }
          }

          if (val.message != undefined) {
            this.errorMsg = val.message;
          }
        }
      }
    }
};
</script>

<style>
  /*app-wide import of css variables to use in scoped and inline style*/
  @import '~/../../static/css/variables.css';
  .modal-header-error {
    background-color: #ea9999;
  }

  .modal-header-warning {
    background-color: #ffc107;
  }

  .pre-line {
    white-space: pre-line;
  }
</style>
