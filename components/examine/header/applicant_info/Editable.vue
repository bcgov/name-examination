<template>
  <div class="flex flex-col gap-y-1">
    <b>Applicant</b>
    <TextInput placeholder="First Name" value="Jack" />
    <TextInput placeholder="Middle Name" />
    <TextInput placeholder="Last Name" value="Frost" />

    <b>Client</b>
    <TextInput placeholder="First Name" value="Jane" />
    <TextInput placeholder="Last Name" value="Frost" />

    <b>Address</b>
    <TextInput placeholder="Line 1" value="3434 Main Street" />
    <TextInput placeholder="Line 2" value="Suite 303" />
    <TextInput placeholder="Line 3" value="Top Floor" />
    <div class="flex gap-x-1">
      <TextInput placeholder="City" class="basis-2/3" value="Saywarn" />
      <TextInput class="basis-1/3" value="BC" />
    </div>

    <div class="flex gap-x-1">
      <TextInput class="basis-2/3" value="v8v8v8" />
      <TextInput placeholder="Country" class="basis-1/3" value="CA" />
    </div>

    <b>Phone</b>
    <TextInput value="305-343-3434"/>

    <b>Fax</b>
    <TextInput value="306-343-3333"/>

    <b>Email</b>
    <TextInput value="test@gov.bc.ca"/>

    <b>Contact</b>
    <TextInput value="Jack Frost"/>
  </div>
</template>
