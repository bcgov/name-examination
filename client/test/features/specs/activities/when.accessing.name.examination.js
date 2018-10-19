import Vue from 'vue';
import Vuelidate from 'vuelidate'
import Datatable from 'vue2-datatable-component'
Vue.use(Vuelidate)
Vue.use(require('vue-shortkey'))
Vue.use(Datatable)
import App from '@/App.vue';
import store from '@/store'
import router from '@/router'
import { cleanState } from '../support/clean.state'

let whenSomeoneAccessNameExamination = (when, data)=>{
    when(/^(.*) accesses Name examination$/, (userId) => {
        return new Promise((done) => {
            const Constructor = Vue.extend(App);
            store.replaceState(cleanState())
            data.instance = new Constructor({store:store, router:router});
            data.vm = data.instance.$mount(document.getElementById('app'));
            setTimeout(()=>{
                data.instance.$store.state.userId = userId
                sessionStorage.setItem('AUTHORIZED', true)
                router.push('/nameExamination')
                setTimeout(()=>{
                    done();
                }, 1000)
            }, 1000)
        });
    });
}

module.exports = {
    whenSomeoneAccessNameExamination:whenSomeoneAccessNameExamination
}
