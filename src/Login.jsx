import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
import { toInternational, isValid } from './phone'

function Login() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (!isValid(phone)) return setError('Please enter a valid Nigerian number, like 0801 234 5678.')

    setBusy(true)
    const full = toInternational(phone)
    const { error } = await supabase.auth.signInWithOtp({
      phone: full,
      options: { shouldCreateUser: false },
    })
    setBusy(false)
    if (error) return setError('We could not send a code. Check the number, or start selling if you are new.')

    navigate('/verify', { state: { phone: full, mode: 'login' } })
  }

  return (
    <div className="page">
      <Link to="/" className="back" aria-label="Back">←</Link>
      <h2 className="title">Welcome back</h2>
      <p className="note">Enter your WhatsApp number and we'll send you a code.</p>

      <form className="form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="phone">WhatsApp number</label>
          <input id="phone" className="search" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0801 234 5678" />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="cta" type="submit" disabled={busy}>
          {busy ? 'Sending code…' : 'Send code'}
        </button>
      </form>

      <Link to="/signup" className="link center">New here? Start selling</Link>
    </div>
  )
}

export default Login