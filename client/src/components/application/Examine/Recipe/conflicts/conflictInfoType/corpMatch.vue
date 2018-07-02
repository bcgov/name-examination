/* eslint-disable */
<template>

   <span v-if="is_xpro">
      <h3>XPRO Corporation</h3>

      <h3>Attorneys</h3>
      <p v-for="attorney in attorneys" v-bind:key="attorney">{{ attorney }}</p>

      <h3>Directors</h3>
      <p v-for="director in directors" v-bind:key="director">{{ director }}</p>

      <h3>Head Office</h3>
      <p>{{ head_office }}</p>

      <h3>Incorporation Number</h3>
      <p>{{ incorpNum }}</p>

      <h3>Incorporation Date</h3>
      <p>{{ incorporated }}</p>

      <h3>Jurisdiction</h3>
      <p>{{ jurisdiction }}</p>

      <h3>Nature Of Business</h3>
      <p>{{ natureOfBusiness }}</p>
   </span>
   <span v-else>
      <h3>BC Corporation</h3>

      <h3>Directors</h3>
      <p v-for="director in directors" v-bind:key="director">{{ director }}</p>

      <h3>Incorporation Number</h3>
      <p>{{ incorpNum }}</p>

      <h3>Incorporation Date</h3>
      <p>{{ incorporated }}</p>

      <h3>Jurisdiction</h3>
      <p>{{ jurisdiction }}</p>

      <h3>Nature Of Business</h3>
      <p>{{ natureOfBusiness }}</p>

      <h3>Records Office Delivery Address</h3>
      <p>{{ records_office_delivery_address }}</p>

      <h3>Registered Office Delivery Address</h3>
      <p>{{ registered_office_delivery_address }}</p>
  </span>
</template>

<script>
/* eslint-disable */
  export default {
    name: 'corpMatch',
    computed: {
      currentConflict() {
        return  this.$store.getters.currentConflict;
      },
      currentConflictName() {
        if (this.currentConflict !== null) return this.currentConflict.text;
        else return null;
      },
      currentConflictNumber() {
        if (this.currentConflict !== null) return this.currentConflict.nrNumber;
        else return null;
      },
      attorneys() {
        return this.corpConflictInfo['attorney names']
      },
      directors() {
        return this.corpConflictInfo['directors']
      },
      head_office(){
        return this.corpConflictInfo['head office']
      },
      incorpNum () {
        return this.corpConflictInfo['incorp #']
      },
      incorporated() {
        return this.corpConflictInfo['incorporated']
      },
      jurisidiction() {
        return this.corpConflictInfo['jurisidiction']
      },
      natureOfBusiness() {
        return this.corpConflictInfo['nature of business']
      },
      records_office_delivery_address() {
        return this.corpConflictInfo['records office delivery address']
      },
      registered_office_delivery_address() {
        return this.corpConflictInfo['registered office delivery address']
      },
      is_xpro(){
        if(this.corpConflictInfo['attorney names'] == null){
          return false
        }else{
          return true
        }
      },
      corpConflictInfo() {
        return this.$store.getters.corpConflictJSON
      }
    }
 }
</script>

<style scoped>
</style>


