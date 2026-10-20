import { Link, useParams } from 'react-router-dom'
import { useProducts } from './useProducts'

function Profile() {
  const { vendorId } = useParams()
  const { products, loading, error } = useProducts()

  const back = <Link to="/browse" className="back" aria-label="Back">←</Link>

  if (loading) return <div className="page">{back}<p className="empty">Loading…</p></div>
  if (error) return <div className="page">{back}<p className="empty">{error}</p></div>

  const all = products.filter((p) => p.vendorId === vendorId)
  if (all.length === 0) return <div className="page">{back}<p className="empty">This shop could not be found.</p></div>

  const items = all.filter((p) => !p.soldOut)
  const first = all[0]
  const message = 'Hi, I found your shop on Rack.'
  const chatLink = `https://wa.me/${first.whatsapp}?text=${encodeURIComponent(message)}`

  return (
    <div className="page">
      {back}

      <div className="profile-head">
        <div className="avatar large"></div>
        <div>
          <div className="detail-price">{first.vendor}</div>
          <div className="vendor">{first.town} · {items.length} products</div>
        </div>
      </div>

      <a className="cta outline" href={chatLink} target="_blank" rel="noreferrer">
        Chat on WhatsApp
      </a>

      <div className="label">All products</div>
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
    </div>
  )
}

export default Profile