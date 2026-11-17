import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
import { resizeImage } from './resizeImage'

const SUGGESTED = [
  'Do you deliver?',
  'How do I pay?',
  'Can I return or exchange an item?',
  'How long does an order take?',
  'Do you take custom orders?',
]
const MAX_FAQ = 5

function cleanHandle(value) {
  return value.trim().replace(/^@/, '').replace(/\s+/g, '')
}

function EditShop() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [userId, setUserId] = useState('')
  const [bio, setBio] = useState('')
  const [instagram, setInstagram] = useState('')
  const [tiktok, setTiktok] = useState('')
  const [facebook, setFacebook] = useState('')
  const [faqs, setFaqs] = useState([])
  const [avatarUrl, setAvatarUrl] = useState('')
  const [newFile, setNewFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

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

      setUserId(user.id)
      setBio(row.bio || '')
      setInstagram(row.instagram || '')
      setTiktok(row.tiktok || '')
      setFacebook(row.facebook || '')
      setFaqs(Array.isArray(row.faqs) ? row.faqs : [])
      setAvatarUrl(row.avatar_url || '')
      setStatus('ready')
    })
  }, [])

  function pickPhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setNewFile(file)
    setPreview(URL.createObjectURL(file))
    e.target.value = ''
  }

  function addFaq(q) {
    if (faqs.length >= MAX_FAQ) return
    setFaqs([...faqs, { q, a: '' }])
  }

  function changeFaq(i, field, value) {
    setFaqs(faqs.map((f, idx) => (idx === i ? { ...f, [field]: value } : f)))
  }

  function removeFaq(i) {
    setFaqs(faqs.filter((_, idx) => idx !== i))
  }

  async function save(e) {
    e.preventDefault()
    setError('')

    const ig = cleanHandle(instagram)
    const tt = cleanHandle(tiktok)
    const fb = cleanHandle(facebook)

    if (ig && !/^[A-Za-z0-9._]{1,30}$/.test(ig)) {
      return setError('Instagram handle can only use letters, numbers, dots and underscores.')
    }
    if (tt && !/^[A-Za-z0-9._]{1,30}$/.test(tt)) {
      return setError('TikTok handle can only use letters, numbers, dots and underscores.')
    }
    if (fb && !/^[A-Za-z0-9._-]{1,50}$/.test(fb)) {
      return setError('Facebook name can only use letters, numbers, dots, dashes and underscores.')
    }
    for (const f of faqs) {
      if (!f.q.trim() || !f.a.trim()) {
        return setError('Fill in both the question and the answer for each FAQ, or remove it.')
      }
    }

    setBusy(true)
    try {
      let newAvatar = avatarUrl
      let oldPath = ''

      if (newFile) {
        const blob = await resizeImage(newFile, 600)
        const path = `${userId}/shop-${Date.now()}.jpg`
        const up = await supabase.storage
          .from('product-photos')
          .upload(path, blob, { contentType: 'image/jpeg' })
        if (up.error) throw up.error
        newAvatar = supabase.storage.from('product-photos').getPublicUrl(path).data.publicUrl
        oldPath = avatarUrl.split('/product-photos/')[1] || ''
      }

      const { error: saveError } = await supabase
        .from('vendors')
        .update({
          bio: bio.trim() || null,
          instagram: ig || null,
          tiktok: tt || null,
          facebook: fb || null,
          faqs: faqs.map((f) => ({ q: f.q.trim(), a: f.a.trim() })),
          avatar_url: newAvatar || null,
        })
        .eq('id', userId)
      if (saveError) throw saveError

      if (oldPath) await supabase.storage.from('product-photos').remove([oldPath])
      navigate('/my-shop')
    } catch {
      setBusy(false)
      setError('Could not save your changes. Please try again.')
    }
  }

  if (status === 'loading') return <div className="page"><p className="empty">Loading…</p></div>
  if (status === 'login') return <Navigate to="/login" replace />
  if (status === 'signup') return <Navigate to="/signup" replace />

  const shownPhoto = preview || avatarUrl
  const unused = SUGGESTED.filter((q) => !faqs.some((f) => f.q === q))

  return (
    <div className="page">
      <Link to="/my-shop" className="back" aria-label="Back">←</Link>
      <h2 className="title">Edit shop page</h2>
      <p className="note">Everything here shows publicly on your shop page.</p>

      <form className="form" onSubmit={save}>
        <div className="photo-row">
          {shownPhoto ? (
            <img className="avatar large" src={shownPhoto} alt="Your shop" />
          ) : (
            <div className="avatar large"></div>
          )}
          <label className="cta outline pick">
            Choose shop photo
            <input type="file" accept="image/*" hidden onChange={pickPhoto} />
          </label>
        </div>

        <div className="field">
          <label htmlFor="bio">About your shop</label>
          <textarea
            id="bio"
            className="search area"
            maxLength={200}
            placeholder="e.g. Handmade footwear and bags, made to order in your town."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <p className="counter">{bio.length}/200</p>
        </div>

        <div className="field">
          <label htmlFor="ig">Instagram handle (optional)</label>
          <input id="ig" className="search" placeholder="e.g. yourshop" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="tt">TikTok handle (optional)</label>
          <input id="tt" className="search" placeholder="e.g. yourshop" value={tiktok} onChange={(e) => setTiktok(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="fb">Facebook page name (optional)</label>
          <input id="fb" className="search" placeholder="e.g. yourshop" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
        </div>

        <div className="field">
          <label>Questions buyers ask (up to {MAX_FAQ})</label>
          <p className="note">Tap a suggestion to add it, then type your answer.</p>

          {faqs.length < MAX_FAQ && (
            <div className="chips wrap">
              {unused.map((q) => (
                <button type="button" className="chip" key={q} onClick={() => addFaq(q)}>
                  + {q}
                </button>
              ))}
              <button type="button" className="chip" onClick={() => addFaq('')}>
                + My own question
              </button>
            </div>
          )}

          {faqs.map((f, i) => (
            <div className="faq-edit" key={i}>
              <input
                className="search"
                maxLength={80}
                placeholder="Question"
                aria-label={`Question ${i + 1}`}
                value={f.q}
                onChange={(e) => changeFaq(i, 'q', e.target.value)}
              />
              <textarea
                className="search area"
                maxLength={300}
                placeholder="Your answer"
                aria-label={`Answer ${i + 1}`}
                value={f.a}
                onChange={(e) => changeFaq(i, 'a', e.target.value)}
              />
              <button type="button" className="link" onClick={() => removeFaq(i)}>
                Remove this question
              </button>
            </div>
          ))}
        </div>

        {error && <p className="error">{error}</p>}

        <button className="cta" type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save shop page'}
        </button>
      </form>
    </div>
  )
}

export default EditShop