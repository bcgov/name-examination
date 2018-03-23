/* eslint-disable */
<template>
  <div id="settings">
    <div class="settings-form">
      <form @submit.prevent="onSubmit">
        <div class="input">
          <label for="dbUrl">DB URL</label>
          <input
            type="text"
            id="dbUrl"
            v-model="dbURL">
        </div>
        <div class="input">
          <label for="secKey">Security Key</label>
          <input
            type="text"
            id="secKey"
            v-model="secKey">
        </div>
        <div class="submit">
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    data() {
      return(
          dbUrl,
          secKey
      )
    },
    methods: {
      onSubmit: function () {
        const formData = {
          dbURL: this.dbURL,
          secKey: this.secKey
        }
        this.$store.dispatch('dbConfigSetup', {dbURL: formData.dbURL, secKey: formData.secKey})
      }
    }
  }
</script>

<style scoped>
  .settings-form {
    width: 400px;
    margin: 30px auto;
    border: 1px solid #eee;
    padding: 20px;
    box-shadow: 0 2px 3px #ccc;
  }

  .input {
    margin: 10px auto;
  }

  .input label {
    display: block;
    color: #4e4e4e;
    margin-bottom: 6px;
  }

  .input input {
    font: inherit;
    width: 100%;
    padding: 6px 12px;
    box-sizing: border-box;
    border: 1px solid #ccc;
  }

  .input input:focus {
    outline: none;
    border: 1px solid #521751;
    background-color: #eee;
  }

  .submit button {
    border: 1px solid #521751;
    color: #521751;
    padding: 10px 20px;
    font: inherit;
    cursor: pointer;
  }

  .submit button:hover,
  .submit button:active {
    background-color: #521751;
    color: white;
  }

  .submit button[disabled],
  .submit button[disabled]:hover,
  .submit button[disabled]:active {
    border: 1px solid #ccc;
    background-color: transparent;
    color: #ccc;
    cursor: not-allowed;
  }
</style>
