/* eslint-disable */
import Vue from 'vue'
import ConditionInfo from '@/components/application/Examine/Recipe/conditions/ConditionsInfo'
import store from '@/store'

Vue.use(require('vue-shortkey'))


describe('ConditionInfo.vue', () => {
  let instance
  let vm

  beforeEach(() => {
    const Constructor = Vue.extend(ConditionInfo)
    instance = new Constructor({ store })
    instance.$store.state.myKeycloak = {}

    instance.$store.state.conditionsJSON = {
      restricted_words_conditions: [ {
        cnd_info: [ {
          allow_use: 'Y',
          consent_required: '',
          consenting_body: 'The Accredited Bc College Authorizing Its Use. Fax Your Consent To 250-356-8923 ' +
            'For incorporation Or 250 356-0206 For Partnerships/Proprietorships',
          id: 109,
          instructions: 'Use Of This Term Requires Written Consent From The Accredited BC College ' +
            'Authorizing Its Use. Please Scan Your Consent To bcregistries@gov.bc.ca ',
          text: 'You may be able to use this term if it is not related to medical services or health care. ' +
            'Ie: Staging Doctor Solutions Corp.',
        } ], word_info: {
          id: 230, phrase: 'DR',
        },
      } ],
    }
    vm = instance.$mount()
  })

  it('gets the same JSON info that is in the state', () => {
    expect(vm.$store.getters.parseConditions).toEqual([ {
      allow_use: 'Y',
      allow_use_tf: true,
      consent_required: '',
      consent_required_tf: '',
      consenting_body: 'The Accredited Bc College Authorizing Its Use. Fax Your Consent To 250-356-8923 ' +
        'For incorporation Or 250 356-0206 For Partnerships/Proprietorships',
      id: 109,
      instructions: 'Use Of This Term Requires Written Consent From The Accredited BC College ' +
        'Authorizing Its Use. Please Scan Your Consent To bcregistries@gov.bc.ca ',
      phrase: 'DR',
      text: 'You may be able to use this term if it is not related to medical services or health care. ' +
        'Ie: Staging Doctor Solutions Corp.',

    } ])
  })

  it('is properly loading the conditions info into \'data\' for the table', () => {
    expect(vm.tableData.length).toEqual(1)
    expect(vm.tableData[0].phrase).toEqual('DR')
    expect(vm.tableData[0].allow_use).toEqual('Y')
    expect(vm.tableData[0].consent_required).toEqual('')
    expect(vm.tableData[0].text).toEqual('You may be able to use this term if it is not related to medical services ' +
      'or health care. Ie: Staging Doctor Solutions Corp.')
    expect(vm.tableData[0].instructions).toEqual(
      'Use Of This Term Requires Written Consent From The Accredited BC College ' +
      'Authorizing Its Use. Please Scan Your Consent To bcregistries@gov.bc.ca ')
  })

  it('displays all required headers in the table', () => {
    expect(vm.$el.querySelector('tr th:first-child').textContent.trim()).toEqual('Word')
    expect(vm.$el.querySelector('tr th:nth-child(2)').textContent.trim()).toEqual('Allow')
    expect(vm.$el.querySelector('tr th:nth-child(3)').textContent.trim()).toEqual('Consent')
    expect(vm.$el.querySelector('tr th:nth-child(4)').textContent.trim()).toEqual('Examiner Information')
    expect(vm.$el.querySelector('tr th:nth-child(5)').textContent.trim()).toEqual('Instructions')
  })

  it('has word/condition info displayed in the table', () => {
    expect(vm.$el.querySelector('tr td').innerHTML).toEqual('DR')
    expect(vm.$el.querySelector('tr td:nth-of-type(2)').innerHTML).toEqual('Y')
    expect(vm.$el.querySelector('tr td:nth-of-type(3)').innerHTML).toEqual('')
    expect(vm.$el.querySelector('tr td:nth-of-type(4)').innerHTML).toEqual('You may be able to use this term ' +
      'if it is not related to medical services or health care. Ie: Staging Doctor Solutions Corp.')
    expect(vm.$el.querySelector('tr td:nth-of-type(5)').textContent.trim()).toEqual('Use Of This Term Requires ' +
      'Written Consent From The Accredited BC College Authorizing Its Use. Please Scan Your Consent To ' +
      'bcregistries@gov.bc.ca')
  })

  it('sets currentCondition successfully in the state after a condition is clicked', () => {
    var click = new window.Event('click')
    let button = vm.$el.querySelector('tr td:first-child')
    button.dispatchEvent(click)
    setTimeout(() => {
      expect(vm.$store.state.currentCondition).toEqual({
        word: 'DR',
        allow_use: 'Y',
        consent_required: '',
        text: 'You may be able to use this term if it is not related to medical services or health care. ' +
          'Ie: Staging Doctor Solutions Corp.',
        instructions: 'Use Of This Term Requires Written Consent From The Accredited BC College ' +
          'Authorizing Its Use. Please Scan Your Consent To bcregistries@gov.bc.ca',
      })
      expect(vm.currentCondition).toEqual({
        word: 'DR',
        allow_use: 'Y',
        consent_required: '',
        text: 'You may be able to use this term if it is not related to medical services or health care. ' +
          'Ie: Staging Doctor Solutions Corp.',
        instructions: 'Use Of This Term Requires Written Consent From The Accredited BC College ' +
          'Authorizing Its Use. Please Scan Your Consent To bcregistries@gov.bc.ca',
      })
      done()
    }, 300)
  })


})
