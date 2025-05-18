import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  DocumentChartBarIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { analyticsAPI } from '../../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState('month');

  // Fetch dashboard stats
  const { data: dashboardStats } = useQuery(
    ['dashboardStats'],
    () => analyticsAPI.getDashboardStats(),
    {
      select: (data) => data.data,
    }
  );

  // Fetch transaction stats
  const { data: transactionStats } = useQuery(
    ['transactionStats', timeframe],
    () => analyticsAPI.getTransactionStats(timeframe),
    {
      select: (data) => data.data,
    }
  );

  // Fetch revenue stats
  const { data: revenueStats } = useQuery(
    ['revenueStats', timeframe],
    () => analyticsAPI.getRevenueStats(timeframe),
    {
      select: (data) => data.data,
    }
  );

  const handleExportReport = async (type) => {
    try {
      const response = await analyticsAPI.exportReport(type, { timeframe });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-report-${new Date().toISOString()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Analytics Overview</h2>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last 12 Months</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Business Growth */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Business Growth</h3>
            <ChartBarIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">New Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardStats?.newUsers || 0}
              </p>
              <p className="text-sm text-green-600">
                +{dashboardStats?.userGrowth || 0}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Contracts</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardStats?.activeContracts || 0}
              </p>
              <p className="text-sm text-green-600">
                +{dashboardStats?.contractGrowth || 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Metrics */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Revenue</h3>
            <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="mt-6">
            <p className="text-3xl font-semibold text-gray-900">
              ${dashboardStats?.totalRevenue?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Monthly Recurring Revenue</p>
              <p className="text-xl font-semibold text-gray-900">
                ${dashboardStats?.mrr?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-green-600">
                +{dashboardStats?.mrrGrowth || 0}% from last month
              </p>
            </div>
          </div>
        </div>

        {/* User Engagement */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">User Engagement</h3>
            <UserGroupIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardStats?.activeUsers || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Session</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardStats?.avgSessionTime || '0m'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Volume */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Volume</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transactionStats?.timeline || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#4F46E5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueStats?.timeline || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#059669"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Conversion Metrics */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Conversion Metrics</h3>
          <button
            onClick={() => handleExportReport('conversion')}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Export Report
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center">
              <ArrowTrendingUpIcon className="h-5 w-5 text-gray-400 mr-2" />
              <p className="text-sm text-gray-500">Conversion Rate</p>
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {dashboardStats?.conversionRate || 0}%
            </p>
          </div>
          <div>
            <div className="flex items-center">
              <DocumentChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <p className="text-sm text-gray-500">Contract Success</p>
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {dashboardStats?.contractSuccessRate || 0}%
            </p>
          </div>
          <div>
            <div className="flex items-center">
              <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-2" />
              <p className="text-sm text-gray-500">Escrow Completion</p>
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {dashboardStats?.escrowCompletionRate || 0}%
            </p>
          </div>
          <div>
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
              <p className="text-sm text-gray-500">User Retention</p>
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {dashboardStats?.retentionRate || 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Actions</h3>
        <div className="space-y-4">
          {dashboardStats?.recommendations?.map((recommendation, index) => (
            <div
              key={index}
              className="flex items-start p-4 bg-gray-50 rounded-lg"
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  recommendation.priority === 'high'
                    ? 'bg-red-100 text-red-600'
                    : recommendation.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-green-100 text-green-600'
                }`}
              >
                {recommendation.priority === 'high' ? '!' : '•'}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  {recommendation.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {recommendation.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 