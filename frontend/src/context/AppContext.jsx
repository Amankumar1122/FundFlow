import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { findDemoUser, loadDemoData, saveDemoData } from '../services/mockApi'
import { authApi, campaignsApi, donationsApi, usersApi, adminApi } from '../services/apiClient'

const AppContext = createContext(null)

export function adaptCampaign(c) {
  if (!c) return null
  const goal = Number(c.goalAmount ?? c.goal ?? 0)
  const raised = Number(c.raisedAmount ?? c.raised ?? 0)
  const daysLeft = c.endDate ? Math.max(0, Math.ceil((new Date(c.endDate) - Date.now()) / 86400000)) : (c.daysLeft || 30)
  return {
    id: String(c.id),
    title: c.title,
    category: c.category || 'Community',
    organizer: c.organizerName || c.organizer || 'Community Organizer',
    organizerId: c.organizerId ? String(c.organizerId) : (c.organizerId || 'user-1'),
    location: c.location || 'India',
    goal,
    raised,
    backers: Number(c.backers || 0),
    daysLeft,
    status: (c.status || 'APPROVED').toLowerCase(),
    createdAt: c.createdAt || new Date().toISOString(),
    image: c.imageUrl || c.image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80',
    description: c.description || '',
    story: c.story || c.description || '',
  }
}

