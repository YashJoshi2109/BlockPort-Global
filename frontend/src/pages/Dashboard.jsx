import { useState } from 'react';
import useAuthStore from '../stores/auth';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuthStore();

  // Mock data - replace with actual API calls
  const userData = {
    name: user?.email?.split('@')[0] || 'User',
    activeContracts: 4,
    pendingTransactions: 2,
  };

  const recentActivities = [
    {
      id: 456,
      type: 'contract',
      action: 'initiated',
      status: 'Awaiting Payment',
      timestamp: new Date().toISOString(),
    },
    {
      id: 789,
      type: 'escrow',
      action: 'completed',
      status: 'Funds Released',
      timestamp: new Date().toISOString(),
    },
  ];

  const contracts = [
    {
      id: '123',
      title: 'Web Dev',
      status: 'Active',
      dateCreated: '2024-05-14',
    },
    {
      id: '124',
      title: 'Real Estate',
      status: 'Completed',
      dateCreated: '2024-05-10',
    },
  ];

  const escrowTransaction = {
    id: '789',
    amount: '1.5 ETH',
    status: 'Funds Secured',
    releaseCondition: 'Project Completion Verified',
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 px-2 sm:py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Welcome, {userData.name}</h1>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-indigo-700">Active Contracts</p>
              <p className="text-2xl font-bold text-indigo-900">{userData.activeContracts}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-indigo-700">Pending Escrow Transactions</p>
              <p className="text-2xl font-bold text-indigo-900">{userData.pendingTransactions}</p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4">
                <div>
                  <p className="text-gray-900 text-sm sm:text-base">
                    {activity.type === 'contract' ? 'Contract' : 'Escrow'} #{activity.id} {activity.action}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">Status: {activity.status}</p>
                </div>
                <span className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-0">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <button className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 text-base sm:text-lg">
            <span>Create New Contract</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 text-base sm:text-lg">
            <span>Manage Existing Contracts</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 text-base sm:text-lg">
            <span>View Reports</span>
          </button>
        </div>

        {/* Contracts Table */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Recent Contracts</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
              <thead>
                <tr>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract ID</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contracts.map((contract) => (
                  <tr key={contract.id}>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">#{contract.id}</td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">{contract.title}</td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${contract.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{contract.status}</span>
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">{contract.dateCreated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Escrow Transaction Details */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Escrow Transaction #{escrowTransaction.id}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500">Amount</p>
              <p className="text-xl font-semibold">{escrowTransaction.amount}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500">Status</p>
              <p className="text-xl font-semibold flex items-center">{escrowTransaction.status} <span className="ml-2">✅</span></p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500">Release Condition</p>
              <p className="text-xl font-semibold">{escrowTransaction.releaseCondition}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Release Funds</button>
            <button className="w-full sm:w-auto flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"><span>Raise Dispute</span></button>
          </div>
        </div>
      </main>
    </div>
  );
} 