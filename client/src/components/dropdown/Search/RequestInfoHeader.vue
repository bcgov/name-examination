/* eslint-disable */
<template>
  <span>
    <div class="row">

      <!-- details col 1 - priority, comments, etc -->
      <div id='div1' class="col-md-5" >
        <div class="row">
          <div class="col-md-4" style="height: 30px;">
            <div class="priority" v-if="priority">Priority</div>
          </div>
          <div class="col">
            <p v-if="!is_editing" style="font-weight: bold;">{{ requestType_desc }}</p>
            <select v-else v-model="requestType" class="form-control">
              <option v-for="option in requestType_options" v-bind:value="option.value"
                      v-bind:key="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4" >
            <div class="nrNum" v-bind:class="{ REDnrNum: priority}">{{ nrNumber }}</div>
          </div>
          <div class="col" >
            <p v-if="!is_editing" style="font-weight: bold;">{{ jurisdiction_desc }}</p>
            <select v-else v-model="jurisdiction" class="form-control">
              <option v-for="option in jurisdiction_options" v-bind:value="option.value"
                      v-bind:key="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
          <div class="col">
            <p v-if="!is_editing">{{ nuans }}</p>
            <input v-else v-model="nuans" class="form-control" />
          </div>
          <div class="col">
            <p v-if="!is_editing">{{ sk_name }}</p>
            <input v-else v-model="sk_name" class="form-control" />
          </div>
        </div>

        <div class="row">
          <div class="col add-top-padding">
            <div v-if="show_extended_header">
              <div v-if="!is_editing">
                <h3>INTERNAL COMMENTS</h3>
                <p style="white-space: pre-line;">{{ internalComments }}</p>
              </div>
              <div v-else>
                <h3>INTERNAL COMMENTS</h3>
                <textarea v-model="internalComments" class="form-control" rows="10"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- details col 2 - nature of business -->
      <div id='div2' class="col-md-4">
        <h3>NATURE OF BUSINESS</h3>
        <div v-if="show_extended_header">
          <textarea v-if="is_editing" v-model="natureOfBusiness" class="form-control" rows="10">
            </textarea>
          <p v-else style="white-space: pre-line;">{{ natureOfBusiness }}</p>
        </div>
        <p v-else style="white-space: pre-line;">{{ natureOfBusinessTruncated }}</p>

      </div>

      <!-- details col 3 - additional info, client details -->
      <div id='div3' class="col-md-3">
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col">
                <h3>ADDITIONAL INFORMATION</h3>
                <p v-if="!is_editing" style="white-space: pre-line;">{{ additionalInfo }}</p>
                <textarea v-else v-model="additionalInfo" class="form-control"></textarea>
              </div>
            </div>
            <div class="row">
              <div class="col add-top-padding">
                <clientinfoview />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- row 2 - buttons -->
    <div class="row">
      <div id='header-button-container' class="col-md-12">
        <span v-if="!is_editing" class="f1" @click="toggleDetails">F1</span>

        <button v-if="!is_editing" class="btn btn-sm btn-default"
                style="float: left;" @click="edit">Edit</button>
        <span v-else>
          <button class="btn btn-sm btn-default"
                  style="float: left;" @click="save">Save</button>
          <button class="btn btn-sm btn-default"
                  style="float: left;" @click="cancelSave">Cancel</button>
        </span>
      </div>
    </div>

  </span>
</template>

<script>
/* eslint-disable */

// ClientInfoHeader - editable component
import clientinfoview from '@/components/dropdown/Search/client/ClientInfoHeader.vue';

