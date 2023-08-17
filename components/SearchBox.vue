<template>
  <div
    class="overflow-x-auto border border-silver-200"
  >
    <table class="min-w-full bg-white table-auto">
      <thead class="sticky top-0 z-1">
        <tr class="text-left headers text-white h-14 text-lg">
          <th
            v-for="column in filteredColumns"
            :key="column.key"
            class="py-2 px-4 border-b border-gray-200"
          >
            {{ column.key }}
          </th>
        </tr>

        <!-- Filters Row -->
        <tr>
          <th
            v-for="column in filteredColumns"
            :key="column.key"
            class="text-lg py-2 px-4 border-y border-gray-200 bcgovgold"
          >
            <!-- Render text input for specified columns -->
            <input
              v-if="column.name !== 'NatureOfBusiness' && column.name !== 'LastComment'&&
                ['LastModifiedBy','NameRequestNumber', 'Names', 'ApplicantFirstName', 'ApplicantLastName']
                  .includes(column.name)"
              v-model="columnFilters[column.name]"
              type="text"
              :placeholder="column.key"
              class="border rounded px-2 py-1 w-full"
              @keyup.enter="handleFilterChange"
            >

            <!-- Render dropdown for other columns excluding 'NatureOfBusiness' and 'LastComment' -->
            <select
              v-else-if="column.name !== 'NatureOfBusiness' && column.name !== 'LastComment'"
              v-model="columnFilters[column.name]"
              class="border rounded px-2 py-1"
              @change="handleFilterChange"
            >
              <!-- Render the dropdown options for the current column -->
              <option
                v-for="option in getDropdownOptions(column.name)"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </th>
        </tr>
      </thead>

      <tbody
        v-if="results !== 0 && (filters.isLoading==false)"
        class="text-lg text-left z-0"
      >
        <tr
          v-for="row in rows"
          :key="row.id"
          class="transition duration-75 ease-in-out hover:bg-gray-200"
        >
          <td
            v-for="column in filteredColumns"
            :key="column.key"
            class="py-2 px-4 border-b border-gray-200"
          >
            {{ row[column.name] }}
          </td>
        </tr>
      </tbody>
      <tbody
        v-else-if="(filters.isLoading==true)"
      >
        <!-- Spinner-->
        <div class="absolute right-1/2 bottom-1/2  transform translate-x-1/2 translate-y-1/2">
          <div class="border-t-transparent border-solid animate-spin rounded-full border-blue-400 border-8 h-56 w-56" />
        </div>
      </tbody>

      <tbody v-else>
        <tr>
          <td
            colspan="13"
            class="text-center py-4 border-b border-gray-200"
          >
            No Data Available
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useSearchFilters } from '../store/searchfilters'

const filters = useSearchFilters()

// Reactive reference for rows
const rows = ref([])
const results = computed(() => filters.resultNum)

// Selected from dropdown by user
const selectedColumns = computed(() => filters.selectedColumns)
// Columns to be displayed
const filteredColumns = computed(() => {
  return fixedColumns.filter((column) => selectedColumns.value.includes(column.name))
})
// Object to store the filter values entered by the user
const columnFilters = computed(() => filters.filters)

const fixedColumns = [
  { name: 'Status', key: 'Status' },
  { name: 'LastModifiedBy', key: 'Modified By' },
  { name: 'NameRequestNumber', key: 'NR Number' },
  { name: 'Names', key: 'Names' },
  { name: 'ApplicantFirstName', key: 'Applicant First Name' },
  { name: 'ApplicantLastName', key: 'Applicant Last Name' },
  { name: 'NatureOfBusiness', key: 'Nature Of Business' },
  { name: 'ConsentRequired', key: 'Consent Required' },
  { name: 'Priority', key: 'Priority' },
  { name: 'ClientNotification', key: 'Notified' },
  { name: 'Submitted', key: 'Submitted' },
  { name: 'LastUpdate', key: 'Last Update' },
  { name: 'LastComment', key: 'Last Comment' }
]

const handleFilterChange = async () => {
  // Update the Pinia store with the new filter values
  await filters.updateFilters(columnFilters.value)

  // Fetch rows based on the updated filters from the Pinia store
  await filters.getRows() // Now, this uses the updated filters for the API call
  rows.value = filters.rows
  console.log(rows.value)
}

// When component is mounted, to display initial values from the table
onMounted(async () => {
  await filters.getRows()
  rows.value = filters.rows
})

const dropdownOptions = {
  Status: ['All', 'HOLD', 'INPROGRESS', 'DRAFT', 'EXPIRED',
    'CANCELLED', 'APPROVED', 'CONDITIONAL', 'CONSUMED', 'REJECTED', 'COMPLETED'],
  ConsentRequired: ['All', 'Yes', 'No', 'Received'],
  Priority: ['All', 'Priority', 'Standard'],
  ClientNotification: ['All', 'Notified', 'Not Notified'],
  Submitted: ['All', 'Today', '7 days', '30 days', '90 days', '1 year', '3 years', '5 years', 'All', 'Custom'],
  LastUpdate: ['All', 'Today', 'Yesterday', '2 days', '7 days', '30 days', 'All']
}

const getDropdownOptions = (columnName) => {
  return dropdownOptions[columnName] || []
}

// To re-render table body whenver rows is changed due to changed display or page number
watch(
  () => filters.rows,
  (newRows) => {
    rows.value = newRows
  }
)

</script>

<style scoped>
.headers{
  background-color: #003366
}
.bcgovgold {
    background-color: #fcba19;
}
</style>
