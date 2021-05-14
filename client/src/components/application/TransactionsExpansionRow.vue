<template>
  <v-container fluid pa-1 pl-5>
    <v-layout :class="addBottomBorder(index) ? 'border-bottom' : ''"
              :key="index+'json-data'"
              text-overflow
              v-for="(item, index) of data"
              v-if="checkConditions(item)">

      <!--NAME CHOICES + NAME DECISION TEXT -->
      <v-layout column v-if="item.key === 'names'" pb-2 style="white-space: normal">
        <v-flex json-data-header>Names</v-flex>
        <v-layout v-for="(name, i) of getOrderedNames(item.value)"
                  :key="'tr-names'+i"
                  column>
          <v-layout v-if="name"
                    :mt-2="i !== 0"
                    ml-5>
            <v-flex shrink>{{ name.choice }}.</v-flex>
            <v-flex grow pl-2>
              {{ name.name }}
              <span class="fs-11" v-if="name.state === 'NE'">(not examined)</span>
              <span class="fs-11" v-else-if="name.state === 'REJECTED'">
                  <v-icon style="font-size: 15px;" class="c-priority">clear</v-icon>
                </span>
              <span class="fs-11" v-else-if="name.state === 'APPROVED'">
                   <v-icon style="font-size: 15px;" class="c-link">done</v-icon>
                </span>
            </v-flex>
          </v-layout>
          <v-layout ml-5 pl-2 :key="'tr-names-2'+i">
            <v-flex>{{ name.decision_text }}</v-flex>
          </v-layout>
        </v-layout>
      </v-layout>

      <!--COMMENTS-->
      <v-layout column v-else-if="item.key === 'comments'" style="overflow: none; overflow-wrap: break-word">
        <v-flex json-data-header>Comments</v-flex>
        <div class="ml-5 mr-5 my-3">
          <v-layout :comment-style="i !== 0"
                    :key="'tr-com'+i"
                    v-for="(comment, i) in item.value"
                    v-if="comment"
                    wrap>
            <v-flex :mt-2="i !== 0" fs-13 lg12>{{ comment.comment }}</v-flex>
            <v-flex ml-3 ft-ital shrink>{{ '-' + comment.examiner + ', ' }}</v-flex>
            <v-flex ft-ital shrink>{{ comment.timestamp }}</v-flex>
          </v-layout>
        </div>
      </v-layout>

      <!--LAST UPDATE FIELD-->
      <v-layout v-else-if="item.key === 'lastUpdate'" wrap>
        <v-flex json-data-header lg12>Last Updated</v-flex>
        <v-flex lg12 ml-5 margin-8-6>{{ formatDate(item.value) }}</v-flex>
      </v-layout>

      <!--APPLICANT CONTACT / CLIENT CONTACT.  NAME + ADDRESS + TELEPHONE ETC -->
      <v-layout wrap v-else-if="item.key === 'applicants'" pb-2>
        <v-flex lg12 json-data-header>Applicant Information</v-flex>

        <!--ADDRESS SIDE-->
        <v-flex lg6>
          <v-layout :key="'trans-app-col-'+key"
                    v-for="(value, key) in item.value"
                    ml-5
                    v-if="addrFields.includes(key) && value">
            <template v-if="key === 'addrLine1'">
              <v-flex sub-header lg2>Address:</v-flex>
              <v-flex lg8>{{ value }}</v-flex>
            </template>
            <template v-else>
              <v-flex lg2 />
              <v-flex lg8>{{ value }}</v-flex>
            </template>
          </v-layout>
        </v-flex>

        <!--CONTACT SIDE-->
        <v-flex lg6>
          <v-layout :key="'trans-app-col-'+key"
                    v-for="(value, key) in item.value"
                    v-if="!addrFields.includes(key) && value">
            <v-flex sub-header lg4>{{ key + ': ' }}</v-flex>
            <v-flex lg8>{{ value }}</v-flex>
          </v-layout>
        </v-flex>
      </v-layout>


      <!--NWPTA AB / NWPTA SK-->
      <template v-else-if="item.key === 'nwpta'">
        <v-layout wrap v-if="item.value.length === 2">
          <v-flex lg12 json-data-header>NWPTA</v-flex>
          <v-flex lg6>
            <v-layout wrap
                      v-if="value"
                      v-for="(value, key) in item.value[0]"
                      :key="'nwpta'+ key"
                      ml-5>
              <v-flex sub-header lg4>{{ key + ': ' }}</v-flex>
              <v-flex lg8>{{ key === 'partnerNameDate' ? formatDate(value) : value }}</v-flex>
            </v-layout>
          </v-flex>
          <v-flex lg6>
            <v-layout wrap
                      v-for="(value, key) in item.value[1]"
                      v-if="value"
                      :key="'nwpta'+ key"
                      pl-3>
              <v-flex sub-header lg4>{{ key + ': ' }}</v-flex>
              <v-flex lg8>{{ key === 'partnerNameDate' ? formatDate(value) : value }}</v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout wrap v-for="(value, key) in item.value[0]" :key="'nwpta'+ key" v-else>
          <v-flex sub-header lg4>{{ key + ': ' }}</v-flex>
          <v-flex lg8>{{ value }}</v-flex>
        </v-layout>
      </template>

      <!--ALL OTHER TYPES OF FIELDS-->
      <v-layout v-else wrap>
        <v-flex json-data-header lg12>{{ item.key }}</v-flex>
        <v-flex lg12 ml-5 margin-8-6>{{ item.value }}</v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import moment from 'moment'

  export default {
    name: 'TransactionsExpansionRow',
    props: ['jsonData', 'item'],
    data() {
      return {
        addrFields: [
          'addrLine1',
          'addrLine2',
          'addrLine3',
          'countryTypeCd',
          'city',
          'stateProvinceCd',
          'postalCd'
        ]
      }
    },
    computed: {
      ...mapGetters(['nrNumber']),
      ...mapState(['transactionsData', 'transactionsNR', 'pendingTransactionsRequest']),
      data() {
        if (typeof this.jsonData === 'object' && Object.keys(this.jsonData).length > 0) {
          let output = []

          for (let key in this.jsonData) {
            if (Array.isArray(this.jsonData[key])) {
              if ( this.jsonData[key].length > 0) {
                output.push({ key: key, value: this.jsonData[key] })
              }
            } else if (typeof this.jsonData[key] === 'object' && this.jsonData[key] !== null) {
              if ( Object.keys(this.jsonData[key]).length > 0) {
                output.push({ key: key, value: this.jsonData[key] })
              }
            } else if (typeof this.jsonData[key] === 'string') {
              output.push({ key: key, value: this.jsonData[key] })
            }
          }
          return output
        }
      },

    },
    methods: {
      addBottomBorder(index) {
        let length = this.data.length
        if (length === 1) return false
        if ((length - 1) === index) return false
        return true
      },
      formatDate(date) {
        return moment(date).format('YYYY-MM-DD h:mm a')
      },
      getOrderedNames(value) {
        let output = []
        let keys = [1,2,3]
        keys.forEach(number => {
          let index = value.findIndex(name => name.choice === number)
          if (index !== -1) {
            output.push(value[index])
          }
        })
        return output
      },
      checkConditions(item) {
        if (!item.value) return false
        return true
      }
    }
  }
</script>

<style scoped>
  .text-overflow {
    white-space: pre-line;
    overflow-wrap: break-word !important;
    overflow: hidden;
  }

  .fs-11 {
    font-size: 11px;
  }

  .json-data-header {
    font-size: 15px;
    font-weight: 600;
    margin-top: 8px;
    margin-bottom: 6px;
  }

  .margin-8-6 {
    margin-top: 8px;
    margin-bottom: 6px;
  }
  .bg-grey {
    background-color: var(--xl-grey);
  }

  .border-bottom {
    border-bottom: 1px solid grey;
  }

  .sub-header {
    font-size: 13px;
    font-weight: 700;
  }
  .comment-style {
    border-top: 1px dotted var(--l-grey);
  }
</style>
