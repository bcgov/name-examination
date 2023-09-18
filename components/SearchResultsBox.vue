<template>
  <div class="overflow-x-auto rounded-md border">
    <table class="table-auto">
      <thead class="sticky top-0">
        <tr class="bg-bcgov-blue5 text-left text-sm text-white">
          <th
            v-for="column in selectedColumns"
            :key="column"
            class="border-b border-gray-200 px-2 py-1"
            :class="[column === SearchColumns.Names ? 'w-[22rem]' : 'w-fit']"
          >
            {{ column }}
          </th>
        </tr>

        <!-- Filters Row -->
        <tr>
          <th
            v-for="column in selectedColumns"
            :key="column"
            class="bg-sky-100 px-1 py-1 text-sm font-normal whitespace-nowrap"
          >
            <!-- Render text input for specified columns -->
            <input
              v-if="
                column !== SearchColumns.NatureOfBusiness &&
                column !== SearchColumns.LastComment &&
                [
                  SearchColumns.LastModifiedBy,
                  SearchColumns.NameRequestNumber,
                  SearchColumns.Names,
                  SearchColumns.ApplicantFirstName,
                  SearchColumns.ApplicantLastName,
                ].includes(column)
              "
              v-model="columnFilters[column]"
              type="text"
              :placeholder="column"
              class="w-full rounded border px-2 py-1"
              @keyup.enter="handleFilterChange($event)"
            />

            <!-- Render dropdown for other columns excluding 'NatureOfBusiness' and 'LastComment' -->
            <ListSelect
              v-else-if="
                column !== SearchColumns.NatureOfBusiness &&
                column !== SearchColumns.LastComment
              "
              v-model="columnFilters[column]"
              :options="getDropdownOptions(column)"
              @change="handleFilterChange"
            >
            {{ columnFilters[column] }}
            </ListSelect>
          </th>
        </tr>
      </thead>

      <tbody
        v-if="results !== 0 && filters.isLoading == false"
        class="text-sm"
      >
        <tr
          v-for="row in rows"
          :key="row"
          class="align-top transition duration-75 ease-in-out hover:bg-gray-200"
        >
          <td
            v-for="column in selectedColumns"
            :key="column"
            class="border-b border-gray-300 px-2 py-2 whitespace-pre-line"
          >
            <p class="line-clamp-4">
              {{ row[column] }}
            </p>
          </td>
        </tr>
      </tbody>
      <tbody v-else-if="filters.isLoading == true">
        <!-- Spinner-->
        <div
          class="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 transform"
        >
          <div
            class="h-24 w-24 animate-spin rounded-full border-8 border-solid border-blue-400 border-t-transparent"
          />
        </div>
      </tbody>

      <tbody v-else>
        <tr>
          <td colspan="13" class="border-b border-gray-200 py-4 text-center">
            No Data Available
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { searchFiltersStore } from '../store/searchfilters'
import {
  Status,
  ConsentRequired,
  Priority,
  ClientNotification,
  Submitted,
  LastUpdate,
} from '../enums/dropdownEnums'
import { SearchColumns } from '../enums/SearchColumns'

const filters = searchFiltersStore()

// Reactive reference for rows
const rows = computed(() => filters.rows)
const results = computed(() => filters.resultNum)

// Selected from dropdown by user
const selectedColumns = computed(() =>
  filters.fixedColumns.filter((column) =>
    filters.selectedColumns.includes(column)
  )
)

// Object to store the filter values entered by the user
const columnFilters = computed(() => filters.filters)

const handleFilterChange = async () => {
  // Update the Pinia store with the new filter values
  await filters.updateFilters(columnFilters.value)

  // Fetch rows based on the updated filters from the Pinia store
  await filters.getRows() // Now, this uses the updated filters for the API call
}

const dropdownOptions = {
  [SearchColumns.Status]: Object.values(Status),
  [SearchColumns.ConsentRequired]: Object.values(ConsentRequired),
  [SearchColumns.Priority]: Object.values(Priority),
  [SearchColumns.ClientNotification]: Object.values(ClientNotification),
  [SearchColumns.Submitted]: Object.values(Submitted),
  [SearchColumns.LastUpdate]: Object.values(LastUpdate),
}

const getDropdownOptions = (columnKey) => {
  return dropdownOptions[columnKey] || []
}

// When component is mounted, display initial values from the table
onMounted(async () => {
  await filters.getRows()
})
</script>
