/* eslint-disable */
<template>
  <div id="signin">
    <div class="signin-form" @click="keycloaklogin()">
    </div>
    <div class="signin-form" @click="loadProfile()">
    </div>
    <div class="signin-form" @click="loadUserInfo()">
    </div>
    <div class="signin-form" @click="loadUserToken()">
    </div>
    <div class="signin-form" @click="tokenParsed()">
    </div>
    <div style="background-color: #ddd; border: 1px solid #ccc; padding:
                  10px; word-wrap: break-word; white-space: pre-wrap;" id="output"></div>
  </div>
</template>

<script>
/* eslint-disable */

//var keycloak = Keycloak('static/config.json')
var keycloak = Keycloak('static/keycloakLocal.json')

var initOptions = {
  responseMode: 'fragment',
  flow: 'standard'
};

keycloak.init(initOptions);

function output(data) {
  if (typeof data === 'object') {
    data = JSON.stringify(data, null, '  ');
  }
  document.getElementById('output').innerHTML = data;
}

export default {
    data() {
      return {
        email: '',
        password: ''
      }
    },
    mounted() {
    },
    methods: {
      keycloaklogin(){
        keycloak.login();
      },
      loadProfile: function () {
        keycloak.loadUserProfile().success(function (profile) {
          output(profile);
        }).error(function () {
          output('Failed to load profile');
        });
      },
      loadUserToken: function () {
          output(keycloak.parseParams);
      },
      loadUserInfo: function () {
        keycloak.loadUserInfo().success(function (userInfo) {
          output(userInfo);
        }).error(function () {
          output('Failed to load user info');
        });
      },
      tokenParsed: function () {
          output(keycloak.tokenParsed);
      },
      refreshToken: function (minValidity) {
        keycloak.updateToken(minValidity).success(function (refreshed) {
          if (refreshed) {
            output(keycloak.tokenParsed);
          } else {
            output('Token not refreshed, valid for ' + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
          }
        }).error(function () {
          output('Failed to refresh token');
        });
      },
      init: function () {
        keycloak.init(initOptions).success(function (authenticated) {
          output('Init Success (' + (authenticated ? 'Authenticated' : 'Not Authenticated') + ')');
        }).error(function () {
          output('Init Error');
        });
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
