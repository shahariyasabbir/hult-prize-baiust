import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Spinner } from './ui'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Checking your session…" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/#registration" replace state={{ from: location.pathname }} />
  }

  return children
}
