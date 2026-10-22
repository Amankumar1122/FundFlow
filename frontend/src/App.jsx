import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './components/common/ProtectedRoute'
import Toast from './components/common/Toast'
import About from './pages/About'
import CampaignDetails from './pages/CampaignDetails'
import Contact from './pages/Contact'
import CreateCampaign from './pages/CreateCampaign'
import Dashboard from './pages/Dashboard'
import Explore from './pages/Explore'
import Home from './pages/Home'
import Login from './pages/Login'
import MyCampaigns from './pages/MyCampaigns'
import MyDonations from './pages/MyDonations'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import Register from './pages/Register'
import SiteLayout from './layouts/SiteLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import CampaignManagement from './pages/admin/CampaignManagement'
import DonationRecords from './pages/admin/DonationRecords'
import UserManagement from './pages/admin/UserManagement'

export default function App() {
  return <BrowserRouter><Routes>
    <Route element={<SiteLayout />}>
      <Route index element={<Home />} />
      <Route path="explore" element={<Explore />} />
      <Route path="campaigns/:id" element={<CampaignDetails />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route element={<ProtectedRoute />}>
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="campaigns" element={<MyCampaigns />} />
          <Route path="create" element={<CreateCampaign />} />
          <Route path="donations" element={<MyDonations />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="admin" element={<DashboardLayout admin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="campaigns" element={<CampaignManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="donations" element={<DonationRecords />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes><Toast /></BrowserRouter>
}
