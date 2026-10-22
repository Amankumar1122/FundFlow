import { Outlet } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'

export default function SiteLayout() {
  return <><Navbar /><main className="min-h-[55vh]"><Outlet /></main><Footer /></>
}
