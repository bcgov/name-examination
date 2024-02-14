<template>
  <div class="flex flex-col gap-y-2">
    <div v-if="examine.clientFirstName || examine.clientLastName">
      <h3 class="font-bold">Client</h3>
      <p>{{ examine.clientFirstName }} {{ examine.clientLastName }}</p>
    </div>

    <div v-if="examine.firstName || examine.lastName">
      <h3 class="font-bold">Applicant</h3>
      <p>{{ examine.firstName }} {{ examine.lastName }}</p>
    </div>

    <div>
      <h3 class="font-bold">Address</h3>
      <p>{{ examine.addressLine1 }}</p>
      <p>{{ examine.addressLine2 }}</p>
      <p>{{ examine.addressLine3 }}</p>
      <p>{{ examine.city }} {{ examine.province }}</p>
      <p>{{ examine.postalCode }}</p>
      <p>{{ examine.country }}</p>
    </div>

    <div v-if="examine.phone">
      <h3 class="font-bold">Phone</h3>
      <p>{{ examine.phone }}</p>
    </div>

    <div v-if="examine.fax">
      <h3 class="font-bold">Fax</h3>
      <p>{{ examine.fax }}</p>
    </div>

    <div v-if="examine.conEmail">
      <h3 class="font-bold">Email</h3>
      <p>{{ examine.conEmail }}</p>
    </div>

    <div v-if="examine.contactName">
      <h3 class="font-bold">Contact</h3>
      <p>{{ examine.contactName }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExamination } from '~/store/examine'
const examine = useExamination()
</script>
