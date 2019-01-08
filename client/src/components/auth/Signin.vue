/* eslint-disable*/
<template>
  <div></div>
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
      var authorized = sessionStorage.getItem("AUTHORIZED");
      var keycloak

      if (!authorized) {
        //keycloak = Keycloak('static/keycloak/sbcKey.json');
        keycloak = Keycloak('static/keycloak/keycloak.json');
        this.$store.commit('saveKeyCloak', keycloak);

        var token
        const vm = this

        keycloak.init({token: token, onLoad: 'login-required'}).success(function (authenticated) {
          if (authenticated) {
            console.log('Keycloak Authenticated')

            sessionStorage.setItem('KEYCLOAK_TOKEN', keycloak.token);
            sessionStorage.setItem('KEYCLOAK_REFRESH', keycloak.refreshToken);
            sessionStorage.setItem('KEYCLOAK_EXPIRES', keycloak.tokenParsed.exp * 1000);
            sessionStorage.setItem('USER_ROLES',keycloak.tokenParsed.user_roles)
            if(keycloak.tokenParsed.user_roles == undefined){
              sessionStorage.setItem("AUTHORIZED", false);
            }else {
              sessionStorage.setItem("AUTHORIZED", true);
            }
            //TODO-erase this once rolls creaated
            sessionStorage.setItem("AUTHORIZED", true);

            // Get user profile
            keycloak.loadUserProfile().success(function (userProfile) {
              app.userName = userProfile.username;
              sessionStorage.setItem('USERNAME', app.userName);

              console.log('set logion values in store')
              vm.$store.commit('setLoginValues')

            });

            // everthing is good, re-direct to home page
            vm.$router.push("/home")

          } else {
            alert('not authenticated');
          }
        }).error(function () {
          alert('failed to initialize');
        });

      }else{
        console.log('Signin - checking Token')
        this.$store.dispatch('checkToken')

      }
    }
  }
  </script>
