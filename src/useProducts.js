import { useEffect, useState } from 'react'
import { supabase } from './supabase'

function toProduct(row) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    sizes: row.sizes,
    photo: row.photo_url,
    soldOut: row.sold_out,
    vendor: row.vendors.shop_name,
    vendorId: row.vendors.id,
    town: row.vendors.town,
    whatsapp: row.vendors.whatsapp,
  }
}

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name, price, sizes, photo_url, sold_out, vendors(id, shop_name, whatsapp, town)')
      .order('created_at', { ascending: false })
           .then(({ data, error }) => {
        if (error) {
          console.error(error)
          setError('Could not load items. Please try again.')
        } else {
          setProducts(data.map(toProduct))
        }
        setLoading(false)
      })
  }, [])

  return { products, loading, error }
}