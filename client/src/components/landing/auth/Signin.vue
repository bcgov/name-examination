/* eslint-disable */
<template>
  <div id="signin">
      <div style="background-color: #ddd; border: 1px solid #ccc; padding:
                  10px; word-wrap: break-word; white-space: pre-wrap;" id="output"></div>
  </div>
</template>

<script>
/* eslint-disable */
let keycloak = Keycloak('static/keycloakLocal.json');

function authSuccess() {
  this.$store.dispatch('kcauth',keycloak.tokenParsed);
};

export default {
    data() {
      return {
        email: '',
        password: ''
      }
    },
    mounted() {
      // set callback function for authorization notification
      //keycloak.onAuthSuccess = function() { authSuccess() }
      console.log("Checking token");
      if(keycloak.tokenParsed == null) {
        this.logMeIn();
      }
    },
  methods: {
    logMeIn() {
      console.log("User logging in");
      const cb = this;
      keycloak.init({ onLoad: 'login-required'}).success(function(authenticated) {
        cb.$store.dispatch('kcauth',keycloak.tokenParsed);
      });
    },
    output(data) {
      if (typeof data === 'object') {
        data = JSON.stringify(data, null, '  ');
      }
      document.getElementById('output').innerHTML = data;
    }
  }
}
</script>

<style scoped>
  .signin-form {
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
