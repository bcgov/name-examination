/* eslint-disable */
import Vue from 'vue';
import store from '@/store'
import ConflictList from '@/components/application/examine/recipe/conflicts/ConflictList';

describe('ConflictList.vue synonym matches expand/collapse', () => {

    let vm
	let data

	beforeEach(()=>{
		const Constructor = Vue.extend(ConflictList);
		vm = new Constructor({store:store}).$mount();
		store.commit('setSynonymMatchesConflicts', { names:[
			{ name:'first title - meta1' },
			{ name:'first match', source:'CORP' },
			{ name:'second title - meta2' },
			{ name:'second match #1', source:'CORP' },
			{ name:'second match #2', source:'CORP' },
			{ name:'third title - meta3' },
			{ name:'third match #1', source:'CORP' },
			{ name:'third match #2', source:'CORP' },
		] })
		data = vm.$store.getters.synonymMatchesConflicts
	})

    it('is available', ()=>{
      vm.expand_collapse({ text: 'second title'}, 'synonym')

      expect(data[2].class).toEqual('conflict-synonym-title collapsible expanded')
      expect(data[3].class).toEqual('conflict-result conflict-result-displayed')
      expect(data[4].class).toEqual('conflict-result conflict-result-displayed')
    })
    it('toggles as expected', ()=>{
		vm.expand_collapse({ text: 'second title'}, 'synonym')
		vm.expand_collapse({ text: 'second title'}, 'synonym')

		expect(data[2].class).toEqual('conflict-synonym-title collapsible collapsed')
		expect(data[3].class).toEqual('conflict-result conflict-result-hidden')
		expect(data[4].class).toEqual('conflict-result conflict-result-hidden')
    })
})
