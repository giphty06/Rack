import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

function MyShop() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [vendor, setVendor] = useState(null)
  const [items, setItems] = useState([])
  const [tab, setTab] = useState('live')
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user
      if (!user) return setStatus('login')

      const { data: row } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      if (!row) return setStatus('signup')

      const { data: list, error } = await supabase
        .from('products')
        .select('*')
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false })
      if (error) setError('Could not load your items. Please try again.')

      setVendor(row)
      setItems(list || [])
      setStatus('ready')
    })
  }, [])

  async function toggleSold(p) {
    setError('')
    const { error } = await supabase
      .from('products')
      .update({ sold_out: !p.sold_out })
      .eq('id', p.id)
    if (error) return setError('Could not update that item. Please try again.')
    setItems((prev) => prev.map((x) => (x.id === p.id ? { ...x, sold_out: !x.sold_out } : x)))
  }

  async function remove(p) {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    setError('')
    const { error } = await supabase.from('products').delete().eq('id', p.id)
    if (error) return setError('Could not delete that item. Please try again.')

    const path = p.photo_url.split('/product-photos/')[1]
    if (path) await supabase.storage.from('product-photos').remove([path])
    setItems((prev) => prev.filter((x) => x.id !== p.id))
  }

  async function logOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (status === 'loading') return <div className="page"><p className="empty">Loading…</p></div>
  if (status === 'login') return <Navigate to="/login" replace />
  if (status === 'signup') return <Navigate to="/signup" replace />

  const live = items.filter((p) => !p.sold_out)
  const sold = items.filter((p) => p.sold_out)
  const shown = tab === 'live' ? live : sold

  return (
    <div className="page">
      <div className="header">
        <div className="shop-title">
          <Link to="/" className="back" aria-label="Back to home">←</Link>
          <h2 className="title">My shop</h2>
        </div>
        <button className="link" onClick={logOut}>Log out</button>
      </div>
      <p className="note">{vendor.shop_name} · {vendor.town}</p>

      <Link to="/my-shop/new" className="cta">Post new items</Link>
      <Link to={`/vendor/${vendor.id}`} className="link center">See how buyers view my shop</Link>

      <div className="chips">
        <button className={tab === 'live' ? 'chip on' : 'chip'} onClick={() => setTab('live')}>
          Live ({live.length})
        </button>
        <button className={tab === 'sold' ? 'chip on' : 'chip'} onClick={() => setTab('sold')}>
          Sold out ({sold.length})
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {shown.length === 0 ? (
        <p className="empty">
          {tab === 'live' ? 'You have no live items yet. Tap "Post new items" to add some.' : 'Nothing is marked sold out.'}
        </p>
      ) : (
        shown.map((p) => (
          <div className="item-card" key={p.id}>
            <div className="item-top">
              <img className="thumb" src={p.photo_url} alt={p.name} />
              <div>
                <div className="price">₦ {p.price.toLocaleString()}</div>
                <div className="name">{p.name}</div>
                {p.sold_out && <span className="badge">Sold out</span>}
              </div>
            </div>
            <div className="item-actions">
              <button className="btn-sm" onClick={() => toggleSold(p)}>
                {p.sold_out ? 'Back in stock' : 'Mark sold out'}
              </button>
              <Link className="btn-sm" to={`/my-shop/edit/${p.id}`}>Edit</Link>
              <button className="btn-sm" onClick={() => remove(p)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default MyShop