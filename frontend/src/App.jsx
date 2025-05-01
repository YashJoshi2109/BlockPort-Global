import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import Dashboard from './components/Dashboard'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/dashboard" />
}

function App() {
  const { user } = useAuth()

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        {!user && (
          <nav className="bg-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Link to="/" className="text-white text-xl font-bold">
                    BlockPort Global
                  </Link>
                </div>
                <div className="flex">
                  <Link
                    to="/login"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        )}

        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterForm />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : (
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <div className="px-4 py-6 sm:px-0">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-white mb-8">
                        Welcome to BlockPort Global
                      </h1>
                      <p className="text-xl text-gray-300 mb-8">
                        Your Gateway to Secure and Efficient Global Trade
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                          <h2 className="text-xl font-bold text-white mb-4">Smart Contracts</h2>
                          <p className="text-gray-300">
                            Automate and secure your trade agreements with blockchain technology
                          </p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                          <h2 className="text-xl font-bold text-white mb-4">Global Network</h2>
                          <p className="text-gray-300">
                            Connect with verified traders and businesses worldwide
                          </p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                          <h2 className="text-xl font-bold text-white mb-4">Secure Payments</h2>
                          <p className="text-gray-300">
                            Execute transactions safely with our blockchain-based payment system
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App