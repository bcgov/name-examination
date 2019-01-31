/* eslint-disable */
import Vue from 'vue';
import router from '@/router'
import StdHeader from '@/components/application/sections/StdHeader';
describe('StdHeader.vue', () => {

    let instance;
    let vm;
    let messageSentToStore;
    let valueSent;
    let store;
    let mount = ()=>{
        sessionStorage.setItem('AUTHORIZED', true)
        const Constructor = Vue.extend(StdHeader);
        instance = new Constructor({store:store, router:router});
        let app = document.createElement('DIV')
        app.id = "app"
        document.body.innerHTML = '';
        document.body.appendChild(app);
        return instance.$mount(document.getElementById('app'));
    }
    let click = function(id) {
        let button = vm.$el.querySelector(id);
        let window = button.ownerDocument.defaultView;
        var click = new window.Event('click');
        button.dispatchEvent(click);
    }

    it('displays user id', ()=>{
        store = {
            getters: {
                isAuthenticated: true,
                userHasEditRole: true,
                userHasApproverRole: true,
                userId: 'max'
            }
        }
        vm = mount();
        let value = vm.$el.querySelector('#userid').innerHTML;

        expect(value).toEqual('max')
    })

    describe('Navigation menu when logged in', ()=>{

        beforeEach(() => {
            store = {
                getters: {
                    isAuthenticated: true,
                    userHasApproverRole: true,
                    userHasEditRole: true
                },
            }
            vm = mount();
        })

        it('offers a link to /home from logo', (done)=>{
            click('.navbar-brand');

            setTimeout(()=>{
                expect(window.location.pathname).toEqual('/home')
                done();
            }, 300)
        })
        it('offers a link to /nameExamination', (done)=>{
            click('#nameExamine');

            setTimeout(()=>{
                expect(window.location.pathname).toEqual('/nameExamination')
                done();
            }, 300)
        })
        it('offers a link to /find', (done)=>{
            click('#header-search-link');

            setTimeout(()=>{
                expect(window.location.pathname).toEqual('/find')
                done();
            }, 300)
        })
        it('offers a link to sign out', ()=>{
            expect(vm.$el.querySelector('#header-logout-button')).not.toEqual(null);
        })
        it('does not offer a link to sign in', ()=>{
            expect(vm.$el.querySelector('#header-login-button')).toEqual(null);
        })
    })

    describe('Navigation menu when logged in as editor or viewer', ()=> {

      it('does not offer a link to /nameExamination for editors', ()=>{
        store = {
          getters: {
            isAuthenticated: true,
            userHasApproverRole: false,
            userHasEditRole: true
          },
        }
        vm = mount();
      console.log(vm.$el.querySelector('#nameExamine'))
          expect(vm.$el.querySelector('#nameExamine')).toEqual(null);
      })
      it('does not offer a link to /nameExamination for viewers', ()=>{
        store = {
          getters: {
            isAuthenticated: true,
            userHasApproverRole: false,
            userHasEditRole: false
          },
        }
        vm = mount();
        console.log(vm.$el.querySelector('#nameExamine'))
          expect(vm.$el.querySelector('#nameExamine')).toEqual(null);
      })
    })

    describe('Navigation menu when not logged in', ()=>{

        beforeEach(() => {
            store = {
                getters: {}
            }
            vm = mount();
        })

        it('does not offer a link to /nameExamination', ()=>{
            expect(vm.$el.querySelector('#nameExamine')).toEqual(null);
        })
        it('does not offer a link to /find', ()=>{
            expect(vm.$el.querySelector('#header-search-link')).toEqual(null);
        })
        it('does not offer a link to sign out', ()=>{
            expect(vm.$el.querySelector('#header-logout-button')).toEqual(null);
        })
        it('offers a link to sign-in', (done)=>{
            click('#header-login-button');

            setTimeout(()=>{
                expect(window.location.pathname).toEqual('/signin')
                done();
            }, 300)
        })
    })

    describe('onSubmit', ()=>{

        let submit = ()=>{
            click('#header-search-button');
        }
        beforeEach(() => {
            store = {
                getters: {
                  isAuthenticated: true,
                  userHasApproverRole: true,
                  userHasEditRole: true
                },
                dispatch: function(message, value) {
                    messageSentToStore = message;
                    valueSent = value
                }
            }
            messageSentToStore = '';
            valueSent = '';
            vm = mount();
        })

        it('resists trailing spaces on NR', () => {
            vm.nrNum = 'NR 1234 '
            submit()

            expect(messageSentToStore).toEqual('newNrNumber');
            expect(valueSent).toEqual('NR 1234');
        })
        it('adds missing prefix', () => {
            vm.nrNum = '1234'
            submit()

            expect(messageSentToStore).toEqual('newNrNumber');
            expect(valueSent).toEqual('NR 1234');
        })
        it('detaches prefix', () => {
            vm.nrNum = 'NR1234'
            submit()

            expect(messageSentToStore).toEqual('newNrNumber');
            expect(valueSent).toEqual('NR 1234');
        })
        it('does nothing when value is empty', ()=>{
            vm.nrNum = ''
            submit()

            expect(messageSentToStore).toEqual('');
            expect(valueSent).toEqual('');
        })
        it.skip('does nothing when value is kind-of empty', ()=>{
            vm.nrNum = '   '
            submit()

            expect(messageSentToStore).toEqual('');
            expect(valueSent).toEqual('');
        })
    })
    describe('logout', ()=>{

        let logout = ()=>{
            click('#header-logout-button');
        }
        let assigned;
        let oldHandler;
        beforeEach(()=>{
            store = {
                getters: {
                    isAuthenticated: true,
                    userHasApproverRole: true,
                    userHasEditRole: true
                },
                dispatch: function(message, value) {
                    messageSentToStore = message;
                    valueSent = value
                }
            }
            messageSentToStore = '';
            valueSent = '';
            vm = mount();
            oldHandler = window.location.assign;
            window.location.assign = function(value) { assigned=value; }
            logout();
        })
        afterEach(()=>{
            window.location.assign = oldHandler;
        })
        it('is delegated to the store', ()=>{
            expect(messageSentToStore).toEqual('logout');
        })
        it('resets location', ()=>{
            expect(assigned).toEqual('/');
        })
        it('offers a login link when not authenticated', ()=>{
            store = {
                getters: {
                    isAuthenticated: false
                },
                dispatch: function(message, value) {
                    messageSentToStore = message;
                    valueSent = value
                }
            }
            vm = mount();

            expect(vm.$el.querySelector('#header-login-button')).not.toEqual(null);
        })
    })
})
