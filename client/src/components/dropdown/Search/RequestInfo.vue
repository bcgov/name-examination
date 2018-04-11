/* eslint-disable */
<template>
  <div>
    <div class="container-fluid">
      <div class="RequestInfo">

        <div class="row" >

          <div class="col name2-font">
                <p>
                <label class="labelTxt">firstName</label>
                  <input id="firstName1" v-model="firstName"
                       onclick="setBorder('firstName1')" class='rtb'>
                </p>
                <p>
                <label class="labelTxt">lastName</label>
                  <input id="lastName1" v-model="lastName"
                       onclick="setBorder('lastName1')" class='rtb'>
                </p>
                <p>
                  <label class="labelTxt">address</label>
                  <input id="address1" v-model="address"
                       onclick="setBorder('address1')" class='rtb'>
                </p>
          </div>
          <div class="col name2-font">
                <p>
                <label class="labelTxt">natureOfBusiness</label>
                  <input id="natureOfBusiness1" v-model="natureOfBusiness"
                       onclick="setBorder('natureOfBusiness1')" class='rtb'>
                </p>
                <p>
                <label class="labelTxt">jurisdiction</label>
                  <input id="jurisdiction1" v-model="jurisdiction"
                       onclick="setBorder('jurisdiction1')" class='rtb'>
                </p>
                <p>
                <label class="labelTxt">nuans</label>
                  <input id="nuans1" v-model="nuans"
                       onclick="setBorder('nuans1')" class='rtb'>
                </p>
          </div>
          <div class="col name2-font">
            <p>
              <label class="labelTxt">sk_name</label>
              <input id="sk_name1" v-model="sk_name"
                     onclick="setBorder('sk_name1')" class='rtb'>
            </p>
            <p>
              <label class="labelTxt">resubmission Y/N</label>
              <input id="resubmissionYN1" v-model="resubmissionYN"
                     onclick="setBorder('resubmissionYN1')" class='rtb'>
            </p>
            <p>
              <label class="labelTxt">linkedNR</label>
              <input id="linkedNR1" v-model="linkedNR"
                     onclick="setBorder('linkedNR1')" class='rtb'>
            </p>
          </div>
          <div class="col name2-font">
            <p>
              <label class="labelTxt">examiner</label>
              <input id="examiner1" v-model="examiner"
                     onclick="setBorder('examiner1')" class='rtb'>
            </p>
            <p>
              <label class="labelTxt">reservationCount</label>
              <input id="reservationCount1" v-model="reservationCount"
                     onclick="setBorder('reservationCount1')" class='rtb'>
            </p>
            <p>
              <label class="labelTxt">expiryDate</label>
              <input id="expiryDate1" v-model="expiryDate"
                     onclick="setBorder('expiryDate1')" class='rtb'>
            </p>
          </div>

        </div>
        <div>
          <ul id=menu>
            <li><a href="#sliding">A sliding menu</a></li>
            <li><a href="#details">Details</a></li>
            <li><a href="#a11n">Accessibility</a></li>
            <li><a href="#misc">Menus of unknown size</a></li>
          </ul>
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
