import { useState } from 'react'
import { products } from './data'
import { applyFilters, emptyFilters } from './filterRules'

const sizes = ['S', 'M', 'L', 'XL', 'XXL']

function Filters({ items, filters, onApply, onClose }) {
  const [draft, setDraft] = useState(filters)
  const count = applyFilters(items, draft).length
  const set = (key, value) => setDraft({ ...draft, [key]: value })

  return (
    <div className="panel">
      <div className="page">
        <div className="header">
          <h1 className="brand">Filters</h1>
          <button className="link" onClick={() => setDraft(emptyFilters)}>
            Clear all
          </button>
        </div>

        <div className="label">Price (₦)</div>
        <div className="row">
          <input
            className="search"
            type="number"
            inputMode="numeric"
            placeholder="Min"
            aria-label="Minimum price"
            value={draft.min}
            onChange={(e) => set('min', e.target.value)}
          />
          <input
            className="search"
            type="number"
            inputMode="numeric"
            placeholder="Max"
            aria-label="Maximum price"
            value={draft.max}
            onChange={(e) => set('max', e.target.value)}
          />
        </div>

        <div className="label">Size</div>
        <div className="row wrap">
          {sizes.map((s) => (
            <button
              key={s}
              className={draft.size === s ? 'chip on' : 'chip'}
              onClick={() => set('size', draft.size === s ? '' : s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="label">Sort by</div>
        <div className="row wrap">
          <button
            className={draft.sort === 'newest' ? 'chip on' : 'chip'}
            onClick={() => set('sort', 'newest')}
          >
            Newest
          </button>
          <button
            className={draft.sort === 'price' ? 'chip on' : 'chip'}
            onClick={() => set('sort', 'price')}
          >
            Price: low to high
          </button>
        </div>

        <button className="cta" onClick={() => onApply(draft)}>
          Show {count} items
        </button>
        <button className="link center" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default Filters