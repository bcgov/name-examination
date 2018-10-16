<!--eslint-disable -->
<template>

   <span v-if="is_xpro">
      <h3 class="corpType">XPRO Corporation</h3>

      <h3>Incorporation Number</h3>
      <p>{{ incorpNum }}</p>

      <h3>Incorporation Date</h3>
      <p>{{ incorporated }}</p>

      <h3>Attorneys</h3>
      <p v-if="is_not_available(attorneys)">Not Available</p>
      <p v-else v-for="attorney in attorneys" v-bind:key="attorney">{{ attorney }}</p>

      <h3>Directors</h3>
      <p v-if="is_not_available(directors)">Not Available</p>
      <p v-else v-for="director in directors" v-bind:key="director">{{ director }}</p>

      <h3>Jurisdiction</h3>
      <p>{{ jurisdiction }}</p>

      <h3>Nature Of Business</h3>
      <p>{{ natureOfBusiness }}</p>

      <h3>Head Office</h3>
      <p v-for="addressLine in head_office">
        {{ addressLine }}</p>
   </span>
   <span v-else>
      <h3 class="corpType">BC Corporation</h3>
      <h3>Incorporation Number</h3>
      <p>{{ incorpNum }}</p>

      <h3>Incorporation Date</h3>
      <p>{{ incorporated }}</p>

      <h3>Directors</h3>
      <p v-if="is_not_available(directors)">Not Available</p>
      <p v-else v-for="director in directors" v-bind:key="director">{{ director }}</p>

      <h3>Jurisdiction</h3>
      <p>{{ jurisdiction }}</p>

      <h3>Nature Of Business</h3>
      <p>{{ natureOfBusiness }}</p>

      <h3>Records Office Delivery Address</h3>
     <p v-if="is_not_available(records_office_delivery_address)">Not Available</p>
      <p v-else v-for="recordsAddressLine in records_office_delivery_address">
        {{ recordsAddressLine }}</p>

      <h3>Registered Office Delivery Address</h3>
      <p v-for="addressLine in registered_office_delivery_address">
        {{ addressLine }}</p>
  </span>
</template>

<script>
/* eslint-disable */
  export default {
    name: 'corpMatch',
    computed: {
      // currentConflict() {
      //   return  this.$store.getters.currentConflict;
      // },
      // currentConflictName() {
      //   console.log(this.currentConflict)
      //   if (this.currentConflict !== null) return this.currentConflict.text;
      //   else return null;
      // },
      // currentConflictNumber() {
      //   if (this.currentConflict !== null) return this.currentConflict.nrNumber;
      //   else return null;
      // },
      attorneys() {
        if (this.corpConflictInfo !== null)
          return this.corpConflictInfo['attorney names'];
        else
          return null;
      },
      directors() {
        if (this.corpConflictInfo !== null)
          return this.corpConflictInfo['directors'];
        else
          return null;
      },
      head_office(){
        if (this.corpConflictInfo !== null)
          return this.corpConflictInfo['head office'];
        else
          return null;
      },
      incorpNum () {
        if (this.corpConflictInfo !== null)
          return this.corpConflictInfo['incorp #'];
        else
          return null;
      },
      incorporated() {
        if (this.corpConflictInfo !== null)
          return this.corpConflictInfo['incorporated'];
        else
          return null;
      },
      jurisdiction() {
        if (this.corpConflictInfo !== null)
          return this.corpConflictInfo['jurisdiction'];
        else
          return null;
      },
      natureOfBusiness() {
        if (this.corpConflictInfo !== null)
          return this.corpConflictInfo['nature of business'];
        else
          return null;
      },
      records_office_delivery_address() {
        if (this.corpConflictInfo !== null)
          return this.corpConflictInfo['records office delivery address'];
        else
          return null;
      },
      registered_office_delivery_address() {
        if (this.corpConflictInfo !== null)
          return this.corpConflictInfo['registered office delivery address'];
        else
          return null;
      },
      is_xpro(){
        if (this.corpConflictInfo !== null) {
          if(this.corpConflictInfo['jurisdiction'] === 'BC'){
            return false;
          }else{
            return true;
          }
        } else
          return false;

      },
      corpConflictInfo() {
        return this.$store.getters.corpConflictJSON
      }
    },
    methods: {
      is_not_available(val) {
        if (val === 'Not Available')
          return true;
        else
          return false;
      },
    }
  }
</script>

<style scoped>
  .corpType {
    color: #494969;
  }
  h3, h2 {
    font-size: 15px;
  }
  p {
    font-size: 14px;
  }
</style>