export default {
    name: 'RequestInfoHeader',
    computed: {
      jurisdiction_options() {
        return this.$store.getters.listJurisdictions;
      },
      requestType_options() {
        return this.$store.getters.listRequestTypes;
      },
      is_editing() {
        return  this.$store.getters.is_editing;
      },
      show_extended_header() {
        return this.is_editing || this.$store.state.is_header_shown;
      },
      nrNumber() {
        return  this.$store.getters.nrNumber;
      },
      requestType: {
        get: function() {
          return this.$store.getters.requestType;
        },
        set: function(value) {
          this.$store.commit('requestType', value);
        }
      },
      requestType_desc() {
        try {
          return getDescFromList(this.requestType_options, this.requestType);
        } catch (err) {
          return 'ERROR!!';
        }
      },
      jurisdiction: {
        get: function() {
          return this.$store.getters.jurisdiction;
        },
        set: function(value) {
          this.$store.commit('jurisdiction', value);
        }
      },
      jurisdiction_desc() {
        try {
          return getDescFromList(this.jurisdiction_options, this.jurisdiction);
        } catch (err) {
          return '';
        }
      },
      natureOfBusiness: {
        get: function() {
          return  this.$store.getters.natureOfBusiness;
        },
        set: function(value) {
          this.$store.commit('natureOfBusiness', value);
        }
      },
      natureOfBusinessTruncated() {
        try {
          if (this.natureOfBusiness.length > 200) return this.natureOfBusiness.substr(0, 200) + '...';
          else return this.natureOfBusiness;
        } catch (err) {
          return this.natureOfBusiness;
        }
        if (this.natureOfBusiness.length > 200) return this.natureOfBusiness.substr(0, 200) + '...';
        else return this.natureOfBusiness;
      },
      nuans: {
        get: function() {
          return this.$store.getters.nuans;
        },
        set: function(value) {
          this.$store.commit('nuans', value);
        }
      },
      sk_name: {
        get: function() {
          return this.$store.getters.sk_name;
        },
        set: function(value) {
          this.$store.commit('sk_name', value);
        }
      },
      nr_status: {
        get: function() {
          return this.$store.getters.nr_status;
        },
        set: function(value) {
          this.$store.commit('nr_status', value);
        }
      },
      examiner() {
        return this.$store.getters.examiner;
      },
      priority() {
        return this.$store.getters.priority;
      },
      resubmissionYN: {
        get: function() {
          return this.$store.getters.resubmissionYN;
        },
        set: function(value) {
          this.$store.commit('resubmissionYN', value);
        }
      },
      linkedNR: {
        get: function() {
          return this.$store.getters.linkedNR;
        },
        set: function(value) {
          this.$store.commit('linkedNR', value);
        }
      },
      reservationCount: {
        get: function() {
          return this.$store.getters.reservationCount;
        },
        set: function(value) {
          this.$store.commit('reservationCount', value);
        }
      },
      expiryDate: {
        get: function() {
          return this.$store.getters.expiryDate;
        },
        set: function(value) {
          this.$store.commit('expiryDate', value);
        }
      },
      details: {
        get: function() {
          return this.$store.getters.details;
        },
        set: function(value) {
          this.$store.commit('details', value);
        }
      },
      additionalInfo: {
        get: function() {
          return this.$store.getters.additionalInfo;
        },
        set: function(value) {
          this.$store.commit('additionalInfo', value);
        }
      },
      internalComments: {
        get: function() {
          return this.$store.getters.internalComments;
        },
        set: function(value) {
          this.$store.commit('internalComments', value);
        }
      }
    },
    components: {
      clientinfoview
    },
    mounted(){
      this.setInterface();
    },
    methods: {
      setInterface(){
      },
      toggleDetails() {
        if (this.$store.state.is_header_shown) this.$store.state.is_header_shown = false;
        else this.$store.state.is_header_shown = true;
      },
      edit() {
        this.$store.state.is_editing = true;
      },
      save() {
        this.$store.dispatch('updateRequest');
        this.$store.state.is_editing = false;

        // show full header after editing so user can see everything they changed
        this.$store.state.is_header_shown = true;

      },
      cancelSave() {
        this.$store.dispatch('getpostgrescompInfo',this.nrNumber)
        this.$store.state.is_editing = false;
      },
    },
    watch: {
      nrNumber: function (val) {
        this.$store.dispatch('getpostgrescompInfo',this.nrNumber)
        this.setInterface();
      }
    }
}
</script>

<style scoped>

   .nrNum {
     font-size: 1.5em;
     font-weight: bold;
     text-align: center;
     margin-top: 10px;
   }
  .REDnrNum {
    color: #ff0000;
  }
  .priority {
    padding: 5px;
    text-align: center;
    background-color: #cc0000;
    color: white;
  }
  .f1 {
    border: 1px solid #000000;
    padding: 2px;
    float: right;
  }


 </style>
