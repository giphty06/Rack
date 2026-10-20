import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

function Verify() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [wait, setWait] = useState(45)

  useEffect(() => {
    if (wait <= 0) return
    const t = setTimeout(() => setWait(wait - 1), 1000)
    return () => clearTimeout(t)
  }, [wait])

  if (!state) return <Navigate to="/signup" replace />

  async function confirm(e) {
    e.preventDefault()
    setError('')
    if (code.length !== 6) return setError('Please enter the 6-digit code.')

    setBusy(true)
    const { data, error } = await supabase.auth.verifyOtp({
      phone: state.phone,
      token: code,
      type: 'sms',
    })
    if (error || !data.user) {
      setBusy(false)
      return setError('That code is not right. Please check it and try again.')
    }

    if (state.mode === 'signup') {
      const { error: saveError } = await supabase.from('vendors').upsert({
        id: data.user.id,
        shop_name: state.shop,
        whatsapp: state.phone.replace('+', ''),
        town: state.town,
      })
      if (saveError) {
        setBusy(false)
        return setError('Your number is confirmed, but we could not create the shop. Please try again.')
      }
    } else {
      const { data: vendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle()
      if (!vendor) {
        setBusy(false)
        return navigate('/signup')
      }
    }

    navigate('/my-shop')
  }

  async function resend() {
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      phone: state.phone,
      options: { shouldCreateUser: state.mode === 'signup' },
    })
    if (error) setError('Could not send a new code. Please try again.')
    else setWait(45)
  }

  return (
    <div className="page">
      <Link to={state.mode === 'login' ? '/login' : '/signup'} className="back" aria-label="Back">←</Link>
      <h2 className="title">Enter your code</h2>
      <p className="note">We sent a 6-digit code to your WhatsApp number, {state.phone}.</p>

      <form className="form" onSubmit={confirm}>
        <input
          className="search code"
          inputMode="numeric"
          maxLength={6}
          autoComplete="one-time-code"
          aria-label="6-digit code"
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
        />
        {error && <p className="error">{error}</p>}
        <button className="cta" type="submit" disabled={busy}>
          {busy ? 'Checking…' : 'Confirm'}
        </button>
      </form>

      {wait > 0 ? (
        <p className="note center-text">Didn't get it? You can ask for a new code in {wait}s.</p>
      ) : (
        <button className="link center" onClick={resend}>Send a new code</button>
      )}
      <Link to={state.mode === 'login' ? '/login' : '/signup'} className="link center">Wrong number? Change it</Link>
    </div>
  )
}

export default Verify