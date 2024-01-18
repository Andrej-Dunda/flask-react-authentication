import React from 'react'
import { useNavigate } from 'react-router-dom'
import httpClient from '../httpClient'

const Register: React.FC = () => {
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const navigate = useNavigate()

  const submitRegister =  () => {
    httpClient.post('http://127.0.0.1:5002/register', {
      email: email,
      password: password
    }).then((response) => {
      console.log(response.data)
      if (response.status === 200) {
        console.log('Register successful')
        navigate('/login')
      }
    }).catch((error) => {
      if (error.response.status === 401) {
        console.error('Register failed')
      }
    })
  }
  
  return (
    <div>
      <h1>Register</h1>
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

        <button type="button" onClick={submitRegister}>Register</button>
      </form>
    </div>
  )
}

export default Register
