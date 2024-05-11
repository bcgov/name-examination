<template>
  <footer
    id="app-footer"
    class="grid grid-cols-10 items-center min-h-[3.5rem] text-[0.9375rem] px-[1rem] xl:pr-[6rem]
           bg-bcgov-blue5 border-t-2 border-bcgov-gold5"
  >
    <nav class="col-span-7 flex justify-between">
      <ul class="p-0 list-none">
        <AppFooterNavLink
          text="Home"
          route="/"
        />
        <AppFooterNavLink
          text="Release Notes"
          route="https://www.release-notes.bcregistry.gov.bc.ca"
          target="_blank"
        />
        <AppFooterNavLink
          text="Disclaimer"
          route="https://www2.gov.bc.ca/gov/content/home/disclaimer"
          target="_blank"
        />
        <AppFooterNavLink
          text="Privacy"
          route="https://www2.gov.bc.ca/gov/content/home/privacy"
          target="_blank"
        />
        <AppFooterNavLink
          text="Accessibility"
          route="https://www2.gov.bc.ca/gov/content/home/accessibility"
          target="_blank"
        />
        <AppFooterNavLink
          text="Hours of Availability"
          route="https://www2.gov.bc.ca/gov/content?id=C41D8179671441B2BAA3BDDD3D89C9A9"
          target="_blank"
        />
        <AppFooterNavLink
          text="Copyright"
          route="https://www2.gov.bc.ca/gov/content/home/copyright"
          target="_blank"
        />
      </ul>
    </nav>

    <div class="col-span-3 flex justify-self-end justify-content-end">
      <span class="italic text-bcgov-gold5">A BC Online Application</span>
      <AppFooterVersionInfo />
    </div>
  </footer>
</template>
