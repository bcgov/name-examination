<!--eslint-disable-->
<template>
  <v-container conditions-container fluid ma-0 pa-0>
    <spinner className="conditions-spinner hidden" />
    <v-layout id="condition">
      <v-flex id="conditions-wrapper">
        <v-data-table :headers="headers"
                      class="conditions-table-style"
                      :items="tableData"
                      id="condition-table"
                      hide-actions>
          <template v-slot:items="props">
            <tr :active="props.item.id == selected"
                @click="setSelection(props.item)">
              <td class="pt-1" @click="setSelection(props.item)">{{ props.item.phrase }}</td>
              <td class="px-1 pt-1">{{ props.item.allow_use }}</td>
              <td class="px-1 pt-1">{{ props.item.consent_required }}</td>
              <td style="width: 30%"
                  class="px-1 pt-1">{{ props.item.text }}</td>
              <td style="width: 30%"
                  class="px-1 pt-1">{{ props.item.instructions }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
  import spinner from '@/components/application/spinner.vue'

  export default {
    name: 'ConditionsInfo',
    components: { spinner, },
    data() {
      return {
        headers: [
          { text: 'Word', value: 'phrase', align: 'left', sortable: false, width: '20%' },
          { text: 'Allow', value: 'allow_use', align: 'left', sortable: false, width: '6%', class: 'px-0' },
          { text: 'Consent', value: 'consent_required', align: 'left', sortable: false, width: '6%', class: 'px-0' },
          { text: 'Examiner Information', value: 'text', align: 'left', sortable: false, width: '34%', class: 'px-1' },
          { text: 'Instructions', value: 'instructions', align: 'left', sortable: false, width: '34%', class: 'px-1' },
        ],
        offset: 0,
        rows: 100,
      }
    },
    computed: {
      currentCondition: {
        get() {
          if (this.$store.getters.currentCondition && this.$store.getters.currentCondition) {
            return this.$store.getters.currentCondition
          }
        },
        set(value) {
          this.$store.commit('currentCondition', value)
        }
      },
      conditionsInfo() {
        return this.$store.getters.conditionsJSON
      },
      selected() {
        if (this.currentCondition && this.currentCondition.id) {
          return parseInt(this.currentCondition.id)
        }
        return null
      },
      tableData() {
        if (this.$store.getters.parseConditions) return this.$store.getters.parseConditions
        return []
      }
    },
    methods: {
      isActive(item) {
        if (!this.currentCondition) return false
        let { id } = this.currentCondition
        if (id == item.id) return true
        return false
      },
      setSelection(item) {
        if (this.selected && item.id == this.selected) {
          this.currentCondition = null
          return
        }
      this.currentCondition = item
      }
    },
  }
</script>

<style scoped>
  td:hover {
    cursor: pointer !important;
  }

  .cond-th-style {
    font-size: 14px !important;
    font-weight: 600 !important;
    height:45px !important;
  }

  .conditions-container {
    height: 450px;
    max-height: 450px;
  }
  .spinner:not(.hidden) ~ #conditions-wrapper {
    display: none;
  }

</style>
