import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
import { toInternational, isValid } from './phone'

function Signup() {
  const navigate = useNavigate()
  const [shop, setShop] = useState('')
  const [phone, setPhone] = useState('')
  const [town, setTown] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (!shop.trim() || !town.trim()) return setError('Please fill in all the boxes.')
    if (!isValid(phone)) return setError('Please enter a valid Nigerian number, like 0801 234 5678.')

    setBusy(true)
    const full = toInternational(phone)
    const { error } = await supabase.auth.signInWithOtp({ phone: full })
    setBusy(false)
    if (error) return setError('Could not send the code. Please try again.')

    navigate('/verify', {
      state: { phone: full, mode: 'signup', shop: shop.trim(), town: town.trim() },
    })
  }

  return (
    <div className="page">
      <Link to="/" className="back" aria-label="Back">←</Link>
      <h2 className="title">Start selling</h2>
      <p className="note">Set up your shop in about 2 minutes, then post products like you do on your status.</p>

      <form className="form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="shop">Shop or business name</label>
          <input id="shop" className="search" value={shop} onChange={(e) => setShop(e.target.value)} placeholder="e.g. Your shop name" />
        </div>
        <div className="field">
          <label htmlFor="phone">WhatsApp number</label>
          <input id="phone" className="search" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0801 234 5678" />
          <p className="note">Buyers will chat with you on this number, and it will show on your shop.</p>
        </div>
        <div className="field">
          <label htmlFor="town">Town or area</label>
          <input id="town" className="search" value={town} onChange={(e) => setTown(e.target.value)} placeholder="e.g. Your town" />
        </div>

        {error && <p className="error">{error}</p>}
        <p className="note">We'll send a code to your WhatsApp to confirm it's you. No password needed.</p>

        <button className="cta" type="submit" disabled={busy}>
          {busy ? 'Sending code…' : 'Create my shop'}
        </button>
      </form>

      <Link to="/login" className="link center">Already have a shop? Log in</Link>
    </div>
  )
}

export default Signup