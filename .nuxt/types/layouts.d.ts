import { ComputedRef, Ref } from 'vue'
export type LayoutKey = string
declare module "/home/madhavkapoor/repos/name-examination-upgrade/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}