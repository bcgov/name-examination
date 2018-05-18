/* eslint-disable */
<template>
    <div class="container-fluid">
      <div class="row">

        <div id='div1B' class="col-md-5 bb" >
          <p class="bb3"><label class="labelTxt">INTERNAL COMMENTS</label></p>
          <textarea id="internalComments1"
                    v-model="internalComments"
                    rows="7"
                    cols="50%"
                    @click="testClick()"
                    class='txtArea'>
                </textarea>
        </div>
        <div id='div2B' class="col-md-3 bb">
        </div>
        <div id='div3B' class="col-md-3 bb">
          <clientinfoview />
        </div>

      </div>

      <div class="row bb1">
        <div id='div4' class="col">
          <span class="f1" @click="toggleDetails()">F1</span>
        </div>
      </div>
    </div>
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
  .expand {
    height: 120px;
  }
  .contract {
    height: 0px;
  }
  .RequestInfo {
    align-content: left;
    border: 2px solid #eee;
    padding: 4px;
    box-shadow: 0 2px 3px #ccc;
    height: 120px;
  }
  .name1-font{
    font-size: xx-large;
    text-align: left;
  }
  .name2-font{
    font-size:large;
    text-align: right;
    line-height: 20%;
  }
  .rtb {
    border: 0px;
    background-color: #f1f1f1;
  }
  .labelTxt {
    font-size: .65em;
    text-align: left;
    margin-right: 10px;
  }
  .bb1 {
    font-size: .95em;
    text-align: right;
    vertical-align: bottom;
  }
  .f1 {
    border: 1px solid #000000;
    padding: 2px;
  }
  #menu {
    position: fixed;
    right: -8.5em;
    top: 50%;
    width: 8em;
    background: hsla(80, 90%, 40%, 0.7);
    color: white;
    margin: -3em 0 0 0;
    padding: 0.5em 0.5em 0.5em 2.5em;
  }
  #menu:hover { right: 0 }
  #menu { transition: 0.2s }

</style>
