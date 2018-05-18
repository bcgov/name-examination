/* eslint-disable */
<template>
     <div class="container-fluid">
      <div class="row">

          <div id='div1' class="col-md-5 bb" >
            <div class="row bb align-items-md-center">
              <div class="col-md-3" >
                <div v-if="priority">
                  <span id="lblPriority" class="ISPRIORITY" >Priority</span>
                </div>
              </div>
              <div class="col-md-9">
                <textarea id="requestType1"
                          v-model="requestType"
                          rows="2"
                          cols="59%"
                          class='txtArea'>
                </textarea>
              </div>
            </div>

            <div class="row">
              <div class="col-md-3" >
                <p></p>
                <div v-if="priority">
                  <input id="nrNumber1" v-model="nrNumber"
                         onclick="setBorder('nrNumber1')" class="nrNum">
                </div>
                <div v-else>
                  <input id="nrNumber2" v-model="nrNumber"
                         onclick="setBorder('nrNumber2')" class="nrNum">
                </div>
              </div>
              <div class="col-md-5 bb2" >
                <p></p>
                <input id="jurisdiction1" v-model="jurisdiction"
                       onclick="setBorder('jurisdiction1')" class="nrNum">
              </div>
              <div class="col-md-3">
                <p></p>
                <div v-if="nuans">
                  <span class="lblNuans">AB NUANS</span>
                </div>
                <div v-else>
                </div>
              </div>
              <div class="col-md-1">
                <p></p>
                <div v-if="sk_name">
                  <span class="lblSK">SK</span>
                </div>
                <div v-else>
                </div>
              </div>
            </div>
          </div>

          <div id='div2' class="col-md-4 bb">
            <p class="bb3"><label class="labelTxt">NATURE OF BUSINESS</label></p>
            <textarea id="natureOfBusiness1"
                      v-model="natureOfBusiness"
                      rows="4"
                      cols="50%"
                      @click="testClick()"
                      class='txtArea'>
                </textarea>
          </div>

          <div id='div3' class="col-md-3 bb">
            <p class="bb3"><label class="labelTxt">ADDITIONAL INFORMATION</label></p>
            <textarea id="addInfo1"
                      v-model="addInfo"
                      rows="4"
                      cols="50%"
                      @click="testClick()"
                      class='txtArea'>
                </textarea>
          </div>

      </div>
      <div v-if="details" class="row">
      </div>
      <div v-else class="row bb2">
        <div id='div4' class="col-md-12">
          <span class="f1" @click="toggleDetails()">F1</span>
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
      }
    },
    mounted(){
      this.setInterface();
    },
    methods: {
      setInterface(){
        this.setNRNum()
        this.setPriority()
        this.setComp
        this.setNuans()
        this.setSK()
        this.setNOB()
        this.setAddInfo()
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
        let res = this.details?10:4;
        document.getElementById("natureOfBusiness1").rows = res
        this.$store.dispatch('setDetails')

      },
      setBorder(id) {
        var tb = document.getElementById(id);
        tb.borderWidth = "1";
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
  .expand {

  }
  .contract {

  }
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
  .jur {
    width: 100%;
  }
  .RequestInfoHeader1 {
    align-content: left;
    border: 2px solid #eee;
    padding: 1px;
    box-shadow: 0 2px 3px #ccc;
  }
  .name2-font {
    font-size:large;
    text-align: right;
    line-height: 20%;
  }
  .alignCol {
    width: 25%;
    webkit-align: center;
    border: 2px solid #777;
  }
  .txtArea {
    border: 0px solid #000000;
    vertical-align: top;
    background-color: #f1f1f1;
  }
  .bb {
   // border: 1px solid #000000;
    vertical-align: middle;
    text-align: left;
  }
  .bb1 {
    //border: 1px solid #000000;
    vertical-align: bottom;
    ///padding: 2px;
  }
  .bb2 {
    //border: 1px solid #000000;
    text-align: right;
  }
  .bb3 {
    //border: 1px solid #000000;
   //padding: 2px;
  }
  .bb4 {
    font-size:large;
    border: 1px solid #000000;
    text-align: left;
    vertical-align: bottom;
    height: 50%;
  }
  .f1 {
    border: 1px solid #000000;
    padding: 2px;
  }
  .rtb {
    //border: 1px;
    background-color: #777777;
  }
  .labelTxt {
    font-size: .95em;
    text-align: left;
    margin-right: 10px;
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
  .NOTPRIORITY {
    background-color: #f1f1f1;
    color: #f1f1f1;
    visible: false;
    vertical-align: middle;
  }
  .v-center {
    display: flex;
    align-items: center;
  }
</style>
