import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { iUser } from '../interfaces/user-interface';
import httpClient from '../httpClient';
import { useAuth } from '../contexts/AuthProvider';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<iUser>()
  const { logout } = useAuth()

  useEffect(() => {
    httpClient.get('http://localhost:5002/@me')
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data)
        }
      }).catch((error) => {
        if (error.response.status === 401) {
          console.warn('You have to be logged in to perform this action!')
          navigate('/login')
        } else {
          console.error(error.response.data)
          console.error(error.response.status)
          console.error(error.response.headers)
        }
      })
  }, [navigate])

  return (
    <div>
      {
        user ? (
          <div>
            <h1>Welcome {user.email}</h1>
            <p>You are logged in.</p>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <div>
            <h1>Home Page</h1>
            <p>You are not logged in.</p>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/register')}>Register</button>
          </div>
        )
      }
    </div>
  )
}
export default HomePage
