<template>
  <div class="flex flex-col gap-y-1">
    <b>Applicant</b>
    <TextInput placeholder="First Name" value="Jack" maxlength="200" />
    <TextInput placeholder="Middle Name" maxlength="200" />
    <TextInput placeholder="Last Name" value="Frost" maxlength="200" />

    <b>Client</b>
    <TextInput placeholder="First Name" value="Jane" maxlength="200" />
    <TextInput placeholder="Last Name" value="Frost" maxlength="200" />

    <b>Address</b>
    <TextInput placeholder="Line 1" value="3434 Main Street" maxlength="200" />
    <TextInput placeholder="Line 2" value="Suite 303" maxlength="200" />
    <TextInput placeholder="Line 3" value="Top Floor" maxlength="200" />
    <div class="flex gap-x-1">
      <TextInput
        placeholder="City"
        class="basis-2/3"
        value="Saywarn"
        maxlength="200"
      />
      <TextInput class="basis-1/3" value="BC" maxlength="2" />
    </div>

    <div class="flex gap-x-1">
      <TextInput class="basis-2/3" value="v8v8v8" maxlength="20" />
      <TextInput
        placeholder="Country"
        class="basis-1/3"
        value="CA"
        maxlength="2"
      />
    </div>

    <b>Phone</b>
    <TextInput value="305-343-3434" maxlength="30" />

    <b>Fax</b>
    <TextInput value="306-343-3333" maxlength="30" />

    <b>Email</b>
    <TextInput value="test@gov.bc.ca" maxlength="75" />

    <b>Contact</b>
    <TextInput value="Jack Frost" maxlength="200" />
  </div>
</template>
