import { Link, useParams } from 'react-router-dom'
import { useProducts } from './useProducts'
import { useVendor } from './useVendor'

function Profile() {
  const { vendorId } = useParams()
  const { vendor, loading: vLoading, error: vError } = useVendor(vendorId)
  const { products, loading: pLoading, error: pError } = useProducts()

  const back = <Link to="/browse" className="back" aria-label="Back">←</Link>

  if (vLoading || pLoading) return <div className="page">{back}<p className="empty">Loading…</p></div>
  if (vError || pError) return <div className="page">{back}<p className="empty">{vError || pError}</p></div>
  if (!vendor) return <div className="page">{back}<p className="empty">This shop could not be found.</p></div>

  const items = products.filter((p) => p.vendorId === vendor.id && !p.soldOut)
  const message = 'Hi, I found your shop on Rack.'
  const chatLink = `https://wa.me/${vendor.whatsapp}?text=${encodeURIComponent(message)}`

  const socials = [
    vendor.instagram && { name: 'Instagram', url: `https://www.instagram.com/${encodeURIComponent(vendor.instagram)}` },
    vendor.tiktok && { name: 'TikTok', url: `https://www.tiktok.com/@${encodeURIComponent(vendor.tiktok)}` },
    vendor.facebook && { name: 'Facebook', url: `https://www.facebook.com/${encodeURIComponent(vendor.facebook)}` },
  ].filter(Boolean)

  const faqs = Array.isArray(vendor.faqs) ? vendor.faqs : []

  return (
    <div className="page">
      {back}

      <div className="profile-head">
        {vendor.avatar_url ? (
          <img className="avatar large" src={vendor.avatar_url} alt={vendor.shop_name} />
        ) : (
          <div className="avatar large"></div>
        )}
        <div>
          <div className="detail-price">{vendor.shop_name}</div>
          <div className="vendor">{vendor.town} · {items.length} products</div>
        </div>
      </div>

      {vendor.bio && <p className="bio">{vendor.bio}</p>}

      {socials.length > 0 && (
        <div className="socials">
          {socials.map((s) => (
            <a className="social" key={s.name} href={s.url} target="_blank" rel="noreferrer">
              {s.name}
            </a>
          ))}
        </div>
      )}

      <a className="cta outline" href={chatLink} target="_blank" rel="noreferrer">
        Chat on WhatsApp
      </a>

      <div className="label">All products</div>
      {items.length === 0 ? (
        <p className="empty">No products yet.</p>
      ) : (
        <div className="grid">
          {items.map((p) => (
            <Link className="card" to={`/product/${p.id}`} key={p.id}>
              <div className="photo">
                {p.photo && <img src={p.photo} alt={p.name} />}
              </div>
              <div className="price">₦ {p.price.toLocaleString()}</div>
              <div className="name">{p.name}</div>
            </Link>
          ))}
        </div>
      )}

      {faqs.length > 0 && (
        <>
          <div className="label">Questions</div>
          <div className="faq">
            {faqs.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Profile