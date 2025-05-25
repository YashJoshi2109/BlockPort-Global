import React, { useEffect, useState, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
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
    <nav className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 shadow-xl border-b-4 border-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              BlockPort Global
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
              Home
            </Link>
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
              Pricing
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
              Contact
            </Link>
            {!isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center space-x-3 focus:outline-none bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors duration-200"
                  onClick={() => setDropdownOpen((open) => !open)}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    {(user?.email || user?.username || 'U')[0].toUpperCase()}
                  </div>
                  <span className="text-white font-medium hidden sm:block">{user?.email || user?.username || 'User'}</span>
                  <svg className="w-4 h-4 text-gray-300 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-blue-50 transition-colors duration-200">
                      Dashboard
                    </Link>
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-blue-50 transition-colors duration-200">
                      Profile
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-300 hover:text-white focus:outline-none p-2"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-80 max-w-full bg-gradient-to-b from-gray-900 to-gray-800 h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <Link to="/" className="text-white text-xl font-bold" onClick={() => setMobileMenuOpen(false)}>
                BlockPort Global
              </Link>
              <button
                className="text-gray-300 hover:text-white p-2"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 px-6 py-4 space-y-4">
              <Link 
                to="/" 
                className="block text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/pricing" 
                className="block text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/contact" 
                className="block text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              {!isAuthenticated ? (
                <div className="space-y-3 pt-4">
                  <Link 
                    to="/login" 
                    className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-all duration-200" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-all duration-200" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {(user?.email || user?.username || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{user?.email || user?.username || 'User'}</p>
                      <p className="text-gray-400 text-xs">{user?.role || 'User'}</p>
                    </div>
                  </div>
                  <Link 
                    to="/dashboard" 
                    className="block text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="block w-full text-left text-red-400 hover:text-red-300 py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#10B981',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
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