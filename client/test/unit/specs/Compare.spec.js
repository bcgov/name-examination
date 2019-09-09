import RecipeArea from '@/components/application/Examine/Recipe/RecipeArea'
import store from '@/store'
import Vue from 'vue'
import Compare from '@/components/application/Examine/Recipe/compare/Compare'
import { cleanState } from '../../features/specs/support/clean.state'


describe('Compare.vue Template/Presentational Logic', () => {
  let Constructor = Vue.extend(Compare)
  let data = {}

  describe('Initializing', () => {

    beforeEach( done => {
      store.replaceState(cleanState())
      data.instance = new Constructor({ store })
      setTimeout(() => { done() }, 1000)
    })

    describe('When there are no items added to comparedConflicts', () => {
      beforeEach( done => {
        data.vm = data.instance.$mount()
        data.vm.$store.commit('setComparedConflicts', [])
        setTimeout(() => { done() }, 1000)
      })

      test('It loads the Compare component with "no items" message', () => {
        expect(data.vm.$el).not.toBeNull()
        expect(data.vm.$el.innerHTML).toContain(
          'No conflicts have been added for comparisson.'
        )
      })

      test('It does not load either the NamesMath or the CorpMatch Component', () => {
        expect(data.vm.$el.querySelector('[testid="corpmatch"]')).toBeNull()
        expect(data.vm.$el.querySelector('[testid="namesmatch"]')).toBeNull()
      })
    })

    describe('When there is a Corp Conflict in comparedConflicts', () => {
      beforeEach(done => {
        data.vm = data.instance.$mount()
        data.vm.$store.commit('setComparedConflicts', [])
        setTimeout(() => { done() }, 1000)
      })

      describe('Testing', () => {

        beforeEach(done => {
          data.vm.$store.commit('setComparedConflicts', [
            {
              "nrNumber": "A0077536",
              "jurisdiction": "FD-FEDERAL",
              "startDate": "2009-06-19T14:09:20Z",
              "text": "12 MEN OF XMAS PRODUCTIONS LTD.",
              "attorney names": "Not Available",
              "directors": "Not Available",
              "head office": [
                "425 Bloor Street",
                "12th Floor, Bayview Place",
                "Toronto",
                "ON - Ontario",
                "CA",
                "N2P 3L8"
              ],
              "incorp #": "A0077536",
              "incorporated": "2009-06-19",
              "nature of business": "Not Available",
              "type": "corp"
            }
          ])
          setTimeout(() => { done() }, 1000)
        })

        test('It loads the CorpMatch Component', () => {
          expect(data.vm.$el.innerHTML.includes('data-testid="corpmatch"')).toBeTruthy()        })

        test('And not the names component', () => {
          expect(data.vm.$el.innerHTML.includes('data-testid="namesmatch"')).toBeFalsy()
        })

        test('The "no items" message is not displayed', () => {
          expect(data.vm.$el.innerHTML).not.toContain(
            'No conflicts have been added for comparisson.'
          )
        })

        test('It formats and displays the incorporation date correctly', () => {
          let item = data.vm.formatDate('2019-10-26T00:00:00')
          expect(item).toEqual('2019-10-26')
        })

        test('It displays the Province correctly', () => {
          let item1 = data.vm.formatJurisdiction('ON - Ontario')
          let item2 = data.vm.formatJurisdiction('ON-Ontario')
          expect(item1).toEqual('ON')
          expect(item2).toEqual('ON')
        })
      })


    })
  })
})
