<template>
  <div class="flex h-[100vh] flex-col">
    <AppHeaderContainer :authenticated="false" />
    <AppBanner />
    <slot />
  </div>
</template>
