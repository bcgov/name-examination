<!--eslint-disable -->
<template>
  <v-container ma-0 pt-0 pb-3 px-3 fluid align-start>
    <v-layout align-items-start>
      <v-layout wrap style="width: 50%" align-items-start>

        <v-flex header-mg lg3 item-heading>Applicant</v-flex>
        <v-flex header-mg lg9>
          <div class="item-detail">{{ applicants.firstName }} {{ applicants.lastName }}</div>
          <div class="item-detail">{{ applicants.addrLine1 }}</div>
          <div class="item-detail">{{ applicants.addrLine2 }}</div>
          <div class="item-detail">{{ applicants.addrLine3 }}</div>
          <div class="item-detail">
            {{ applicants.city }}
            {{ applicants.stateProvinceCd }}
            {{ applicants.postalCd }}
            {{ applicants.countryTypeCd }}</div>
        </v-flex>
        <v-flex lg3 header-mg item-heading>Phone</v-flex>
        <v-flex header-mg lg9>{{ applicants.phoneNumber }}</v-flex>
        <v-flex header-mg lg3 item-heading>Email</v-flex>
        <v-flex header-mg lg9>{{ applicants.emailAddress }}</v-flex>

      </v-layout>
      <v-layout wrap style="width: 50%;" align-items-start>
        <v-flex item-heading lg4>Client</v-flex>
        <v-flex lg8>{{ applicants.clientFirstName }} {{ applicants.clientLastName}}</v-flex>
        <v-flex header-mg lg4 item-heading>Contact</v-flex>
        <v-flex header-mg lg8>{{ applicants.contact }}</v-flex>
        <v-flex header-mg lg4 mt-3 item-heading>Submit Count</v-flex>
        <v-flex header-mg lg8 mt-3>{{ submitCount }}</v-flex>
        <v-flex header-mg lg4 item-heading>Name State</v-flex>
        <v-flex header-mg lg8>{{nameState}}</v-flex>
      </v-layout>
    </v-layout>
    <v-layout wrap v-if="comments.length > 0" mt-3 align-items-start>
      <v-flex lg12 item-heading>Comments</v-flex>
      <v-flex lg12 ml-3>
        <template v-for="comment in comments">
          <div>{{ comment.comment }}</div>
          <div class="ml-3 ft-ital mb-2">{{ comment.examiner + ' - ' + formatDate(comment.timestamp)}}</div>
        </template>
      </v-flex>
    </v-layout>
    </v-layout>

  </v-container>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'namesMatch',
    computed: {
      currentConflictName() {
        let currentConflict = this.$store.getters.currentConflict
        if (currentConflict != null)
          return currentConflict.text
        else
          return ""
      },
      applicants() {
        if (!this.namesConflictInfo || !this.namesConflictInfo.applicants) return {}
        return this.namesConflictInfo.applicants
      },
      comments() {
        if (!this.namesConflictInfo || !this.namesConflictInfo.comments) return []
        return this.namesConflictInfo.comments
      },
      submitCount() {
        if (this.namesConflictInfo && this.namesConflictInfo.submitCount) return this.namesConflictInfo.submitCount
        return ''
      },
      submittedDate() {
          if (this.namesConflictInfo == undefined || this.namesConflictInfo.submittedDate == undefined) return ''
          return new Date(this.namesConflictInfo.submittedDate).toLocaleString('en-ca',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',year:'numeric'});
      },
      nrNum() {
        if (this.namesConflictInfo == undefined) return '';
        return this.namesConflictInfo.nrNum
      },
      namesConflictInfo() {
        return this.$store.getters.namesConflictJSON
      },
      decisionText() {
        if (this.namesConflictInfo == undefined) return '';

        // get decision text for this particular name choice
        for (let i = 0; i < this.namesConflictInfo.names.length; i++) {
          if (this.namesConflictInfo.names[i].name === this.currentConflictName &&
              this.namesConflictInfo.names[i].decision_text != '') {
            return this.namesConflictInfo.names[i].decision_text
          }
        }
        return null
      },
      nameState() {
        if (this.namesConflictInfo && this.namesConflictInfo.state) return this.namesConflictInfo.state
        return ''
      },
      conflicts() {
        if (!this.namesConflictInfo || !this.namesConflictInfo.names) return []
        let { names } = this.namesConflictInfo

        let i = names.findIndex(conflict => conflict.name === this.currentConflictName)
        let nameConflict = names[i]

        let conflicts = []
        for (let n of [1,2,3]) {
          if (nameConflict[`conflict${n}`]) {
            conflicts.push(nameConflict[`conflict${ n }`])
          } else {
            break
          }
        }
        return conflicts
      },
    },
    methods: {
      formatDate (timestamp) {
        return moment(timestamp).format('YYYY-MM-DD')
      },
    }
  }
</script>

<style scoped>
  .item-heading {
    font-weight: 600 !important;
  }

  .header-mg {
    margin-top: 3px;
  }

  .bg-color {
    background-color: var(--xl-cyan);
  }
</style>


