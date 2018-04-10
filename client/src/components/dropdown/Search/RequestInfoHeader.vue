/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="RequestInfo">

        <div class="row" >

          <div class="col name2-font">
              <p>
                <label class="labelTxt">nrNumber</label><input id="nrNumber1" v-model="nrNumber"
                  onclick="setBorder('nrNumber1')" class='rtb'>
              </p>
              <p>
                <label class="labelTxt">priority</label>
                <input id="contactName1" v-model="contactName"
                  onclick="setBorder('contactName1')" class='rtb'>
              </p>
          </div>

          <div class="col name2-font">

              <p>
                <label class="labelTxt">contactName</label>
                  <input id="priority1" v-model="priority"
                    onclick="setBorder('priority1')" class='rtb'>
              </p>
              <p>
                <label class="labelTxt">phone</label>
                <input id="phone1" v-model="phone"
                  onclick="setBorder('phone1')" class='rtb'>
              </p>
          </div>

          <div class="col name2-font">
              <div>
                <label class="labelTxt">requestType</label>
                <input id="requestType1" v-model="requestType"
                       onclick="setBorder('requestType1')" class='rtb'>
              </div>
              <div>
                <label class="labelTxt">fax</label>
                <input id="fax1" v-model="fax"
                  onclick="setBorder('fax1')" class='rtb'>
              </div>
          </div>

          <div class="col name2-font">
              <p>
                <label class="labelTxt">nr_status</label>
                <input id="nr_status1" v-model="nr_status"
                  onclick="setBorder('nr_status1')" class='rtb'>
              </p>
              <p>
                <label class="labelTxt">conEmail</label>
                <input id="email1" v-model="conEmail"
                  onclick="setBorder('email1')" class='rtb'>
              </p>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: 'RequestInfoHeader',
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
      },
      expandDiv(id) {
        var myDiv = document.getElementById(id);
        myDiv.className = "expand";
      },
      contractDiv(id) {
        var myDiv = document.getElementById(id);
        myDiv.className = "contract";
      }
    }
  }
</script>

<style scoped>
  .expand {

  }
  .contract {

  }
  .RequestInfo {
    align-content: left;
    border: 2px solid #eee;
    padding: 4px;
    box-shadow: 0 2px 3px #ccc;
  }
  .name2-font{
    text-align: right;
  }
  .alignCol{
    width: 25%;
    webkit-align: center;
    border: 2px solid #777;
  }
  .rtb {
    border: 0px;
  }
  .labelTxt {
    font-size: 1.0em;
    text-align: left;
    margin-right: 10px;
  }

</style>
