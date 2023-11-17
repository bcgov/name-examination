<template>
  <div class="w-full max-w-sm">
    <Popover v-slot="{ open }" class="relative">
      <PopoverButton
        ref="popoverButton"
        :class="open ? '' : 'text-opacity-90'"
        class="group inline-flex w-full items-center space-x-1 rounded-md border border-gray-300 bg-white px-3 py-1 font-bold text-black transition hover:bg-gray-200"
      >
        <ChatBubbleLeftIcon class="h-5 w-5" />
        <span class="grow text-left"
          >{{ examine.comments.length }} C<u>o</u>mments</span
        >
        <ChevronDownIcon
          :class="open ? 'rotate-180' : ''"
          class="h-5 w-5 transition duration-150 ease-in-out group-hover:text-opacity-80"
          aria-hidden
        />
      </PopoverButton>

      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
        <PopoverPanel
          class="absolute z-10 mt-3 h-[60vh] w-80 max-w-sm transform px-4 sm:px-0 lg:max-w-3xl"
        >
          <div
            class="h-full overflow-auto rounded-md border border-gray-400 shadow-xl"
          >
            <div class="flex h-full flex-col space-y-1 bg-gray-100 p-3">
              <EditableTextBox
                class="basis-1/3"
                v-model="newCommentText"
                placeholder="Create a new comment..."
                confirm-mnemonic="v"
                @submit="console.log('submitted comment')"
              >
                <template #confirmText>
                  <span>Sa<u>v</u>e</span>
                </template>
              </EditableTextBox>

              <ExamineCommentsBox
                :comments="examine.comments"
                class="basis-2/3"
              />
            </div>
          </div>
        </PopoverPanel>
      </transition>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { ChatBubbleLeftIcon } from '@heroicons/vue/24/outline'
import { useExamineStore } from '~/store/examine'

const examine = useExamineStore()

const popoverButton = ref<HTMLButtonElement | null>(null)
const buttonElem = computed(
  () => (popoverButton.value as any).el as HTMLButtonElement
)
useMnemonic('o', () => buttonElem.value.click())

const newCommentText = ref('')
</script>
