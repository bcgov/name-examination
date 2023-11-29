<template>
  <!-- Layout the combo selects in reverse so they don't overlap each other https://stackoverflow.com/a/77210506 -->
  <div class="flex basis-1/2 flex-col-reverse gap-y-8">
    <div>
      <span class="font-semibold">Trademarks</span>
      <ListSelect
        v-model="selectedTrademarks"
        :options="examine.trademarksJSON.names.map((t) => t.name)"
        multiple
        options-style="!max-h-40"
        :disabled="listSelectsDisabled"
      >
        <Chips
          v-if="selectedTrademarks.length > 0"
          v-model="selectedTrademarks"
        />
      </ListSelect>
    </div>

    <div>
      <span class="font-semibold">Macros</span>
      <ListSelect
        v-model="selectedMacros"
        :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]"
        multiple
        options-style="!max-h-48"
        :disabled="listSelectsDisabled"
      >
        <Chips v-if="selectedMacros.length > 0" v-model="selectedMacros" />
      </ListSelect>
    </div>

    <div>
      <span class="font-semibold">Conflicts</span>
      <ListSelect
        v-model="examine.selectedConflicts"
        :options="examine.conflicts"
        multiple
        options-style="!max-h-48"
        :options-display="(option: Conflict) => option.text"
        :disabled="listSelectsDisabled"
      >
        <Chips
          v-if="examine.selectedConflicts.length > 0"
          v-model="examine.selectedConflicts"
          :display="(conflict: Conflict) => conflict.text"
        />
        <template #no-data>
          {{
            examine.conflictsAutoAdd
              ? 'No conflicts'
              : 'No conflicts selected (and auto add is off)'
          }}
        </template>
      </ListSelect>
    </div>

    <div>
      <span class="font-semibold">Conditions</span>
      <ListSelect
        v-model="selectedConditions"
        :options="['Cooperative']"
        :disabled="listSelectsDisabled"
        multiple
        options-style="!max-h-48"
      >
        <Chips
          v-if="selectedConditions.length > 0"
          v-model="selectedConditions"
        />
      </ListSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
import type { Conflict } from '~/types'

const examine = useExamineStore()

const listSelectsDisabled = computed(() => examine.requestMessageEdited)
const selectedConditions = ref(['Cooperative'])
const selectedMacros = ref([])
const selectedTrademarks = ref([])
</script>
