<template>
  <div class="w-full max-w-sm">
    <Popover v-slot="{ open }" class="relative">
      <PopoverButton
        :class="open ? '' : 'text-opacity-90'"
        class="group inline-flex w-full items-center space-x-1 rounded-md border border-gray-300 bg-white px-3 py-1 font-bold text-black transition hover:bg-gray-200"
      >
        <ChatBubbleLeftIcon class="h-5 w-5" />
        <span class="grow text-left"
          >{{ comments.length }} C<u>o</u>mments</span
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
                placeholder="Create a new comment..."
              />
              <div class="flex basis-2/3 flex-col divide-y-2 overflow-auto">
                <div class="flex flex-col py-2" v-for="comment in comments">
                  <span>{{ comment.content }}</span>
                  <span class="italic"
                    >{{ comment.author }} &ndash; {{ comment.time }}</span
                  >
                </div>
              </div>
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

const comments = [
  {
    content:
      'Name choice 3 changed from BLACK HILL PERSONAL REAL ESTATE CORPORATION to BLACK HILL PERSONAL COOP COOPERATIVE',
    author: 'anonymous@idir',
    time: '2023-05-31, 10:00am',
  },
  {
    content:
      'Name choice 3 changed from BLACK HILL to BLACK HILL PERSONAL REAL ESTATE CORPORATION',
    author: 'anonymous@idir',
    time: '2023-05-31, 9:12am',
  },
  {
    content:
      'Name choice 3 changed from BLACK HILL to BLACK HILL PERSONAL REAL ESTATE CORPORATION',
    author: 'anonymous@idir',
    time: '2023-05-31, 9:12am',
  },
  {
    content:
      'Name choice 3 changed from BLACK HILL to BLACK HILL PERSONAL REAL ESTATE CORPORATION',
    author: 'anonymous@idir',
    time: '2023-05-31, 9:12am',
  },
]
</script>
