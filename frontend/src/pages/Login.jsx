import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import useAuthStore from '../stores/auth';

const TEST_ACCOUNTS = [
  {
    role: 'Admin',
    email: 'admin@test.com',
    password: 'Admin@123',
    description: 'Full access to all features',
  },
  {
    role: 'Importer',
    email: 'importer@test.com',
    password: 'Test@123',
    description: 'Access to contracts and escrow features',
  },
  {
    role: 'Exporter',
    email: 'exporter@test.com',
    password: 'Test@123',
    description: 'Access to contracts and payment features',
  },
  {
    role: 'Logistics',
    email: 'logistics@test.com',
    password: 'Test@123',
    description: 'Access to tracking features',
  },
];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      clearError();
      toast.loading('Signing in...', { id: 'login' });
      await login(data.email, data.password);
      toast.success('Login successful! Welcome back.', { id: 'login' });
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed. Please check your credentials.', { id: 'login' });
      console.error('Login failed:', error);
    }
  };

  const handleQuickLogin = (account) => {
    setValue('email', account.email);
    setValue('password', account.password);
    toast.info(`Quick login as ${account.role}`, { duration: 2000 });
    handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/20">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to your BlockPort Global account
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              Create one here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                })}
                className="appearance-none rounded-xl relative block w-full px-4 py-3 pr-12 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 top-6 pr-4 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        {/* Test Accounts Section */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Quick Login - Test Accounts</h3>
          <div className="grid gap-3 sm:gap-4">
            {TEST_ACCOUNTS.map((account) => (
              <div
                key={account.email}
                className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50"
                onClick={() => handleQuickLogin(account)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {account.role} Account
                      </h4>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Quick Login
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{account.email}</p>
                    <p className="text-xs text-gray-500">{account.description}</p>
                  </div>
                  <div className="ml-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Click any account above for instant login
          </p>
        </div>
      </div>
    </div>
  );
} 