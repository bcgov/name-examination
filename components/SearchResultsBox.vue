<template>
  <div class="h-full overflow-x-auto rounded-md border">
    <table class="min-h-fit table-auto">
      <thead class="sticky top-0">
        <tr class="bg-bcgov-blue5 text-left text-sm text-white">
          <th
            v-for="column in selectedColumns"
            :key="column"
            class="border-b border-gray-200 px-2 py-1"
          >
            <a
              v-if="layout[column].clickable"
              href="#"
              @click="layout[column].clickable.onClick"
              class="flex items-center"
            >
              {{ column }}
              <svg-icon
                type="mdi"
                viewBox="0 -6 28 28"
                :path="layout[column].clickable.icon.value"
              />
            </a>
            <span v-else>
              {{ column }}
            </span>
          </th>
        </tr>

        <!-- Filters Row -->
        <tr>
          <th
            v-for="column in selectedColumns"
            :key="column"
            class="whitespace-nowrap bg-sky-100 px-1 py-1 text-sm font-normal"
            :class="'width' in layout[column] ? layout[column].width : 'w-fit'"
          >
            <input
              v-if="'text_input' in layout[column]"
              type="text"
              :placeholder="layout[column].text_input"
              class="w-full rounded border p-1.5"
              @keyup.enter="filters.filters[column] = $event.target.value"
            />

            <ListSelect
              v-else-if="'dropdown' in layout[column]"
              v-model="filters.filters[column]"
              :options="layout[column].dropdown"
            >
              {{ filters.filters[column] }}
            </ListSelect>
          </th>
        </tr>
      </thead>

      <tbody v-if="filters.resultNum == 0">
        <tr>
          <td colspan="13" class="border-b border-gray-200 py-4 text-center">
            No Data Available
          </td>
        </tr>
      </tbody>

      <tbody v-else class="text-sm" :class="{ collapse: filters.isLoading }">
        <tr
          v-for="row in filters.rows"
          :key="row"
          class="align-top transition duration-200 ease-in-out hover:bg-gray-200"
        >
          <td
            v-for="column in selectedColumns"
            :key="column"
            class="whitespace-pre-line border-b border-gray-300 px-2 py-2"
          >
            <p class="line-clamp-4">
              {{ row[column] }}
            </p>
          </td>
        </tr>
      </tbody>
      <LoadingSpinner v-if="filters.isLoading" />
    </table>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSearchFiltersStore } from '../store/searchfilters'
import {
  Status,
  ConsentRequired,
  Priority,
  ClientNotification,
  Submitted,
  LastUpdate,
} from '../enums/dropdownEnums'
import { SearchColumns } from '../enums/SearchColumns'
import { mdiArrowDown, mdiArrowUp } from '@mdi/js'

const filters = useSearchFiltersStore()

// User-selected columns in order
const selectedColumns = computed(() =>
  filters.fixedColumns.filter((column) =>
    filters.selectedColumns.includes(column)
  )
)

/**
 * An object describing how to display the columns in the table header.
 * Including a `dropdown` property will create a dropdown with the given list of options,
 * the `text_input` property will create a text input with the given placeholder.
 * A `width` property can be given to specify a custom column width, the value should be a valid Tailwind class.
 */
const layout = {
  [SearchColumns.Status]: {
    dropdown: Object.values(Status),
  },
  [SearchColumns.LastModifiedBy]: {
    text_input: 'Username',
  },
  [SearchColumns.NameRequestNumber]: {
    text_input: 'NR Number',
    width: 'w-28',
  },
  [SearchColumns.Names]: {
    text_input: 'Name',
    width: 'w-80',
  },
  [SearchColumns.ApplicantFirstName]: {
    text_input: 'First Name',
  },
  [SearchColumns.ApplicantLastName]: {
    text_input: 'Last Name',
  },
  [SearchColumns.NatureOfBusiness]: {},
  [SearchColumns.ConsentRequired]: {
    dropdown: Object.values(ConsentRequired),
  },
  [SearchColumns.Priority]: {
    dropdown: Object.values(Priority),
  },
  [SearchColumns.ClientNotification]: {
    dropdown: Object.values(ClientNotification),
  },
  [SearchColumns.Submitted]: {
    dropdown: Object.values(Submitted),
    clickable: {
      icon: computed(() =>
        filters.submittedDateOrder === 'asc' ? mdiArrowDown : mdiArrowUp
      ),
      onClick: filters.toggleSubmittedDateOrder,
    },
  },
  [SearchColumns.LastUpdate]: {
    dropdown: Object.values(LastUpdate),
  },
  [SearchColumns.LastComment]: {},
}

// When component is mounted, display initial values from the table
onMounted(async () => {
  await filters.getRows()
})
</script>
