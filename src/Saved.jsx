import { Link } from 'react-router-dom'
import { useProducts } from './useProducts'
import { useSaved } from './useSaved'

function Saved() {
  const { products, loading, error } = useProducts()
  const { ids, remove, clear } = useSaved()

  const back = <Link to="/browse" className="back" aria-label="Back">←</Link>

  if (loading) return <div className="page">{back}<p className="empty">Loading…</p></div>
  if (error) return <div className="page">{back}<p className="empty">{error}</p></div>

  const items = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean)

  if (items.length === 0) {
    return (
      <div className="page">
        {back}
        <h2 className="title">Saved items</h2>
        <p className="empty">
          Nothing saved yet. Tap the heart on items you like, then message each vendor from here.
        </p>
        <Link to="/browse" className="cta">Browse products</Link>
      </div>
    )
  }

  const groups = {}
  items.forEach((p) => {
    if (!groups[p.vendorId]) groups[p.vendorId] = []
    groups[p.vendorId].push(p)
  })

  return (
    <div className="page">
      {back}
      <div className="header">
        <h2 className="title">Saved items</h2>
        <button className="link" onClick={clear}>Clear all</button>
      </div>
      <p className="note">Message each vendor once about everything you picked from them.</p>

      {Object.values(groups).map((list) => {
        const first = list[0]
        const available = list.filter((p) => !p.soldOut)
        const lines = available
          .map((p) => `- ${p.name} (₦${p.price.toLocaleString()})`)
          .join('\n')
        const message = `Hi, I found these on Rack and I'm interested:\n${lines}\nAre they still available?`
        const chatLink = `https://wa.me/${first.whatsapp}?text=${encodeURIComponent(message)}`

        return (
          <div className="group" key={first.vendorId}>
            <div className="group-head">{first.vendor} · {first.town}</div>

            {list.map((p) => (
              <div className="saved-row" key={p.id}>
                <Link to={`/product/${p.id}`}>
                  <img className="thumb" src={p.photo} alt={p.name} />
                </Link>
                <div className="saved-info">
                  <div className="price">₦ {p.price.toLocaleString()}</div>
                  <div className="name">{p.name}</div>
                  {p.soldOut && <span className="badge">Sold out</span>}
                </div>
                <button className="link" onClick={() => remove(p.id)}>Remove</button>
              </div>
            ))}

            {available.length > 0 ? (
              <a className="cta" href={chatLink} target="_blank" rel="noreferrer">
                Message {first.vendor} about {available.length} item{available.length === 1 ? '' : 's'}
              </a>
            ) : (
              <p className="note">All of these items are sold out.</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Saved