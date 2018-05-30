/* eslint-disable*/
<template>
  <div class="signin">
  </div>
</template>

<script>
/* eslint-disable */
  var authorized = localStorage.getItem("AUTHORIZED");

  if (!authorized) {
    let keycloak = Keycloak('static/keycloak.json');
   //var token = localStorage.getItem('KEYCLOAK_TOKEN');
    var token;
    keycloak.init({token: token, onLoad: 'login-required'}).success(function (authenticated) {
      if (authenticated) {
        localStorage.setItem('KEYCLOAK_TOKEN', keycloak.token);
        localStorage.setItem("AUTHORIZED",true);

        // Get user profile
        keycloak.loadUserProfile().success(function (userProfile) {
          app.userName = userProfile.username;
          localStorage.setItem('USERNAME', app.userName);
          window.location.assign("/");
        });

      } else {
        alert('not authenticated');
      }
    }).error(function () {
      alert('failed to initialize');
    });
  }

  export default {
    name: "std-header",
    data() {
        return {
          userName: ''
        }
    },
    methods: {
      onLogout() {
            this.$store.dispatch('logout')
      }
    }
  }
  </script>

<style scoped>
  .signin{
  }
</style>
