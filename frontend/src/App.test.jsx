import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { AppProvider } from './context/AppContext'
import { seedCampaigns, seedUsers } from './data/seed'

function renderApp(path = '/') {
  window.history.pushState({}, '', path)
  return render(<AppProvider><App /></AppProvider>)
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
})

describe('FundFlow demo application', () => {
  it('protects the dashboard and redirects visitors to login', async () => {
    renderApp('/dashboard')

    expect(await screen.findByRole('heading', { name: 'Good to see you again.' })).toBeTruthy()
    expect(window.location.pathname).toBe('/login')
  })

  it('registers a demo user and creates a validated campaign', async () => {
    renderApp('/register')

    fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Sam Rivera' } })
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'sam@example.com' } })
    fireEvent.change(screen.getByLabelText('Create a password'), { target: { value: 'demo-password' } })
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'demo-password' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create my account' }))

    expect(await screen.findByRole('heading', { name: /hello, sam/i })).toBeTruthy()
    const createCampaignLink = screen.getAllByRole('link', { name: 'Start a campaign' })
      .find((link) => link.getAttribute('href') === '/dashboard/create')
    fireEvent.click(createCampaignLink)
    expect(await screen.findByRole('heading', { name: 'Start a campaign' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /submit for review/i }))
    expect(await screen.findByText(/clear title \(at least 8 characters\)/i)).toBeTruthy()
    fireEvent.change(screen.getByRole('textbox', { name: /Campaign title/ }), { target: { value: 'A reading room for our neighbors' } })
    fireEvent.change(screen.getByRole('textbox', { name: /Community or location/ }), { target: { value: 'Pune, India' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: /Fundraising goal/ }), { target: { value: '45000' } })
    fireEvent.change(screen.getByLabelText(/Campaign end date/), { target: { value: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10) } })
    fireEvent.change(screen.getByRole('textbox', { name: /Campaign summary/ }), { target: { value: 'We are creating a friendly after-school reading room for children in our neighborhood.' } })
    fireEvent.change(screen.getByRole('textbox', { name: /Why does this matter/ }), { target: { value: 'A calm place to read gives every child more room to learn, explore, and imagine a brighter future.' } })
    fireEvent.click(screen.getByRole('button', { name: /submit for review/i }))

    expect(await screen.findByRole('heading', { name: 'My campaigns' })).toBeTruthy()
    expect(screen.getByText('A reading room for our neighbors')).toBeTruthy()
    expect(screen.getAllByText('Under review').length).toBeGreaterThan(0)
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('fundflow-demo-data-v1'))
      expect(stored.campaigns[0].status).toBe('pending')
      expect(stored.campaigns[0].organizer).toBe('Sam Rivera')
    })
  })

  it('records a simulated donation and persists the updated campaign total', async () => {
    localStorage.setItem('fundflow-demo-user-v1', JSON.stringify(seedUsers[0]))
    renderApp('/campaigns/campaign-1')

    fireEvent.change(await screen.findByLabelText('Your contribution (₹)'), { target: { value: '750' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add demo donation' }))

    expect(await screen.findByText('₹1,28,250')).toBeTruthy()
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('fundflow-demo-data-v1'))
      expect(stored.campaigns.find((campaign) => campaign.id === 'campaign-1').raised).toBe(128250)
      expect(stored.donations[0].amount).toBe(750)
    })
  })

  it('searches and filters the public campaign list', async () => {
    renderApp('/explore')

    fireEvent.change(await screen.findByLabelText('Search campaigns'), { target: { value: 'clean water' } })
    expect(screen.getByText('Clean water, closer to home')).toBeTruthy()
    expect(screen.queryByText('A brighter start for every child')).toBeNull()

    fireEvent.change(screen.getByLabelText('Search campaigns'), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: 'Environment' }))
    expect(screen.getByText('Keep the neighborhood garden growing')).toBeTruthy()
    expect(screen.queryByText('Clean water, closer to home')).toBeNull()
  })

  it('searches and filters campaigns from the homepage', async () => {
    renderApp('/')

    fireEvent.change(await screen.findByLabelText('Search campaigns on this page'), { target: { value: 'clean water' } })
    expect(screen.getByText('Clean water, closer to home')).toBeTruthy()
    expect(screen.queryByText('A brighter start for every child')).toBeNull()

    fireEvent.change(screen.getByLabelText('Search campaigns on this page'), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: 'Animals' }))
    expect(screen.getByText('A second chance for street dogs')).toBeTruthy()
    expect(screen.queryByText('Clean water, closer to home')).toBeNull()
  })

  it('lets the demo admin approve a submitted campaign', async () => {
    const pendingCampaign = { ...seedCampaigns[0], id: 'campaign-pending', title: 'A pending community project', organizerId: 'user-test', status: 'pending' }
    localStorage.setItem('fundflow-demo-user-v1', JSON.stringify(seedUsers.find((user) => user.role === 'admin')))
    localStorage.setItem('fundflow-demo-data-v1', JSON.stringify({
      campaigns: [pendingCampaign, ...seedCampaigns.slice(1)],
      users: seedUsers,
      donations: [],
      activities: [],
    }))
    renderApp('/admin/campaigns')

    fireEvent.click(await screen.findByRole('button', { name: 'Approve' }))

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('fundflow-demo-data-v1'))
      expect(stored.campaigns[0].status).toBe('approved')
    })
  })
})
