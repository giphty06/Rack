import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export function useVendor(id) {
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('vendors')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setError('Could not load this shop. Please try again.')
        else setVendor(data)
        setLoading(false)
      })
  }, [id])

  return { vendor, loading, error }
}