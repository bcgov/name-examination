/* eslint-disable */
import Vue from 'vue';
import store from '@/store'
import ConflictList from '@/components/application/examine/recipe/conflicts/ConflictList';

describe('ConflictList.vue phonetic matches expand/collapse', () => {

  let vm
	let data

	beforeEach(()=>{
		const Constructor = Vue.extend(ConflictList);
		vm = new Constructor({store:store}).$mount();
		store.commit('setPhoneticConflicts', { names:[
			{ name:'first title' },
			{ name:'first match', source:'CORP' },
			{ name:'second title' },
			{ name:'second match #1', source:'CORP' },
			{ name:'second match #2', source:'CORP' },
			{ name:'third title' },
			{ name:'third match #1', source:'CORP' },
			{ name:'third match #2', source:'CORP' },
		] })
		data = vm.$store.getters.phoneticConflicts
	})

    it('is available', ()=>{

      expect(data[2].class).toEqual('conflict-phonetic-title collapsible collapsed')
      expect(data[3].class).toEqual('conflict-result conflict-result-hidden')
      expect(data[4].class).toEqual('conflict-result conflict-result-hidden')
    })
    it('toggles as expected', ()=>{
      vm.expand_collapse({ text: 'second title'},'phonetic')

      expect(data[2].class).toEqual('conflict-phonetic-title collapsible expanded')
      expect(data[3].class).toEqual('conflict-result conflict-result-displayed')
      expect(data[4].class).toEqual('conflict-result conflict-result-displayed')
    })
})