export function AppProvider({ children }) {
  const [data, setData] = useState(loadDemoData)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fundflow-demo-user-v1')) || null
    } catch {
      return null
    }
  })
  const [toast, setToast] = useState(null)
  const [backendOnline, setBackendOnline] = useState(false)

  // Sync state to localStorage
  useEffect(() => saveDemoData(data), [data])
  useEffect(() => {
    if (user) {
      localStorage.setItem('fundflow-demo-user-v1', JSON.stringify(user))
      localStorage.setItem('fundflow-auth-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('fundflow-demo-user-v1')
      localStorage.removeItem('fundflow-auth-user')
    }
  }, [user])

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 3600)
    return () => clearTimeout(timer)
  }, [toast])

  const notify = useCallback((message, type = 'success') => {
    setToast(message ? { message, type, id: Date.now() } : null)
  }, [])

  const updateData = useCallback((updater) => setData((prev) => updater(prev)), [])

  // Sync from backend if available and not running in test
  useEffect(() => {
    if (import.meta.env.MODE === 'test') return
    let active = true
    campaignsApi.getAll()
      .then((serverCampaigns) => {
        if (!active || !Array.isArray(serverCampaigns)) return
        setBackendOnline(true)
        const adapted = serverCampaigns.map(adaptCampaign)
        updateData((prev) => ({
          ...prev,
          campaigns: adapted,
        }))
      })
      .catch(() => {
        if (active) setBackendOnline(false)
      })
    return () => { active = false }
  }, [updateData])

  const login = (email, password) => {
    const found = findDemoUser(email, password, data.users)
    setUser(found)
    notify(`Welcome back, ${found.name.split(' ')[0]}!`)

    // Background API sync if not in test
    if (import.meta.env.MODE !== 'test') {
      authApi.login(email, password)
        .then((auth) => {
          setBackendOnline(true)
          setUser((curr) => ({ ...curr, token: auth.token, id: String(auth.userId) }))
        })
        .catch(() => {
          // offline mode
        })
    }
    return found
  }

  const register = ({ name, email, password }) => {
    if (data.users.some((item) => item.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new Error('An account with this email already exists. Please log in instead.')
    }
    if (password.length < 8) throw new Error('Choose a password with at least 8 characters.')
    const created = { id: `user-${Date.now()}`, name: name.trim(), email: email.trim(), role: 'user', location: '', bio: '' }
    updateData((prev) => ({ ...prev, users: [...prev.users, created] }))
    setUser(created)
    notify('Your account is ready. Welcome to FundFlow!')

    // Background API sync if not in test
    if (import.meta.env.MODE !== 'test') {
      authApi.register({ name: name.trim(), email: email.trim(), password })
        .then((auth) => {
          setBackendOnline(true)
          setUser((curr) => ({ ...curr, token: auth.token, id: String(auth.userId) }))
        })
        .catch(() => {
          // offline mode
        })
    }
    return created
  }

  const logout = () => {
    setUser(null)
    notify('You have been signed out.')
  }

  const createCampaign = (campaign) => {
    if (!user) throw new Error('Please log in to start a campaign.')
    const created = {
      ...campaign,
      id: `campaign-${Date.now()}`,
      organizer: user.name,
      organizerId: user.id,
      raised: 0,
      backers: 0,
      daysLeft: Math.max(1, Math.ceil((new Date(campaign.endDate) - Date.now()) / 86400000)),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    updateData((prev) => ({
      ...prev,
      campaigns: [created, ...prev.campaigns],
      activities: [{ id: `activity-${Date.now()}`, text: `${user.name} submitted ${created.title} for review`, date: created.createdAt, type: 'campaign' }, ...prev.activities],
    }))
    notify('Campaign submitted! It will appear publicly after review.')

    if (import.meta.env.MODE !== 'test') {
      campaignsApi.create({
        title: campaign.title.trim(),
        description: campaign.description.trim(),
        goalAmount: Number(campaign.goal),
        category: campaign.category || 'Education',
        location: campaign.location.trim(),
        story: campaign.story ? campaign.story.trim() : campaign.description.trim(),
        imageUrl: campaign.image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80',
        endDate: campaign.endDate,
      }).catch(() => {})
    }
    return created
  }

  const deleteCampaign = (id) => {
    updateData((prev) => ({
      ...prev,
      campaigns: prev.campaigns.filter((item) => String(item.id) !== String(id)),
      donations: prev.donations.filter((item) => String(item.campaignId) !== String(id)),
      activities: prev.activities.filter((item) => !item.text?.includes(String(id))),
    }))
    notify('Campaign deleted successfully.')

    if (import.meta.env.MODE !== 'test') {
      const numId = Number(id)
      if (Number.isInteger(numId)) {
        campaignsApi.delete(numId).catch(() => {})
      }
    }
  }

  const donate = (campaignId, amount, message = '') => {
    if (!user) throw new Error('Please log in before making a donation.')
    const value = Number(amount)
    if (!Number.isFinite(value) || value < 1) throw new Error('Enter a valid donation amount.')
    const campaign = data.campaigns.find((item) => String(item.id) === String(campaignId))
    if (!campaign || campaign.status !== 'approved') throw new Error('This campaign is not accepting donations right now.')
    const donation = {
      id: `donation-${Date.now()}`,
      campaignId: String(campaignId),
      donorId: user.id,
      donorName: user.name,
      amount: value,
      message: message.trim(),
      date: new Date().toISOString(),
    }
    updateData((prev) => ({
      ...prev,
      donations: [donation, ...prev.donations],
      campaigns: prev.campaigns.map((item) => String(item.id) === String(campaignId) ? { ...item, raised: item.raised + value, backers: item.backers + 1 } : item),
      activities: [{ id: `activity-${Date.now()}`, text: `${user.name} supported ${campaign.title}`, date: donation.date, type: 'donation' }, ...prev.activities],
    }))
    notify(`Your ₹${value.toLocaleString('en-IN')} demo donation was added. No real money was moved.`)

    if (import.meta.env.MODE !== 'test') {
      const numId = Number(campaignId)
      if (Number.isInteger(numId)) {
        donationsApi.create({ campaignId: numId, amount: value, message: message.trim() }).catch(() => {})
      }
    }
    return donation
  }

  const updateProfile = (changes) => {
    if (!user) throw new Error('Please log in to edit your profile.')
    const updated = { ...user, name: changes.name.trim(), location: (changes.location || '').trim(), bio: (changes.bio || '').trim() }
    updateData((prev) => ({ ...prev, users: prev.users.map((item) => String(item.id) === String(user.id) ? updated : item) }))
    setUser(updated)
    notify('Your profile has been updated.')

    if (import.meta.env.MODE !== 'test') {
      usersApi.updateProfile({ name: updated.name, location: updated.location, bio: updated.bio }).catch(() => {})
    }
  }

  const setCampaignStatus = (id, status) => {
    updateData((prev) => ({ ...prev, campaigns: prev.campaigns.map((item) => String(item.id) === String(id) ? { ...item, status } : item) }))
    notify(`Campaign ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'paused'}.`)

    if (import.meta.env.MODE !== 'test') {
      const numId = Number(id)
      if (Number.isInteger(numId)) {
        adminApi.updateStatus(numId, status.toUpperCase()).catch(() => {})
      }
    }
  }

  const toggleUserStatus = (id) => {
    const target = data.users.find((u) => String(u.id) === String(id))
    const nextDisabled = target ? !target.disabled : false
    updateData((prev) => ({ ...prev, users: prev.users.map((item) => String(item.id) === String(id) ? { ...item, disabled: !item.disabled } : item) }))
    notify('User status updated.')

    if (import.meta.env.MODE !== 'test') {
      const numId = Number(id)
      if (Number.isInteger(numId)) {
        adminApi.setUserEnabled(numId, !nextDisabled).catch(() => {})
      }
    }
  }

  const value = useMemo(() => ({
    ...data,
    user,
    toast,
    backendOnline,
    notify,
    login,
    register,
    logout,
    createCampaign,
    deleteCampaign,
    donate,
    updateProfile,
    setCampaignStatus,
    toggleUserStatus,
  }), [data, user, toast, backendOnline, notify, updateData])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within an AppProvider')
  return context
}
