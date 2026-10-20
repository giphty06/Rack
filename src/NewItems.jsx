import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
import { resizeImage } from './resizeImage'

function NewItems() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')
  const [busy, setBusy] = useState(false)

  function pick(e) {
    const files = Array.from(e.target.files)
    const added = files.map((file, i) => ({
      key: `${Date.now()}-${i}`,
      file,
      preview: URL.createObjectURL(file),
      name: '',
      price: '',
      sizes: '',
    }))
    setItems((prev) => [...prev, ...added])
    e.target.value = ''
  }

  function change(key, field, value) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, [field]: value } : it)))
  }

  function remove(key) {
    setItems((prev) => prev.filter((it) => it.key !== key))
  }

  async function post() {
    setError('')
    if (items.length === 0) return setError('Choose at least one photo first.')
    for (const it of items) {
      if (!it.name.trim() || !it.price || Number(it.price) <= 0) {
        return setError('Please add a name and a price for every photo.')
      }
    }

    const { data } = await supabase.auth.getSession()
    const user = data.session?.user
    if (!user) return navigate('/login')

    setBusy(true)
    for (let i = 0; i < items.length; i++) {
      const it = items[i]
      setProgress(`Uploading ${i + 1} of ${items.length}…`)
      try {
        const blob = await resizeImage(it.file)
        const path = `${user.id}/${Date.now()}-${i}.jpg`
        const up = await supabase.storage
          .from('product-photos')
          .upload(path, blob, { contentType: 'image/jpeg' })
        if (up.error) throw up.error

        const { data: pub } = supabase.storage.from('product-photos').getPublicUrl(path)
        const sizes = it.sizes
          .split(',')
          .map((s) => s.trim().toUpperCase())
          .filter(Boolean)

        const ins = await supabase.from('products').insert({
          vendor_id: user.id,
          name: it.name.trim(),
          price: Math.round(Number(it.price)),
          sizes,
          photo_url: pub.publicUrl,
        })
        if (ins.error) throw ins.error

        setItems((prev) => prev.filter((p) => p.key !== it.key))
      } catch (err) {
        setBusy(false)
        setProgress('')
        return setError(
          `Something went wrong with "${it.name}". The items before it were posted. Tap Post again to retry the rest.`
        )
      }
    }

    setBusy(false)
    navigate('/my-shop')
  }

  return (
    <div className="page">
      <Link to="/my-shop" className="back" aria-label="Back">←</Link>
      <h2 className="title">Add products</h2>
      <p className="note">{items.length} photo{items.length === 1 ? '' : 's'} selected</p>

      <label className="cta outline pick">
        Choose photos
        <input type="file" accept="image/*" multiple hidden onChange={pick} />
      </label>

      {items.map((it) => (
        <div className="item-card" key={it.key}>
          <img className="preview" src={it.preview} alt="" />
          <div className="field">
            <label>Price (₦)</label>
            <input className="search" type="number" inputMode="numeric" placeholder="e.g. 15000" value={it.price} onChange={(e) => change(it.key, 'price', e.target.value)} />
          </div>
          <div className="field">
            <label>What is it?</label>
            <input className="search" placeholder="e.g. Ankara gown" value={it.name} onChange={(e) => change(it.key, 'name', e.target.value)} />
          </div>
          <div className="field">
            <label>Size or options (optional)</label>
            <input className="search" placeholder="e.g. M, L, XL" value={it.sizes} onChange={(e) => change(it.key, 'sizes', e.target.value)} />
          </div>
          <button className="link" onClick={() => remove(it.key)}>Remove this photo</button>
        </div>
      ))}

      {error && <p className="error">{error}</p>}
      {progress && <p className="note">{progress}</p>}

      {items.length > 0 && (
        <button className="cta" onClick={post} disabled={busy}>
          {busy ? 'Posting…' : `Post ${items.length} item${items.length === 1 ? '' : 's'}`}
        </button>
      )}
    </div>
  )
}

export default NewItems