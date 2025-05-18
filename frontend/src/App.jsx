import React, { useEffect, useState, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Pricing from './pages/Pricing'
import Contact from './pages/Contact'
import ProtectedRoute from './components/ProtectedRoute'
import useAuthStore from './stores/auth'
import Home from './pages/Home'
import Profile from './pages/Profile'
// import CookieConsent from './components/CookieConsent'
// import { initGA, pageview } from './services/analytics'

// Create a client
const queryClient = new QueryClient()

// Analytics Route Observer
function RouteObserver() {
  const location = useLocation()

  useEffect(() => {
    // pageview(location.pathname)
  }, [location])

  return null
}

function AppNavbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-800 shadow-lg border-b-4 border-indigo-600">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-2xl font-bold">BlockPort Global</Link>
          </div>
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-white hover:text-gray-300">Home</Link>
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Login</Link>
                <Link to="/register" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Register</Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setDropdownOpen((open) => !open)}
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                    {(user?.email || user?.username || 'U')[0].toUpperCase()}
                  </div>
                  <span className="text-white font-medium">{user?.email || user?.username || 'User'}</span>
                  <svg className="w-4 h-4 text-white ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Hamburger for Mobile */}
          <div className="md:hidden flex items-center">
            <button
              className="text-white focus:outline-none"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </div>
      {/* Slide-out Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-64 max-w-full bg-gray-800 h-full shadow-lg flex flex-col p-6 animate-slide-in-left">
            <button
              className="absolute top-4 right-4 text-white"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <Link to="/" className="text-white text-2xl font-bold mb-8 mt-2" onClick={() => setMobileMenuOpen(false)}>BlockPort Global</Link>
            <Link to="/" className="text-white py-2 rounded hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded my-2" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </>
            ) : (
              <>
                <Link to="/profile" className="text-white py-2 rounded hover:bg-gray-700" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="w-full text-left text-red-600 py-2 rounded hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function App() {
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    // initGA()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <RouteObserver />
        <AppNavbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Home />} />
          </Routes>

          {/* <CookieConsent /> */}
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App