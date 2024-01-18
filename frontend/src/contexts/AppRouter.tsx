import { Route, Routes, Navigate } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import Login from '../pages/Login'
import Register from '../pages/Register'
import { useAuth } from './AuthProvider'

const AppRouter = () => {
  const { isLoggedIn } = useAuth()

  return (
    <Routes>
      {
        isLoggedIn ? (
          <Route path="/" element={<HomePage />} >
            <Route path="*" element={<Navigate to='/' />} />
          </Route>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to='/login' />} />
          </>
        )
      }
    </Routes>
  )
}

export default AppRouter
