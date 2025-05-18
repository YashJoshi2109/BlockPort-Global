import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DocumentIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { contractAPI } from '../../services/api';
import { useAnalytics } from '../../hooks/useAnalytics';

export default function ContractManager() {
  const [selectedContract, setSelectedContract] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateRange: 'all',
  });
  const { events } = useAnalytics();
  const queryClient = useQueryClient();

  // Fetch contracts
  const { data: contracts, isLoading } = useQuery(
    ['contracts', filters],
    () => contractAPI.getContracts(filters),
    {
      select: (data) => data.data,
    }
  );

  // Fetch contract templates
  const { data: templates } = useQuery(
    ['contractTemplates'],
    () => contractAPI.getContractTemplates(),
    {
      select: (data) => data.data,
    }
  );

  // Create contract mutation
  const createContractMutation = useMutation(
    (data) => contractAPI.createContract(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['contracts']);
        events.createContract('standard');
      },
    }
  );

  // Sign contract mutation
  const signContractMutation = useMutation(
    (id) => contractAPI.signContract(id),
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries(['contracts']);
        events.signContract(id);
      },
    }
  );

  // Delete contract mutation
  const deleteContractMutation = useMutation(
    (id) => contractAPI.deleteContract(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['contracts']);
      },
    }
  );

  const handleCreateContract = async (data) => {
    try {
      await createContractMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error creating contract:', error);
    }
  };

  const handleSignContract = async (id) => {
    try {
      await signContractMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error signing contract:', error);
    }
  };

  const handleDeleteContract = async (id) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      try {
        await deleteContractMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting contract:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search contracts..."
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
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
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

      {/* Create New Contract */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Contract</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates?.map((template) => (
            <div
              key={template.id}
              className="border rounded-lg p-4 hover:border-indigo-500 cursor-pointer"
              onClick={() => handleCreateContract({ templateId: template.id })}
            >
              <DocumentIcon className="h-8 w-8 text-indigo-600 mb-2" />
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-gray-500">{template.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contracts List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
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
              ) : contracts?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    No contracts found
                  </td>
                </tr>
              ) : (
                contracts?.map((contract) => (
                  <tr key={contract.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DocumentIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {contract.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {contract.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          contract.status
                        )}`}
                      >
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(contract.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${contract.value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSignContract(contract.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          disabled={contract.status !== 'pending'}
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setSelectedContract(contract)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteContract(contract.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Contracts</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {contracts?.length || 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Active Contracts</div>
          <div className="mt-1 text-2xl font-semibold text-green-600">
            {contracts?.filter((c) => c.status === 'active').length || 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Pending Signatures</div>
          <div className="mt-1 text-2xl font-semibold text-yellow-600">
            {contracts?.filter((c) => c.status === 'pending').length || 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Value</div>
          <div className="mt-1 text-2xl font-semibold text-indigo-600">
            ${contracts?.reduce((sum, c) => sum + c.value, 0).toLocaleString() || 0}
          </div>
        </div>
      </div>
    </div>
  );
} 