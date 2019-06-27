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
      let authorized = sessionStorage.getItem("AUTHORIZED");
      let keycloak;
      const EXAMINER = 'names_approver';
      const STAFF = 'names_editor';
      const VIEWER = 'names_viewer';
      const ALLOWED_ROLES = [EXAMINER, STAFF, VIEWER]

      if (!authorized) {
        //keycloak = Keycloak('static/keycloak/sbcKey.json');
        keycloak = Keycloak('static/keycloak/keycloak.json');
        this.$store.commit('saveKeyCloak', keycloak);

        var token
        const vm = this

        keycloak.init({token: token, onLoad: 'login-required'}).success(function (authenticated) {
          if (authenticated) {


            sessionStorage.setItem('KEYCLOAK_TOKEN', keycloak.token);
            sessionStorage.setItem('KEYCLOAK_REFRESH', keycloak.refreshToken);
            sessionStorage.setItem('KEYCLOAK_EXPIRES', keycloak.tokenParsed.exp * 1000);

            let roles = keycloak.realmAccess.roles.filter(role => ALLOWED_ROLES.includes(role));
            sessionStorage.setItem('USER_ROLES', roles);

            if(!roles || roles.length === 0) {
              sessionStorage.setItem("AUTHORIZED", false);
            } else {
              sessionStorage.setItem("AUTHORIZED", true);

            // Get user profile
              keycloak.loadUserProfile().success(function (userProfile) {
                app.userName = userProfile.username;
                sessionStorage.setItem('USERNAME', app.userName);

                ;
                vm.$store.commit('setLoginValues')

              });

              // everthing is good, re-direct to home page
              vm.$router.push("/home")
            }

          } else {
            alert('not authenticated');
          }
        }).error(function () {
          alert('failed to initialize');
        });

      }else{
        this.$store.dispatch('checkToken')

      }
    }
  }
  </script>
