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
            console.log('Keycloak Authenticated')

            sessionStorage.setItem('KEYCLOAK_TOKEN', keycloak.token);
            sessionStorage.setItem('KEYCLOAK_REFRESH', keycloak.refreshToken);
            sessionStorage.setItem('KEYCLOAK_EXPIRES', keycloak.tokenParsed.exp * 1000);
            // **** DO NOT COMMIT THIS: **** ////
            let roles =  keycloak.realmAccess.roles.filter(role => ALLOWED_ROLES.includes(role));
            sessionStorage.setItem('USER_ROLES', roles);

            if(!roles || roles.length === 0) {
              console.log('********** DANGER, WILL ROBINSON, DANGER! logging out... because user has a token but no ROLE!')
              sessionStorage.setItem("AUTHORIZED", false);
            } else {
              console.log('Authorized role(s) for user!');
              sessionStorage.setItem("AUTHORIZED", true);

            // Get user profile
              keycloak.loadUserProfile().success(function (userProfile) {
                app.userName = userProfile.username;
                sessionStorage.setItem('USERNAME', app.userName);

                console.log('set login values');
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
        console.log('Signin - checking Token')
        this.$store.dispatch('checkToken')

      }
    }
  }
  </script>
