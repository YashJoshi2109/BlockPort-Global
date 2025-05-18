import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CurrencyDollarIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { escrowAPI } from '../../services/api';
import { useAnalytics } from '../../hooks/useAnalytics';

export default function EscrowManager() {
  const [selectedEscrow, setSelectedEscrow] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateRange: 'all',
  });
  const { events } = useAnalytics();
  const queryClient = useQueryClient();

  // Fetch escrows
  const { data: escrows, isLoading } = useQuery(
    ['escrows', filters],
    () => escrowAPI.getEscrows(filters),
    {
      select: (data) => data.data,
    }
  );

  // Create escrow mutation
  const createEscrowMutation = useMutation(
    (data) => escrowAPI.createEscrow(data),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['escrows']);
        events.createEscrow(variables.amount);
      },
    }
  );

  // Release funds mutation
  const releaseFundsMutation = useMutation(
    (id) => escrowAPI.releaseFunds(id),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries(['escrows']);
        events.releaseEscrow(id);
      },
    }
  );

  // Dispute escrow mutation
  const disputeEscrowMutation = useMutation(
    ({ id, reason }) => escrowAPI.disputeEscrow(id, reason),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['escrows']);
      },
    }
  );

  const handleCreateEscrow = async (data) => {
    try {
      await createEscrowMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error creating escrow:', error);
    }
  };

  const handleReleaseFunds = async (id) => {
    if (window.confirm('Are you sure you want to release the funds?')) {
      try {
        await releaseFundsMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error releasing funds:', error);
      }
    }
  };

  const handleDisputeEscrow = async (id) => {
    const reason = window.prompt('Please provide a reason for the dispute:');
    if (reason) {
      try {
        await disputeEscrowMutation.mutateAsync({ id, reason });
      } catch (error) {
        console.error('Error disputing escrow:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'secured':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      case 'released':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Create New Escrow */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Escrow</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleCreateEscrow({
              amount: parseFloat(formData.get('amount')),
              currency: formData.get('currency'),
              description: formData.get('description'),
            });
            e.target.reset();
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <select
              name="currency"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="ETH">ETH</option>
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Create Escrow
            </button>
          </div>
        </form>
      </div>

      {/* Escrow List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search escrows..."
              className="border rounded-md px-3 py-2"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <select
              className="border rounded-md px-3 py-2"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="secured">Secured</option>
              <option value="pending">Pending</option>
              <option value="disputed">Disputed</option>
              <option value="released">Released</option>
            </select>
            <select
              className="border rounded-md px-3 py-2"
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID & Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : escrows?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    No escrows found
                  </td>
                </tr>
              ) : (
                escrows?.map((escrow) => (
                  <tr key={escrow.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <LockClosedIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{escrow.id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {escrow.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {escrow.amount} {escrow.currency}
                      </div>
                      <div className="text-sm text-gray-500">
                        ≈ ${escrow.usdValue}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          escrow.status
                        )}`}
                      >
                        {escrow.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(escrow.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {escrow.status === 'secured' && (
                          <button
                            onClick={() => handleReleaseFunds(escrow.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <ShieldCheckIcon className="h-5 w-5" />
                          </button>
                        )}
                        {['secured', 'pending'].includes(escrow.status) && (
                          <button
                            onClick={() => handleDisputeEscrow(escrow.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <ExclamationTriangleIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Escrow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Escrows</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {escrows?.length || 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Active Value Secured</div>
          <div className="mt-1 text-2xl font-semibold text-green-600">
            ${escrows
              ?.filter((e) => e.status === 'secured')
              .reduce((sum, e) => sum + e.usdValue, 0)
              .toLocaleString() || 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Pending Release</div>
          <div className="mt-1 text-2xl font-semibold text-yellow-600">
            {escrows?.filter((e) => e.status === 'pending').length || 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Successful Releases</div>
          <div className="mt-1 text-2xl font-semibold text-indigo-600">
            {escrows?.filter((e) => e.status === 'released').length || 0}
          </div>
        </div>
      </div>
    </div>
  );
} 