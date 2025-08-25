"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authAPI } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))

  const navigate = useNavigate()

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    // Validate stored token
    if (storedUser && storedToken && storedToken.trim() !== "" && storedToken !== "null" && storedToken !== "undefined") {
      try {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        // Clean up invalid data
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    } else {
      // Clean up invalid or empty tokens
      if (storedToken && (storedToken.trim() === "" || storedToken === "null" || storedToken === "undefined")) {
        localStorage.removeItem("token")
      }
      if (storedUser && !storedToken) {
        localStorage.removeItem("user")
      }
    }
    
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      setLoading(true)
      setError(null)

      const response = await authAPI.login({ username, password })

      const { token: apiToken, ...userData } = response.data
      const user = userData.user || userData

      // Validate token before storing
      if (apiToken && apiToken.trim() !== "" && apiToken !== "null" && apiToken !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("token", apiToken)
        setUser(user)
        setToken(apiToken)
      } else {
        throw new Error("Invalid token received from server")
      }

      const userRoles = user.roles || user.role || []
      if (userRoles.includes("ADMIN") || userRoles.includes("ROLE_ADMIN")) {
        navigate("/admin")
      } else if (userRoles.includes("MENTOR") || userRoles.includes("ROLE_MENTOR")) {
        navigate("/mentor")
      } else {
        navigate("/member")
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Đăng nhập thất bại"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)

      const response = await authAPI.register(userData)

      return { success: true, data: response.data }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Đăng ký thất bại"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }



  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    setToken(null)
    navigate("/")
  }

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData }
    localStorage.setItem("user", JSON.stringify(newUserData))
    setUser(newUserData)
  }

  const hasRole = (role) => {
    if (!user) return false

    const userRoles = user.roles || user.role || []

    // Handle both array and string formats
    if (Array.isArray(userRoles)) {
      return userRoles.includes(role) || userRoles.includes(`ROLE_${role}`)
    }

    return userRoles === role || userRoles === `ROLE_${role}`
  }

  // Check authentication
  const isAuthenticated = !!token && !!user

  const value = {
    user,
    currentUser: user, // Add alias for compatibility
    login,
    logout,
    loading,
    error,
    isAuthenticated,
    register,

    hasRole,
    isAdmin: hasRole("ADMIN"),
    isMentor: hasRole("MENTOR"),
    isMember: hasRole("MEMBER"),
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}