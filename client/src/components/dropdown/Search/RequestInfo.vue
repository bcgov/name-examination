/* eslint-disable */
<template>
  <div>
    <div class="container">
      <div class="RequestInfo">

        <div class="row name2-font">

          <div class="col-lg-3">
            <div class="row name2-font">
              <div class="col">
                <input id="nrNumber1" v-model="nrNumber"
                       onclick="setBorder('nrNumber1')" class='rtb'>
              </div>
            </div>
            <div class="row name2-font">
              <div class="col">
                <input id="requestType1" v-model="requestType"
                       onclick="setBorder('requestType1')" class='rtb'>
              </div>
            </div>
            <div class="row name2-font">
              <div class="col">
                <input id="firstName1" v-model="firstName"
                       onclick="setBorder('firstName1')" class='rtb'>
              </div>
            </div>
            <div class="row name2-font">
              <div class="col">
                <input id="lastName1" v-model="lastName"
                       onclick="setBorder('lastName1')" class='rtb'>
              </div>
            </div>
            <div class="row name2-font">
              <div class="col">
                <input id="address1" v-model="address"
                       onclick="setBorder('address1')" class='rtb'>
              </div>
            </div>
          </div>

          <div class="col-lg-3">
            <div class="row name2-font">
              <div class="col">
                <input id="contactName1" v-model="contactName"
                       onclick="setBorder('contactName1')" class='rtb'>
              </div>
            </div>
            <div class="row name2-font">
              <div class="col">
                <input id="phone1" v-model="phone"
                       onclick="setBorder('phone1')" class='rtb'>
              </div>
            </div>
            <div class="row name2-font">
              <div class="col">
                <input id="email1" v-model="conEmail"
                       onclick="setBorder('email1')" class='rtb'>
              </div>
            </div>
            <div class="row name2-font">
              <div class="col">
                <input id="fax1" v-model="fax"
                       onclick="setBorder('fax1')" class='rtb'>
              </div>
            </div>
            <div class="row name2-font">
              <div class="col">
                <input id="natureOfBusiness1" v-model="natureOfBusiness"
                       onclick="setBorder('natureOfBusiness1')" class='rtb'>
              </div>
            </div>
          </div>

          <div class="col-lg-3">
            <div class="row name2-font">
              <div class="col">
                <input id="jurisdiction1" v-model="jurisdiction"
                       onclick="setBorder('jurisdiction1')" class='rtb'>
              </div>
            </div>
            <div class="row name2-font">
              <div class="col">
                <input id="nuans1" v-model="requestType"
                       onclick="setBorder('nuans1')" class='rtb'>
              </div>
            </div>
            <div class="row name2-font">
              <div class="col">
                <input id="sk_name1" v-model="sk_name"
                       onclick="setBorder('sk_name11')" class='rtb'>
              </div>
            </div>
            <div class="row name2-font">
              <div class="col">
                <input id="nr_status1" v-model="nr_status"
                       onclick="setBorder('nr_status1')" class='rtb'>
              </div>
            </div>
            <div class="row name2-font">
              <div class="col">
                <input id="examiner1" v-model="examiner"
                       onclick="setBorder('examiner1')" class='rtb'>
              </div>
            </div>
          </div>

          <div class="col-lg-3">
            <div class="row name2-font">
              <div class="col">
                <input id="priority1" v-model="priority"
                       onclick="setBorder('priority1')" class='rtb'>
              </div>
            </div>
            <div class="row name2-font">
              <div class="col">
                <input id="resubmissionYN1" v-model="resubmissionYN"
                       onclick="setBorder('resubmissionYN1')" class='rtb'>
              </div>
            </div>
            <div class="row name2-font">
              <div class="col">
                <input id="linkedNR1" v-model="linkedNR"
                       onclick="setBorder('linkedNR1')" class='rtb'>
              </div>
            </div>
            <div class="row name2-font">
              <div class="col">
                <input id="reservationCount1" v-model="reservationCount"
                       onclick="setBorder('reservationCount1')" class='rtb'>
              </div>
            </div>
            <div class="row name2-font">
              <div class="col">
                <input id="expiryDate1" v-model="expiryDate"
                       onclick="setBorder('expiryDate1')" class='rtb'>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
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
      methods: {
      setBorder(id) {
        var tb = document.getElementById(id);
        tb.borderWidth = "1";
      }
    }
  }
</script>

<style scoped>
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
    text-align: left;
  }
  .rtb {
    border: 0px;
  }
</style>
