import Vue from 'vue';
Vue.use(require('vue-shortkey'))
import router from '@/router'
import StdHeader from '@/components/application/sections/StdHeader';
import axios from '@/axios-auth.js';
import sinon from 'sinon';

describe('StdHeader.vue', () => {

    let instance;
    let vm;
    let messageSent;
    let valueSent;
    let store = {
        getters: {},
        dispatch: function(message, value) {
            messageSent = message;
            valueSent = value
        }
    }
    beforeEach(() => {
        const Constructor = Vue.extend(StdHeader);
        instance = new Constructor({store:store, router:router});
        vm = instance.$mount();
    })

    it('resists trailing spaces on NR', () => {
        vm.nrNum = 'NR 1234 '
        vm.onSubmit();

        expect(valueSent).toEqual('NR 1234');
    })

    it('adds missing prefix', () => {
        vm.nrNum = '1234'
        vm.onSubmit();

        expect(valueSent).toEqual('NR 1234');
    })

    it('detaches prefix', () => {
        vm.nrNum = 'NR1234'
        vm.onSubmit();

        expect(valueSent).toEqual('NR 1234');
    })
});
