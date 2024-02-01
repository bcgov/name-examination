<template>
  <div
    class="h-full overflow-x-auto rounded-md border"
  >
    <table class="min-h-fit min-w-full table-auto">
      <thead class="sticky top-0">
        <tr class="h-12 bg-bcgov-blue5 text-left text-sm text-white">
          <th
            v-for="column in selectedColumns"
            :key="column"
            class="border-b border-gray-200 px-2 py-1"
          >
            <a
              v-if="layout[column].clickable"
              href="#"
              class="flex items-center"
              @click="layout[column].clickable.onClick"
            >
              {{ column }}
              <component
                :is="layout[column].clickable.icon.value"
                class="h-4 stroke-2"
              />
            </a>
            <span v-else>
              {{ column }}
            </span>
          </th>
        </tr>

        <!-- Filters Row -->
        <tr ref="filter_inputs">
          <th
            v-for="column in selectedColumns"
            :key="column"
            class="whitespace-nowrap bg-sky-100 px-1 py-1 text-sm font-normal"
            :class="'width' in layout[column] ? layout[column].width : 'w-fit'"
          >
            <input
              v-if="'text_input' in layout[column]"
              :id="column"
              type="text"
              :placeholder="layout[column].text_input"
              class="w-full rounded-md border p-1.5"
              :value="search.filters[column as FilterKey]"
              @keyup.enter="updateTextInputFilters()"
            >

            <ListSelect
              v-else-if="'dropdown' in layout[column]"
              v-model="search.filters[column as FilterKey]"
              :options="layout[column].dropdown"
              @change="
                (option) => [
                  updateTextInputFilters(),
                  checkIfCustomSubmitDateChosen(option),
                ]
              "
            >
              {{ search.filters[column as FilterKey] }}
            </ListSelect>
          </th>
        </tr>
      </thead>

      <tbody
        v-if="search.resultNum == 0"
        :class="{ 'opacity-10': search.isLoading }"
      >
        <tr>
          <td
            colspan="13"
            class="border-b border-gray-200 py-4 text-center"
          >
            {{ NO_DATA_STRING }}
          </td>
        </tr>
      </tbody>

      <tbody
        v-else
        class="text-sm"
        :class="{ 'opacity-10': search.isLoading }"
      >
        <tr
          v-for="row in search.rows"
          :key="row[SearchColumns.NameRequestNumber]"
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

      <div
        class="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 transform"
      >
        <LoadingSpinner v-if="search.isLoading" />
      </div>
    </table>

    <PopupDialog :show="showDateDialog">
      <template #title>Choose a Date Range</template>
      <SearchDateForm
        :initialStart="search.customSubmittedStartDate"
        :initialEnd="search.customSubmittedEndDate"
        @submit="onDateDialogSubmit"
        @cancel="onDateDialogCancel"
      />
    </PopupDialog>
  </div>
</template>

<script setup lang="ts">
/**
 * A component for showing the results of a name request search
 */
import { computed, onMounted } from 'vue'
import { useSearchStore } from '~/store/search'
import {
  ConsentRequired,
  Priority,
  ClientNotification,
  Submitted,
  LastUpdate
} from '~/enums/filter-dropdowns'
import { SearchColumns } from '~/enums/search-columns'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/outline'

import { useUserStore } from '~/store/user-cache'
import { StatusSearchFilter, type FilterKey } from '~/types/search'


const NO_DATA_STRING = 'No Data Available'

const search = useSearchStore()
const showDateDialog = ref(false)
const filter_inputs = ref<HTMLTableRowElement | null>(null)

// User-selected columns in order
const selectedColumns = computed(() =>
  search.fixedColumns.filter((column) =>
    search.selectedColumns.includes(column)
  )
)

/**
 * An object describing how to display the columns in the table header.
 * Including a `dropdown` property will create a dropdown with the given list of options,
 * the `text_input` property will create a text input with the given placeholder.
 * A `width` property can be given to specify a custom column width, the value should be a valid Tailwind class.
 */
type ILayout = {
  [key in SearchColumns]: any
}
const layout: ILayout = {
  [SearchColumns.Status]: {
    dropdown: Object.values(StatusSearchFilter),
  },
  [SearchColumns.LastModifiedBy]: {
    text_input: 'Username'
  },
  [SearchColumns.NameRequestNumber]: {
    text_input: 'NR Number',
    width: 'w-28'
  },
  [SearchColumns.Names]: {
    text_input: 'Name',
    width: 'w-80'
  },
  [SearchColumns.ApplicantFirstName]: {
    text_input: 'First Name'
  },
  [SearchColumns.ApplicantLastName]: {
    text_input: 'Last Name'
  },
  [SearchColumns.NatureOfBusiness]: {},
  [SearchColumns.ConsentRequired]: {
    dropdown: Object.values(ConsentRequired)
  },
  [SearchColumns.Priority]: {
    dropdown: Object.values(Priority)
  },
  [SearchColumns.ClientNotification]: {
    dropdown: Object.values(ClientNotification)
  },
  [SearchColumns.Submitted]: {
    dropdown: Object.values(Submitted),
    clickable: {
      icon: computed(() =>
        search.submittedDateOrder === 'asc' ? ArrowDownIcon : ArrowUpIcon
      ),
      onClick: search.toggleSubmittedDateOrder
    }
  },
  [SearchColumns.LastUpdate]: {
    dropdown: Object.values(LastUpdate)
  },
  [SearchColumns.LastComment]: {}
}

/**
 * Update all filters that use a text input.
 * This is useful if you edit multiple text inputs and press enter on only one,
 * but want the model values of all the other inputs updated as well.
 */
function updateTextInputFilters () {
  const headCells = filter_inputs.value?.children
  if (headCells == null) return

  for (const headCell of headCells) {
    const filterElement = headCell.children[0]
    if (filterElement?.tagName.toLowerCase() == 'input') {
      // @ts-ignore
      search.filters[filterElement.id as FilterKey] = (
        filterElement as HTMLInputElement
      ).value
    }
  }
}

/**
 * Check if the `Custom` option in the submitted date filter was chosen.
 * If it is, then the date dialog should pop up.
 */
function checkIfCustomSubmitDateChosen (option: any) {
  if (option == Submitted.Custom) {
    showDateDialog.value = true
  }
}

function onDateDialogSubmit (startDate: string, endDate: string) {
  search.customSubmittedStartDate = startDate
  search.customSubmittedEndDate = endDate
  showDateDialog.value = false
}

function onDateDialogCancel () {
  search.filters.Submitted = search.lastSubmittedDateOption
  showDateDialog.value = false
}

// When the component is mounted, display initial values from the table
onMounted(async () => {
  search.resetFilters()
  search.resetDisplayAndPage()
  await search.updateRows()
})

const userStore = useUserStore()

watch(userStore, async () => {
  await search.updateRows()
})

</script>
