import { useState, useEffect } from 'react'

const STORE_KEY = 'vinyl_wishlist_v1'

// sanitize karta hai input ko XSS se bachane ke liye
function clean(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// simulates slow 3G delay so loading indicator shows up
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function useWishlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  // simulate fetch on mount (3G connectivity case)
  useEffect(() => {
    let cancelled = false
    async function init() {
      setLoading(true)
      await delay(900)
      if (!cancelled) {
        setItems(loadFromStorage())
        setLoading(false)
      }
    }
    init()
    return () => { cancelled = true }
  }, [])

  // save to localStorage whenever items change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORE_KEY, JSON.stringify(items))
    }
  }, [items, loading])

  function addItem(data) {
    const newItem = {
      id: crypto.randomUUID(),
      album: clean(data.album),
      artist: clean(data.artist),
      genre: clean(data.genre),
      note: clean(data.note || ''),
      priority: data.priority,
      addedAt: Date.now(),
    }
    setItems(prev => [newItem, ...prev])
    console.log('[Analytics] User interacted with Vinyl Wishlist Manager')
    return newItem
  }

  function removeItem(id) {
    setItems(prev => prev.filter(it => it.id !== id))
    console.log('[Analytics] User interacted with Vinyl Wishlist Manager')
  }

  function markFound(id) {
    setItems(prev =>
      prev.map(it => it.id === id ? { ...it, found: !it.found } : it)
    )
    console.log('[Analytics] User interacted with Vinyl Wishlist Manager')
  }

  const filtered = items.filter(it => {
    const q = query.toLowerCase()
    return (
      it.album.toLowerCase().includes(q) ||
      it.artist.toLowerCase().includes(q) ||
      it.genre.toLowerCase().includes(q)
    )
  })

  return {
    items: filtered,
    totalCount: items.length,
    loading,
    query,
    setQuery,
    addItem,
    removeItem,
    markFound,
  }
}
