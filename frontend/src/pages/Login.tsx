import React from 'react'
import httpClient from '../httpClient'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const navigate = useNavigate()

  const submitLogin = () => {
    httpClient.post('http://localhost:5002/login', {
      email: email,
      password: password
    }).then((response) => {
      if (response.status === 200) {
        navigate('/')
      }
    }).catch((error) => {
      if (error.response.status === 401) {
        console.error('Login failed')
      }
    })
  }

  return (
    <div>
      <h1>Login</h1>
      <form>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="button" onClick={submitLogin}>Login</button>
      </form>
    </div>
  )
}

export default Login
