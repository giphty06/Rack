import { Link, useParams } from 'react-router-dom'
import { useProducts } from './useProducts'

function Detail() {
  const { id } = useParams()
  const { products, loading, error } = useProducts()

  const back = <Link to="/browse" className="back" aria-label="Back">←</Link>

  if (loading) return <div className="page">{back}<p className="empty">Loading…</p></div>
  if (error) return <div className="page">{back}<p className="empty">{error}</p></div>

  const product = products.find((p) => p.id === Number(id))
  if (!product) return <div className="page">{back}<p className="empty">This item could not be found.</p></div>

  const more = products.filter(
    (p) => p.vendorId === product.vendorId && p.id !== product.id && !p.soldOut
  )
  const message = `Hi, I saw "${product.name}" on Rack. Is it still available?`
  const chatLink = `https://wa.me/${product.whatsapp}?text=${encodeURIComponent(message)}`

  return (
    <div className="page">
      {back}

      <div className="photo big">
        {product.photo && <img src={product.photo} alt={product.name} />}
      </div>

      <div>
        <div className="detail-price">₦ {product.price.toLocaleString()}</div>
        <div className="detail-name">{product.name}</div>
      </div>

      <Link className="vendor-card" to={`/vendor/${product.vendorId}`}>
        <div className="avatar"></div>
        <div className="grow">
          <div>{product.vendor}</div>
          <div className="vendor">{product.town}</div>
        </div>
        <span className="view-shop">View shop</span>
      </Link>

      <div>
        <div className="label">Size or options</div>
        <div className="row">
          {product.sizes.map((s) => (
            <span className="tag" key={s}>{s}</span>
          ))}
        </div>
      </div>

      {more.length > 0 && (
        <div>
          <div className="label">More from this vendor</div>
          <div className="row">
            {more.slice(0, 3).map((m) => (
              <Link className="mini" to={`/product/${m.id}`} key={m.id} aria-label={m.name}>
                {m.photo && <img src={m.photo} alt="" />}
              </Link>
            ))}
          </div>
        </div>
      )}

      {product.soldOut ? (
        <button className="cta" disabled>Sold out</button>
      ) : (
        <a className="cta" href={chatLink} target="_blank" rel="noreferrer">
          Chat with vendor on WhatsApp
        </a>
      )}
    </div>
  )
}

export default Detail