import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Pages auth
import AuthPage from './pages/auth/AuthPage'

// Pages user
import UserDashboard from './pages/user/Dashboard/Dashboard'
import Espaces from './pages/user/Espaces/Espaces'
import Reservation from './pages/user/Reservation/Reservation'
import Profil from './pages/user/Profil/Profil'
import MesReservations from './pages/user/Reservation/MesReservations'

// Pages admin
import AdminDashboard from './pages/admin/Dashboard/Dashboard'
import AdminEspaces from './pages/admin/Espaces/Espaces'
import AdminReservations from './pages/admin/Reservations/Reservations'
import AdminUsers from './pages/admin/Users/Users'
import CreateAdmin from './pages/admin/Users/CreateAdmin'
import CreateEspace from './pages/admin/Espaces/CreateEspace'


function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Chargement...</div>
  return user ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return <div>Chargement...</div>
  if (!user) return <Navigate to="/login" />
  return isAdmin() ? children : <Navigate to="/dashboard" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
      <Route path="/espaces" element={<PrivateRoute><Espaces /></PrivateRoute>} />
      <Route path="/reservation/:id" element={<PrivateRoute><Reservation /></PrivateRoute>} />
      <Route path="/profil" element={<PrivateRoute><Profil /></PrivateRoute>} />
      <Route path="/reservations" element={<PrivateRoute><MesReservations /></PrivateRoute>} />

      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/espaces" element={<AdminRoute><AdminEspaces /></AdminRoute>} />
      <Route path="/admin/espaces/create" element={<AdminRoute><CreateEspace /></AdminRoute>} />
      <Route path="/admin/reservations" element={<AdminRoute><AdminReservations /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/users/create" element={<AdminRoute><CreateAdmin /></AdminRoute>} />
      <Route path="/admin/profil" element={<AdminRoute><Profil /></AdminRoute>} />
    </Routes>
  )
}