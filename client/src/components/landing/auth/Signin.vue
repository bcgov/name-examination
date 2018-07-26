/* eslint-disable*/
<template>
  <div class="signin">
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: "std-header",
    data() {
        return {
          userName: ''
        }
    },
    mounted() {
      var authorized = localStorage.getItem("AUTHORIZED");
      var keycloak

      if (!authorized) {
        keycloak = Keycloak('static/keycloak/keycloak.json');
        var token
        const vm = this

        keycloak.init({token: token, onLoad: 'login-required'}).success(function (authenticated) {
          if (authenticated) {
            console.log('Keycloak Authenticated')

            localStorage.setItem('KEYCLOAK_TOKEN', keycloak.token);
            localStorage.setItem('KEYCLOAK_REFRESH', keycloak.refreshToken);
            localStorage.setItem('KEYCLOAK_EXPIRES', keycloak.tokenParsed.exp * 1000);
            localStorage.setItem("AUTHORIZED",true);

            // Get user profile
            keycloak.loadUserProfile().success(function (userProfile) {
              app.userName = userProfile.username;
              localStorage.setItem('USERNAME', app.userName);
            });

          } else {
            alert('not authenticated');
          }
        }).error(function () {
          alert('failed to initialize');
        });

        vm.$store.commit('saveKeyCloak', keycloak);
      }else{
        console.log('Signin - checking Token')
        this.$store.dispatch('checkToken')
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
