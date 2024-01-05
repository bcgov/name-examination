<template>
  <div class="flex flex-col gap-y-1">
    <h3 class="font-bold">Client</h3>
    <TextInput
      v-model="examine.clientFirstName"
      placeholder="First Name"
      maxlength="200"
    />
    <TextInput
      v-model="examine.clientLastName"
      placeholder="Last Name"
      maxlength="200"
    />

    <h3 class="font-bold">Applicant</h3>
    <TextInput
      v-model="examine.firstName"
      placeholder="First Name"
      maxlength="200"
    />
    <TextInput
      v-model="examine.middleName"
      placeholder="Middle Name"
      maxlength="200"
    />
    <TextInput
      v-model="examine.lastName"
      placeholder="Last Name"
      maxlength="200"
    />

    <h3 class="font-bold">Address</h3>
    <TextInput
      v-model="examine.addressLine1"
      placeholder="Line 1"
      maxlength="200"
    />
    <TextInput
      v-model="examine.addressLine2"
      placeholder="Line 2"
      maxlength="200"
    />
    <TextInput
      v-model="examine.addressLine3"
      placeholder="Line 3"
      maxlength="200"
    />
    <div class="flex gap-x-1">
      <TextInput
        v-model="examine.city"
        placeholder="City"
        class="basis-2/3"
        maxlength="200"
      />
      <TextInput
        v-model="examine.province"
        placeholder="Province"
        class="basis-1/3"
        maxlength="2"
      />
    </div>

    <div class="flex gap-x-1">
      <TextInput
        v-model="examine.postalCode"
        placeholder="Postal Code"
        class="basis-2/3"
        maxlength="20"
      />
      <TextInput
        v-model="examine.country"
        placeholder="Country"
        class="basis-1/3"
        maxlength="2"
      />
    </div>

    <h3 class="font-bold">Phone</h3>
    <TextInput
      v-model="examine.phone"
      placeholder="Phone Number"
      maxlength="30"
    />

    <h3 class="font-bold">Fax</h3>
    <TextInput v-model="examine.fax" placeholder="Fax Number" maxlength="30" />

    <h3 class="font-bold">Email</h3>
    <TextInput
      v-model="examine.conEmail"
      placeholder="Contact Email"
      maxlength="75"
    />

    <h3 class="font-bold">Contact</h3>
    <TextInput
      v-model="examine.contactName"
      placeholder="Contact Name"
      maxlength="200"
    />
  </div>
</template>

<script setup lang="ts">
import { useExamineStore } from '~/store/examine'
const examine = useExamineStore()
</script>
