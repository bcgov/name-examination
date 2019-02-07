/*eslint-disable*/
import store from '@/store'

describe('store > setCobrsPhoneticConflicts', () => {

    it('resists empty data', ()=>{
        store.commit('setCobrsPhoneticConflicts', { names:[] })

		expect(store.state.cobrsPhoneticConflicts).toEqual([])
    })

	describe('class marker', ()=>{

		var data
		beforeEach(()=>{
			store.commit('setCobrsPhoneticConflicts', { names:[
				{name_info:{ name:'first title' },stems:[]},
        {name_info:{ name:'first match', source:'CORP' },stems:[]},
				{name_info:{ name:'second title'},stems:[]},
				{name_info:{ name:'second match', source:'CORP' },stems:[]},
				{name_info:{ name:'second match #2', source:'CORP' },stems:[]},
				{name_info:{ name:'third title'},stems:[]},
				{name_info:{ name:'third match', source:'CORP' },stems:[]},
				{name_info:{ name:'third match #2', source:'CORP' },stems:[]},
			] })
			data = store.state.cobrsPhoneticConflicts
		})

		it('identifies titles and collape the two last', ()=>{
			expect(data[0].class).toEqual('conflict-cobrs-phonetic-title collapsible expanded')
			expect(data[2].class).toEqual('conflict-cobrs-phonetic-title collapsible collapsed')
			expect(data[5].class).toEqual('conflict-cobrs-phonetic-title collapsible collapsed')
		})
		it('identifies matches and hides the last two sets', ()=>{
			expect(data[1].class).toEqual('conflict-result conflict-result-displayed')
			expect(data[3].class).toEqual('conflict-result conflict-result-hidden')
			expect(data[4].class).toEqual('conflict-result conflict-result-hidden')
			expect(data[6].class).toEqual('conflict-result conflict-result-hidden')
			expect(data[7].class).toEqual('conflict-result conflict-result-hidden')
		})
		it('includes count', ()=>{
			expect(data[2].count).toEqual(2)
			expect(data[0].count).toEqual(1)
		})

		describe('no match', ()=>{

			var data
			beforeEach(()=>{
				store.commit('setCobrsPhoneticConflicts', { names:[
					{name_info:{ name:'first title' },stems:[]},
					{name_info:{ name:'second title'},stems:[]}
				] })
				data = store.state.cobrsPhoneticConflicts
			})

			it('makes the title no collapsible', ()=>{
				expect(data[0].class).toEqual('conflict-cobrs-phonetic-title')
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
