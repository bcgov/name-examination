<template>
  <v-container fluid ma-0 pa-0 >
    <v-layout :conflict-highlighted="childIndex === n && focus === 'conflicts'"
              :id="child.id"
              wrap
              ma-0
              align-center
              px-4>
      <v-flex width-5 v-if="child.nrNumber">
        <v-checkbox style="position: relative; top:4px"
                    :id="`checkbox-${child.id}`"
                    :disabled="checkboxDisabled"
                    :value="child.nrNumber"
                    :input-value="selectedNRs"
                    @click.stop.prevent="setCheckbox(child)"/>
      </v-flex>
      <v-flex width-60
              cursor-pointer
              @click="clickChild(child, n)"
              no-overflow
              v-html="child.highlightedText"/>
      <v-flex width-15
              cursor-pointer
              v-if="child.nrNumber">{{ child.nrNumber }}
      </v-flex>
      <v-flex width-5
              cursor-pointer
              text-left
              v-if="child.jurisdiction">{{ child.jurisdiction }}
      </v-flex>
      <v-flex width-15
              cursor-pointer
              text-left
              v-if="child.startDate">{{ formatDate(child.startDate) }}
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex lg12 v-if="expandedID === child.id">
        <div>
          <ConflictInfo class="conflict-detail"/>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import ConflictInfo from './ConflictInfo'
  import moment from 'moment'
  import spinner from '../../../spinner'

  export default {
    name: 'ConflictListItem',
    components: { spinner, ConflictInfo },
    props: [
      'child',
      'childIndex',
      'clickChild',
      'expandedID',
      'focus',
      'id',
      'checkboxDisabled',
      'n',
      'selectedNRs',
      'setCheckbox',
    ],
    methods: {
      formatDate(d) {
        return moment(d).format('YYYY-MM-DD')
      }
    }
  }
</script>

<style scoped>
  .conflict-detail-spinner:not(.hidden) ~ .conflict-detail {
    display: none !important;
  }

  .no-overflow {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cursor-pointer, .title-match, .bucket-list {
    cursor: pointer !important;
  }

  .conflict-exact-match {
    color: var(--priority) !important;
    font-weight: 400;
  }

  .conflict-meta {
    text-transform: lowercase !important;
    font-weight: 400 !important;
    font-style: italic !important;
  }

  .conflict-result {
    color: #38598a;
    height: 32px !important;
  }

  .conflict-highlighted {
    background-color: #dceffa;
  }

  .shift-up {
    position: relative;
    top: -15px !important;
  }

  .width-15 {
    width: 15%;
  }

  .width-5 {
    width: 5%;
  }

  .width-10 {
    width: 10%;
  }

  .width-60 {
    width: 60%;
  }
</style>
