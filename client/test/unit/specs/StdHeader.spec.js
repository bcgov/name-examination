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
                userId: 'max'
            }
        }
        vm = mount();
        let value = vm.$el.querySelector('p.navbar-text').innerHTML;

        expect(value).toEqual('&nbsp;max')
    })

    describe('Navigation menu', ()=>{

        beforeEach(() => {
            store = {
                getters: {}
            }
            vm = mount();
        })

        it('offers a link to /home', (done)=>{
            click('#header-home-link');

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
        it('offers a link to sign-in', (done)=>{
            click('#header-login-button');

            setTimeout(()=>{
                expect(window.location.pathname).toEqual('/signin')
                done();
            }, 300)
        })
        it('offers a link to sign out when authenticated', ()=>{
            store = {
                getters: {
                    isAuthenticated: true
                }
            }
            vm = mount();

            expect(vm.$el.querySelector('#header-login-button').innerHTML.trim()).toEqual("Logout");
        })
    })

    describe('onSubmit', ()=>{

        let submit = ()=>{
            click('#header-search-button');
        }
        beforeEach(() => {
            store = {
                getters: {},
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
            click('#header-login-button');
        }
        let assigned;
        let oldHandler;
        beforeEach(()=>{
            store = {
                getters: {
                    isAuthenticated: true
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

            expect(vm.$el.querySelector('#header-login-button').innerHTML.trim()).toEqual("Login");
        })
    })
})
