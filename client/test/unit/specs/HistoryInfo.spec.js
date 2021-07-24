import HistoryList from '@/components/application/Examine/Recipe/history/HistoryList'
import sinon from 'sinon'
import store from '@/store/index'
import Vue from 'vue'
import { cleanState } from '../../features/specs/support/clean.state'
import { createApiSandbox } from '../sandbox/CompNameSpec-api-stubs'
import { sleep } from '@/utils/sleep'

describe('HistoryList & HistoryInfo', () => {
  let data = {}
  const Constructor = Vue.extend(HistoryList)

  beforeEach(async () => {
    store.replaceState(cleanState())
    data.instance = new Constructor({ store })
    data.instance.$store.commit('loadHistoriesJSON', {
      "highlighting": "",
      "names": [
        {
          "jurisdiction": "BC",
          "name": "PROVIDENCE FUNERAL HOMES INC.",
          "name_state_type_cd": "A",
          "nr_num": "NR 0151876",
          "score": 11.737147,
          "start_date": "2008-09-30T19:44:45Z",
          "submit_count": 1
        },
        {
          "jurisdiction": "BC",
          "name": "PROVIDENCE FUNERAL HOMES INC.",
          "name_state_type_cd": "A",
          "nr_num": "NR 5865637",
          "score": 11.737147,
          "start_date": "2005-09-19T11:11:25Z",
          "submit_count": 1
        }
      ],
      "response": {
        "maxScore": 11.737147,
        "name": "providence funeral homes inc.",
        "numFound": 2,
        "rows": "50",
        "start": 0
      }
    })
    await sleep(1000)
  })

  it('builds a list of History items', () => {
    expect(data.instance.historiesJSON.length).toBe(2)
  })

  describe('mount the historyList with data', () => {
    beforeEach(async () => {
      data.vm = data.instance.$mount()
      await sleep(1000)
    })

    it('displays the history table', () => {
      let table = data.vm.$el.querySelector('#history-list-table')
      expect(table).toBeDefined()
      expect(table.textContent).toContain(`PROVIDENCE FUNERAL HOMES INC. BC NR 0151876 2008-09-30`)
      expect(table.textContent).toContain(`PROVIDENCE FUNERAL HOMES INC. BC NR 5865637 2005-09-19`)
    })

    describe('load the historyInfo Component', () => {
      beforeEach(async () => {
        data.sandbox = createApiSandbox()
        data.sandbox.getStub.withArgs('/api/v1/requests/NR 0151876', sinon.match.any).resolves({
          "additionalInfo": null,
          "applicants": "Some Lawyers",
          "client": "Some Clients",
          "comments": [],
          "consentFlag": null,
          "corpNum": null,
          "expirationDate": null,
          "furnished": "Y",
          "hasBeenReset": false,
          "id": 2138597,
          "lastUpdate": "Wed, 01 Oct 2008 09:44:45 GMT",
          "names": [ {
            "choice": 1,
            "comment": null,
            "conflict1": "",
            "conflict1_num": "",
            "conflict2": "",
            "conflict2_num": "",
            "conflict3": "",
            "conflict3_num": "",
            "consumptionDate": "Thu, 05 Jan 2006 22:45:42 GMT",
            "corpNum": "0745036",
            "decision_text": "",
            "name": "PROVIDENCE FUNERAL HOMES INC.",
            "state": "APPROVED"
          } ],
          "natureBusinessInfo": null,
          "nrNum": "NR 0151876",
          "nwpta": [],
          "previousNr": null,
          "previousRequestId": null,
          "previousStateCd": null,
          "priorityCd": "N",
          "priorityDate": null,
          "requestTypeCd": "CR",
          "state": "APPROVED",
          "submitCount": 1,
          "submittedDate": "Wed, 01 Oct 2008 09:44:45 GMT",
          "submitter_userid": "",
          "userId": "nro_service_account",
          "xproJurisdiction": null
        })
        let { id } = data.vm.historiesJSON[0]
        let tr = data.vm.$el.querySelector('#' + id)
        let clickEvent = new Event('click')
        tr.dispatchEvent(clickEvent)
        await sleep(1000)
      })

      afterEach(() => {
        data.sandbox.restore()
      })

      it('it loads historyInfo on clicking the table row', () => {
        let container = data.vm.$el.querySelector('#history-container')
        expect(container).toBeDefined()
      })
    })
  })
})
