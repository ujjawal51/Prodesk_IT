import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  function loginAsGuest() {
    setIsLoggedIn(true)
    setUser({ name: 'Guest User', role: 'guest' })
    console.log('[Analytics] User logged in as Guest')
  }

  function logout() {
    setIsLoggedIn(false)
    setUser(null)
    console.log('[Analytics] User logged out')
  }

  const value = { isLoggedIn, user, loginAsGuest, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}
