/* eslint-disable */
<template>
    <span>
      <div class="row">

        <div id='div1B' class="col-md-5" >
          <h3>INTERNAL COMMENTS</h3>
          <textarea id="internalComments1"
                    v-model="internalComments"
                    rows="7"
                    cols="50%"
                    @click="testClick()"
                    class='txtArea form-control'>
                </textarea>
        </div>
        <div id='div2B' class="col-md-4">
        </div>
        <div id='div3B' class="col-md-3">
          <clientinfoview />
        </div>

      </div>

      <div class="row">
        <div id='div4' class="col">
          <span class="f1" @click="toggleDetails()">F1</span>
        </div>
      </div>
    </span>
</template>

<script>
/* eslint-disable */
import clientinfoview from '@/components/dropdown/Search/client/ClientInfo.vue';

   export default {
    name: 'RequestInfo',
    computed: {
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
        return  this.$store.getters.priority;
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
      }
    },
    components: {
      clientinfoview
    },
    methods: {
        toggleDetails() {
          this.$store.dispatch('setDetails')
        },
        setBorder(id) {
          var tb = document.getElementById(id);
          tb.borderWidth = "1";
        }
    }
  }
</script>

<style scoped>
  .RequestInfo {
  }
  .f1 {
    border: 1px solid #000000;
    padding: 2px;
  }
</style>
