import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from './useProducts'
import Filters from './Filters'
import { applyFilters, emptyFilters } from './filterRules'

function Browse() {
  const { products, loading, error } = useProducts()
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(emptyFilters)
  const [open, setOpen] = useState(false)

  const available = products.filter((p) => !p.soldOut)
  const filtersOn = filters.min !== '' || filters.max !== '' || filters.size !== ''

  const shown = applyFilters(available, filters).filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.vendor.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="page">
      <div className="header">
        <h1 className="brand">Rack</h1>
        <span className="location">Near: Your town</span>
      </div>

      <input
        className="search"
        aria-label="Search"
        placeholder="Search clothes or vendors"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="chips">
        <button className="chip" onClick={() => setOpen(true)}>
          Filters
        </button>
        {filtersOn && (
          <button className="chip active" onClick={() => setFilters(emptyFilters)}>
            Clear filters ✕
          </button>
        )}
      </div>

      {loading ? (
        <p className="empty">Loading…</p>
      ) : error ? (
        <p className="empty">{error}</p>
      ) : shown.length === 0 ? (
        <p className="empty">No items found.</p>
      ) : (
        <div className="grid">
          {shown.map((p) => (
            <Link className="card" to={`/product/${p.id}`} key={p.id}>
              <div className="photo">
                {p.photo && <img src={p.photo} alt={p.name} />}
              </div>
              <div className="price">₦ {p.price.toLocaleString()}</div>
              <div className="name">{p.name}</div>
              <div className="vendor">{p.vendor} · {p.town}</div>
            </Link>
          ))}
        </div>
      )}

      {open && (
        <Filters
          items={available}
          filters={filters}
          onApply={(f) => {
            setFilters(f)
            setOpen(false)
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}

export default Browse