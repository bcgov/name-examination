/* eslint-disable */
<template>
  <span>
    <div class="row">

      <!-- details col 1 - priority, comments, etc -->
      <div id='div1' class="col-md-5" >
        <div class="row">
          <div class="col-md-3" >
            <span v-if="priority" id="lblPriority" class="ISPRIORITY" >Priority</span>
            <span v-else></span>
          </div>
          <div class="col-md-9">
            <p v-if="!is_editing">{{ requestType }}</p>
            <select v-else v-model="requestType">
              <option v-for="opt in reqTypes" v-bind:key="opt.REQUEST_TYPE_CD">
                {{ opt.FULL_DESC }}
              </option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col-md-3" >
            <p class="nr-number" v-bind:class="{ REDnrNum: priority }">{{ nrNumber }}</p>
          </div>
          <div class="col" >
            <p v-if="!is_editing">{{ jurisdiction }}</p>
            <input v-else v-model="jurisdiction" class="form-control" />
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
            <div id="internalCommentsDisplay" v-if="!is_editing" style="display: none;">
              <h3>INTERNAL COMMENTS</h3>
              <p>{{ internalComments }}</p>
            </div>
            <div v-else>
              <h3>INTERNAL COMMENTS</h3>
              <textarea v-model="internalComments" class="form-control"></textarea>
            </div>

          </div>
        </div>
      </div>

      <!-- details col 2 - nature of business -->
      <div id='div2' class="col-md-4">
        <h3>NATURE OF BUSINESS</h3>
        <p id="natureOfBusinessDisplay" v-if="!is_editing">{{ natureOfBusiness }}</p>
        <textarea v-else v-model="natureOfBusiness" class="form-control"></textarea>

      </div>

      <!-- details col 3 - additional info, client details -->
      <div id='div3' class="col-md-3">
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col">
                <h3>ADDITIONAL INFORMATION</h3>
                <p v-if="!is_editing">{{ addInfo }}</p>
                <textarea v-else v-model="addInfo" class="form-control"></textarea>
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
      <div id='div4' class="col-md-12">
        <span class="f1" @click="toggleDetails">F1</span>
      </div>
      <button v-if="!is_editing" class="btn btn-default" @click="edit">Edit</button>
      <button v-else class="btn btn-default" @click="save">Save</button>
    </div>

  </span>
</template>
<script src="static/js/utils.js"></script>
<script>
/* eslint-disable */
import clientinfoview
  from '@/components/dropdown/Search/client/ClientInfo.vue';

export default {
    name: 'RequestInfoHeader',
    data: function () {
      return {
      }
    },
    computed: {
      is_editing() {
        return  this.$store.getters.is_editing;
      },
      nrNumber() {
        return  this.$store.getters.nrNumber;
      },
      requestType() {
        return  this.$store.getters.requestType;
      },
      firstName() {
        return  this.$store.getters.firstName;
      },
      lastName() {
        return  this.$store.getters.lastName;
      },
      address() {
        return  this.$store.getters.address;
      },
      contactName() {
        return  this.$store.getters.contactName;
      },
      phone() {
        return  this.$store.getters.phone;
      },
      conEmail() {
        return  this.$store.getters.conEmail;
      },
      fax() {
        return  this.$store.getters.fax;
      },
      jurisdiction() {
        return  this.$store.getters.jurisdiction;
      },
      natureOfBusiness() {
        return  this.$store.getters.natureOfBusiness;
      },
      nuans() {
        return  this.$store.getters.nuans;
      },
      sk_name() {
        return  this.$store.getters.sk_name;
      },
      nr_status() {
        return  this.$store.getters.nr_status;
      },
      examiner() {
        return  this.$store.getters.examiner;
      },
      priority() {
        return  this.$store.getters.firstName;
      },
      resubmissionYN() {
        return  this.$store.getters.resubmissionYN;
      },
      linkedNR() {
        return  this.$store.getters.linkedNR;
      },
      reservationCount() {
        return  this.$store.getters.reservationCount;
      },
      expiryDate() {
        return  this.$store.getters.expiryDate;
      },
      details() {
        return this.$store.getters.details;
      },
      internalComments() {
        // TODO get actual data from $store
        return 'Lorem ipsum dolor sit amet,'
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
        this.setRequestType()
        this.setNRNum()
        this.setPriority()
        this.setComp
        this.setNuans()
        this.setSK()
        this.setNOB()
        this.setAddInfo()
      },
      setRequestType() {
      },
      setNRNum() {
      },
      setPriority() {
      },
      setAddInfo() {
      },
      setComp() {
      },
      setNuans() {
      },
      setSK() {
      },
      setNOB() {
      },
      toggleDetails() {
        // KATIE - IN PROGRESS

        // show internal comments
        document.getElementById("internalCommentsDisplay").style.display = '';

        // show complete nature of business, untruncated

        // show client data
        document.getElementsByClassName('RequestInfoHeader')[0]
          .getElementsByClassName('ClientInfo')[0].style.display = 'inline';

      },
      setBorder(id) {
        var tb = document.getElementById(id);
        tb.borderWidth = "1";
      },
      edit() {
        this.$store.state.is_editing = true;
      },
      save() {
        this.$store.state.is_editing = false;
      }
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
     width: 100%;
     background-color: #f1f1f1;
     border: 0px #fff;
     color: #ff0000;
     font-size: 1.9em;
   }
  .REDnrNum {
    width: 100%;
    background-color: #f1f1f1;
    color: #ff0000;
    border: 0px #fff;
  }
  .ISPRIORITY {
    padding-left: 28%;
    padding-right: 28%;
    padding-bottom: 6%;
    padding-top: 6%;
    border: 2px solid #777;
    background-color: #cc0000;
    font-size: 1.25em;
    color: #ffffff;
  }
   .f1 {
     border: 1px solid #000000;
     padding: 2px;
   }
   /* initially hide client info ONLY WITHIN HEADER (not everywhere the component is used */
   .RequestInfoHeader .ClientInfo {
     display: none;
   }
 </style>
