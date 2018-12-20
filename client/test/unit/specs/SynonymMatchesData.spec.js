/*eslint-disable*/
import store from '@/store'

describe('store > setSynonymMatchesConflicts', () => {

    it('resists empty data', ()=>{
        store.commit('setSynonymMatchesConflicts', { names:[] })

		expect(store.state.synonymMatchesConflicts).toEqual([])
    })

	describe('class marker', ()=>{

		var data
		beforeEach(()=>{
			store.commit('setSynonymMatchesConflicts', { names:[
				{ name:'first title' },
				{ name:'first match', source:'CORP' },
				{ name:'second title' },
				{ name:'second match #1', source:'CORP' },
				{ name:'second match #2', source:'CORP' },
			] })
			data = store.state.synonymMatchesConflicts
		})

		it('identifies titles and collape the last one', ()=>{
			expect(data[0].class).toEqual('conflict-synonym-title collapsible expanded')
			expect(data[2].class).toEqual('conflict-synonym-title collapsible collapsed')
		})
		it('identifies matches and hides the last set', ()=>{
			expect(data[1].class).toEqual('conflict-result conflict-result-displayed')
			expect(data[3].class).toEqual('conflict-result conflict-result-hidden')
			expect(data[4].class).toEqual('conflict-result conflict-result-hidden')
		})
		it('includes count', ()=>{
			expect(data[2].count).toEqual(2)
			expect(data[0].count).toEqual(1)
		})

		describe('no match', ()=>{

			var data
			beforeEach(()=>{
				store.commit('setSynonymMatchesConflicts', { names:[
					{ name:'first title' },
					{ name:'second title' }
				] })
				data = store.state.synonymMatchesConflicts
			})

			it('makes the title no collapsible', ()=>{
				expect(data[0].class).toEqual('conflict-synonym-title')
			})
			it('forces count to 0', ()=>{
				expect(data[0].count).toEqual(0)
			})
			it('lives alone', ()=>{
				expect(data.length).toEqual(2)
			})
		})
	})
})
