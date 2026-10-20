import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { supabase } from './supabase'

function EditItem() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [item, setItem] = useState(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [sizes, setSizes] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user
      if (!user) return setStatus('login')

      const { data: row } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('vendor_id', user.id)
        .maybeSingle()
      if (!row) return setStatus('missing')

      setItem(row)
      setName(row.name)
      setPrice(String(row.price))
      setSizes(row.sizes.join(', '))
      setStatus('ready')
    })
  }, [id])

  async function save(e) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !price || Number(price) <= 0) {
      return setError('Please add a name and a price.')
    }

    setBusy(true)
    const sizeList = sizes
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean)

    const { error } = await supabase
      .from('products')
      .update({
        name: name.trim(),
        price: Math.round(Number(price)),
        sizes: sizeList,
      })
      .eq('id', id)
    setBusy(false)

    if (error) return setError('Could not save your changes. Please try again.')
    navigate('/my-shop')
  }

  if (status === 'loading') return <div className="page"><p className="empty">Loading…</p></div>
  if (status === 'login') return <Navigate to="/login" replace />
  if (status === 'missing') {
    return (
      <div className="page">
        <Link to="/my-shop" className="back" aria-label="Back">←</Link>
        <p className="empty">This item could not be found.</p>
      </div>
    )
  }

  return (
    <div className="page">
      <Link to="/my-shop" className="back" aria-label="Back">←</Link>
      <h2 className="title">Edit item</h2>

      <img className="preview" src={item.photo_url} alt={item.name} />

      <form className="form" onSubmit={save}>
        <div className="field">
          <label htmlFor="price">Price (₦)</label>
          <input id="price" className="search" type="number" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="name">What is it?</label>
          <input id="name" className="search" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="sizes">Size or options (optional)</label>
          <input id="sizes" className="search" placeholder="e.g. M, L, XL" value={sizes} onChange={(e) => setSizes(e.target.value)} />
        </div>

        {error && <p className="error">{error}</p>}

        <button className="cta" type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}

export default EditItem