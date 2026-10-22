import { seedCampaigns, seedDonations, seedUsers } from '../data/seed'

const STORAGE_KEY = 'fundflow-demo-data-v1'

const makeSeed = () => ({
  campaigns: seedCampaigns,
  users: seedUsers,
  donations: seedDonations,
  activities: [
    { id: 'activity-1', text: 'Maya started a brighter start for every child', date: seedCampaigns[0].createdAt, type: 'campaign' },
    { id: 'activity-2', text: 'Rohan supported clean water, closer to home', date: seedDonations[0].date, type: 'donation' },
  ],
})

export function loadDemoData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...makeSeed(), ...JSON.parse(stored) } : makeSeed()
  } catch {
    return makeSeed()
  }
}

export function saveDemoData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function resetDemoData() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem('fundflow-demo-user-v1')
  return makeSeed()
}

export function findDemoUser(email, password, users) {
  if (!email || !password) throw new Error('Enter your email and password.')
  const user = users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase())
  if (!user) throw new Error('We could not find an account with that email. Try creating one.')
  if (user.disabled) throw new Error('This demo account is disabled. Please contact an administrator.')
  return user
}
