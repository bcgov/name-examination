import { beforeEach, describe, it, expect, vitest, vi } from 'vitest'
import SearchBox from '../components/SearchBox.vue'
import flushPromises from 'flush-promises'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { searchFiltersStore } from '../store/searchfilters'
/* eslint-disable require-jsdoc */

describe('Search Page', () => {
  let wrapper: any = null
  let filters: any = null
  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vitest.fn
    })
    wrapper = mount(SearchBox, {
      global: {
        plugins: [pinia]
      }
    })
    filters = searchFiltersStore(pinia)
    // Mock rows
    filters.rows = [{
      Status: 'APPROVED',
      LastModifiedBy: 'user112',
      NameRequestNumber: 'NR112345',
      Names: 'Green Farm Organics',
      ApplicantFirstName: 'Olivia',
      ApplicantLastName: 'Harris',
      NatureOfBusiness: 'Organic Farming',
      ConsentRequired: 'No',
      Priority: 'Standard',
      ClientNotification: 'Notified',
      Submitted: 'Custom',
      LastUpdate: '7 days',
      LastComment: 'Approved for Next Phase'
    },
    {
      Status: 'REJECTED',
      LastModifiedBy: 'user223',
      NameRequestNumber: 'NR223456',
      Names: 'Robotics Exploration',
      ApplicantFirstName: 'Ethan',
      ApplicantLastName: 'Clark',
      NatureOfBusiness: 'Robotics Research',
      ConsentRequired: 'Yes',
      Priority: 'Priority',
      ClientNotification: 'Not Notified',
      Submitted: '3 years',
      LastUpdate: 'Today',
      LastComment: 'Rejected - See Comments'
    },
    {
      Status: 'HOLD',
      LastModifiedBy: 'user334',
      NameRequestNumber: 'NR334567',
      Names: 'Gaming World Hub',
      ApplicantFirstName: 'Mia',
      ApplicantLastName: 'Lewis',
      NatureOfBusiness: 'Video Games Retail',
      ConsentRequired: 'Received',
      Priority: 'Priority',
      ClientNotification: 'Not Notified',
      Submitted: 'Today',
      LastUpdate: 'Yesterday',
      LastComment: 'Please Wait for Review'
    },
    {
      Status: 'INPROGRESS',
      LastModifiedBy: 'user445',
      NameRequestNumber: 'NR445678',
      Names: 'Zen Meditation Center',
      ApplicantFirstName: 'Alexander',
      ApplicantLastName: 'White',
      NatureOfBusiness: 'Wellness Center',
      ConsentRequired: 'No',
      Priority: 'Standard',
      ClientNotification: 'Notified',
      Submitted: '7 days',
      LastUpdate: '2 days',
      LastComment: 'In Review - No Updates'
    },
    {
      Status: 'CONDITIONAL',
      LastModifiedBy: 'user556',
      NameRequestNumber: 'NR556789',
      Names: 'Healthy Life Foods',
      ApplicantFirstName: 'Nathan',
      ApplicantLastName: 'Hall',
      NatureOfBusiness: 'Health Food Store',
      ConsentRequired: 'Yes',
      Priority: 'Standard',
      ClientNotification: 'Not Notified',
      Submitted: '30 days',
      LastUpdate: '2 days',
      LastComment: 'Waiting for Confirmation'
    },
    {
      Status: 'DRAFT',
      LastModifiedBy: 'user667',
      NameRequestNumber: 'NR667890',
      Names: 'Tech Pioneers Hub',
      ApplicantFirstName: 'Sara',
      ApplicantLastName: 'Carter',
      NatureOfBusiness: 'Technology Research',
      ConsentRequired: 'Received',
      Priority: 'Priority',
      ClientNotification: 'Notified',
      Submitted: '90 days',
      LastUpdate: 'Today',
      LastComment: 'Draft - Need More Information'
    },
    {
      Status: 'CANCELLED',
      LastModifiedBy: 'user778',
      NameRequestNumber: 'NR778901',
      Names: 'Ocean Adventure Travel',
      ApplicantFirstName: 'William',
      ApplicantLastName: 'Adams',
      NatureOfBusiness: 'Travel Agency',
      ConsentRequired: 'All',
      Priority: 'Standard',
      ClientNotification: 'All',
      Submitted: '5 years',
      LastUpdate: '7 days',
      LastComment: 'Cancelled by Client'
    },
    {
      Status: 'CONSUMED',
      LastModifiedBy: 'user889',
      NameRequestNumber: 'NR889012',
      Names: 'Mountain Gear Co.',
      ApplicantFirstName: 'Karen',
      ApplicantLastName: 'Lee',
      NatureOfBusiness: 'Outdoor Equipment',
      ConsentRequired: 'No',
      Priority: 'Priority',
      ClientNotification: 'Notified',
      Submitted: '1 year',
      LastUpdate: '7 days',
      LastComment: 'Product Consumed'
    },
    {
      Status: 'EXPIRED',
      LastModifiedBy: 'user990',
      NameRequestNumber: 'NR990123',
      Names: 'Urban Design Studio',
      ApplicantFirstName: 'Sophia',
      ApplicantLastName: 'Davis',
      NatureOfBusiness: 'Architecture',
      ConsentRequired: 'All',
      Priority: 'Priority',
      ClientNotification: 'All',
      Submitted: 'Custom',
      LastUpdate: '2 days',
      LastComment: 'Offer Expired'
    },
    {
      Status: 'COMPLETED',
      LastModifiedBy: 'user101',
      NameRequestNumber: 'NR101234',
      Names: 'Creative Minds Agency',
      ApplicantFirstName: 'Matthew',
      ApplicantLastName: 'Moore',
      NatureOfBusiness: 'Advertising',
      ConsentRequired: 'Received',
      Priority: 'All',
      ClientNotification: 'Notified',
      Submitted: '3 years',
      LastUpdate: 'Yesterday',
      LastComment: 'Task Completed'
    }
    ]
    // 10 rows have been mocked
    filters.resultNum = 10
    global.fetch = vi.fn()
  })

  it('the selected columns are shown/hidden correctly', async () => {
    filters.selectedColumns = ['NameRequestNumber', 'Names', 'ApplicantFirstName',
      'ApplicantLastName', 'NatureOfBusiness', 'ConsentRequired', 'Priority', 'ClientNotification', 'Submitted',
      'LastUpdate'] // Hidden 3 columns (Status, Last Comment, Modified By)

    await flushPromises()// wait for updates

    // Find the 'th' element
    const tableHeader = wrapper.find('th')

    // Check if its text content matches the targets
    const header = tableHeader.text() === 'Status' || tableHeader.text() === 'Last Comment' ||
    tableHeader.text() === 'Modified By'

    // These three columns should not be rendered on the table
    expect(header).toBe(false)
  })

  it('shows loading spinner when isLoading is true', async () => {
    filters.isLoading = true
    await flushPromises()// wait for updates
    expect(wrapper.find('.border-t-transparent').exists()).toBe(true)
  })

  it('correct number of rows displayed in the table', async () => {
  // Assertion to check that there are 10 rows rendered in the table body
    expect(wrapper.findAll('tbody > tr').length).toBe(10)
  })
})
