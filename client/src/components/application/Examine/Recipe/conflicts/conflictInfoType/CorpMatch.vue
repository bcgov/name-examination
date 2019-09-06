<!--eslint-disable -->
<template>
  <v-container pt-0 pb-3 pl-4 fluid align-start>
    <template v-if="!invalidRecord">
      <v-layout align-items-start v-if="is_xpro">
        <v-layout wrap style="width: 50%" align-items-start>
          <v-flex lg5 item-heading>Type:</v-flex>
          <v-flex lg7>XPRO Corporation</v-flex>
          <v-flex lg5 mt-3 item-heading>Corp Number:</v-flex>
          <v-flex lg7 mt-3>{{ incorpNum }}</v-flex>
          <v-flex lg5 mt-3 item-heading>Attorneys:</v-flex>
          <v-flex lg7 mt-3>
            <div v-if="is_not_available(attorneys)">Not Available</div>
            <div v-else
                 v-for="attorney in attorneys"
                 v-bind:key="attorney">{{ attorney }}
            </div>
          </v-flex>
          <v-flex lg5 mt-3 item-heading>Nature Of Business:</v-flex>
          <v-flex mt-3 lg7>{{ natureOfBusiness }}</v-flex>
        </v-layout>

        <v-layout wrap style="width: 50%;" align-items-start>
          <v-flex lg3 mt-3 item-heading>Directors:</v-flex>
          <v-flex lg9 mt-3 pl-2>
            <div v-if="is_not_available(directors)">Not Available</div>
            <div v-else
                 v-for="director in directors"
                 v-bind:key="director">{{ director }}
            </div>
          </v-flex>
          <v-flex lg3 mt-4 item-heading>Head Office:</v-flex>
          <v-flex mt-4 lg9 pl-2>
            <div v-for="addressLine in head_office">{{ addressLine }}</div>
          </v-flex>
        </v-layout>
      </v-layout>
      <v-layout align-items-start v-else>
        <v-layout wrap style="width: 45%" align-items-start>
          <v-flex lg5 item-heading>Type:</v-flex>
          <v-flex lg7>BC Corporation</v-flex>
          <v-flex lg5 mt-3 item-heading>Corp Number:</v-flex>
          <v-flex lg7 mt-3>{{ incorpNum }}</v-flex>
          <v-flex lg5 mt-3 item-heading>Directors</v-flex>
          <v-flex lg7 mt-3>
            <div v-if="is_not_available(directors)">Not Available</div>
            <div v-else
                 v-for="director in directors"
                 v-bind:key="director">{{ director }}
            </div>
          </v-flex>
          <v-flex lg5 mt-3 item-heading>Nature Of Business</v-flex>
          <v-flex mt-3 lg7>{{ natureOfBusiness }}</v-flex>
        </v-layout>

        <v-layout wrap style="width: 55%;" align-items-start>
          <v-flex lg5 item-heading>Records Office Delivery Address:</v-flex>
          <v-flex pl-2 lg7>
            <div v-if="is_not_available(records_office_delivery_address)">Not Available</div>
            <div v-else v-for="recordsAddressLine in records_office_delivery_address">
              {{ recordsAddressLine }}
            </div>
          </v-flex>
          <v-flex mt-3 lg5 item-heading>Registered Office Delivery Address:</v-flex>
          <v-flex mt-3 pl-2 lg7>
            <div v-for="addressLine in registered_office_delivery_address">
              {{ addressLine }}
            </div>
          </v-flex>
        </v-layout>
      </v-layout>
    </template>
    <template v-if="invalidRecord">
      <v-layout pt-2>
        <v-flex>Corporation info could not be retrieved. It isn't in the fdw-registries data.</v-flex>
      </v-layout>
    </template>
  </v-container>
</template>

<script>
  /* eslint-disable */
  import { mapGetters } from 'vuex'

  export default {
    name: 'corpMatch',
    props: ['conflictData'],
    computed: {
      invalidRecord() {
        if (this.conflictData && this.conflictData.invalidRecordInd) return true
        return false
      },
      attorneys() {
        if ( this.conflictData !== null ) {
          return this.conflictData['attorney names']
        }
        else {
          return null
        }
      },
      directors() {
        if ( this.conflictData !== null ) {
          return this.conflictData['directors']
        }
        else {
          return null
        }
      },
      head_office() {
        if ( this.conflictData !== null ) {
          let lines = this.conflictData['head office']
          let l = lines.length
          let lastLine = lines[l - 4] + ' ' + lines[l - 3] + ' ' + lines[l - 2] + ' ' + lines[l - 1]
          let output = []
          for ( let r = l - 5; r >= 0; r-- ) {
            output = [lines[r], ...output]
          }
          output.push( lastLine )
          if ( output[0].toUpperCase() === 'N' && output[1].toUpperCase() === 'O' && output[2].toUpperCase() === 'T' ) {
            output = [
              'Address not', 'available',
            ]
          }
          return output
        }
        else {
          return null
        }
      },
      incorpNum() {
        if (this.conflictData) {
          return this.conflictData['incorp #']
        }
        else {
          return null
        }
      },
      incorporated() {
        if (this.conflictData) {
          return this.conflictData['incorporated']
        }
        else {
          return null
        }
      },
      jurisdiction() {
        if (this.conflictData) {
          return this.conflictData['jurisdiction']
        }
        else {
          return null
        }
      },
      natureOfBusiness() {
        if (this.conflictData) {
          return this.conflictData['nature of business']
        }
        else {
          return null
        }
      },
      records_office_delivery_address() {
        if (this.conflictData) {
          let lines = this.conflictData['records office delivery address']
          let l = lines.length
          let lastLine = lines[l - 4] + ' ' + lines[l - 3] + ' ' + lines[l - 2] + ' ' + lines[l - 1]
          let output = []
          for ( let r = l - 5; r >= 0; r-- ) {
            output = [lines[r], ...output]
          }
          output.push( lastLine )
          if ( output[0].toUpperCase() === 'N' && output[1].toUpperCase() === 'O' && output[2].toUpperCase() === 'T' ) {
            output = [
              'Address not', 'available',
            ]
          }
          return output
        }
        else {
          return null
        }
      },
      registered_office_delivery_address() {
        if (this.conflictData) {
          let lines = this.conflictData['registered office delivery address']
          let l = lines.length
          let lastLine = lines[l - 4] + ' ' + lines[l - 3] + ' ' + lines[l - 2] + ' ' + lines[l - 1]
          let output = []
          for ( let r = l - 5; r >= 0; r-- ) {
            output = [lines[r], ...output]
          }
          output.push( lastLine )
          if ( output[0].toUpperCase() === 'N' && output[1].toUpperCase() === 'O' && output[2].toUpperCase() === 'T' ) {
            output = [
              'Address not', 'available',
            ]
          }
          return output
        }
        else {
          return null
        }
      },
      is_xpro() {
        if (this.conflictData) {
          if ( this.conflictData['jurisdiction'] === 'BC' ) {
            return false
          }
          else {
            return true
          }
        }
        else {
          return false
        }
      },
    },
    methods: {
      is_not_available(val) {
        if ( val === 'Not Available' ) {
          return true
        }
        else {
          return false
        }
      },
    },
  }
</script>

<style scoped>
  .item-heading {
    font-weight: 600 !important;
  }

  .bg-color {
    background-color: var(--xl-cyan);
  }

</style>


