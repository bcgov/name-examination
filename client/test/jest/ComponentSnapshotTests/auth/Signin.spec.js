/* eslint-disable */
import { shallowMount } from '@vue/test-utils';
import Signin from '@/components/auth/Signin';
import store from '@/store'
import router from '@/router'

describe('Signin.vue', () => {

  //window.Keycloak mocks the basic functions of Keycloak
  window.Keycloak = function() {
    return {
      token: 'testing123',
      refreshToken: 'testing456',
      tokenParsed: {
        exp: 1000,
      },
      loadUserProfile () {
        return {
          success (fn) {
            fn({ username: 'Joe' })
          }
        }
      },
      realmAccess: {
        roles: [
          'names_approver', 'names_editor', 'names_viewer'
        ]
      },
      init() {
        return {
          success(auth) {
            auth(true)
            return {
              error() {
                return null
              }
            }
          }
        }
      }
    }
  }

    let component;
    beforeEach(() => {
          Object.defineProperty(router, 'push', {
            value: function(path) { }
          })
        component = shallowMount(Signin, {store: store, router: router});
    });

   it("renders a Signin component", () => {
     expect(component.element).toMatchSnapshot();
   })

  // Add other tests specific to this component and not its sub-components
});
