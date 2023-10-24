import { DateTime } from 'luxon'
import { createPinia } from 'pinia'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { useStatusStore } from '~/store/status'
import { getFormattedDateFromDateTime } from '~/util/date'

describe('Status store tests', () => {
  let status = useStatusStore()

  beforeEach(() => {
    status = useStatusStore(createPinia())
  })

  it('computes the correct date string', () => {
    expect(status.todayStr).toBe(getFormattedDateFromDateTime(DateTime.now()))
  })

  it('updates the status data properly with a mock api response', async () => {
    const expectedHold = 20
    const expectedNotExamined = 100
    global.fetch = vi.fn().mockImplementation((url: URL, _) => {
      const expectedNumFound =
        url.searchParams.get('queue')?.toLowerCase() === 'hold'
          ? expectedHold
          : expectedNotExamined
      let response = {
        response: {
          numFound: expectedNumFound,
        },
      }
      return { json: () => new Promise((resolve) => resolve(response)) }
    })

    await status.update()
    expect(status.holdNum).toBe(expectedHold)
    expect(status.notExaminedNum).toBe(expectedNotExamined)
  })
})
