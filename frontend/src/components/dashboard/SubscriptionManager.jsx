import React, { useState } from 'react';
import { CreditCardIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function SubscriptionManager() {
  const [currentPlan, setCurrentPlan] = useState({
    name: 'Professional',
    price: 299,
    period: 'month',
    nextBilling: '2024-03-15',
    status: 'active',
  });

  const [usage, setUsage] = useState({
    transactions: {
      used: 23,
      limit: 50,
    },
    storage: {
      used: 2.1,
      limit: 5,
    },
  });

  return (
    <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
      {/* Current Plan Overview */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Current Plan</h2>
            <p className="mt-1 text-sm text-gray-500">
              Your subscription renews on {currentPlan.nextBilling}
            </p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="mr-1 h-4 w-4" />
            Active
          </span>
        </div>

        <div className="mt-6">
          <div className="flex items-baseline">
            <h3 className="text-3xl font-bold text-gray-900">${currentPlan.price}</h3>
            <span className="ml-1 text-xl font-medium text-gray-500">/{currentPlan.period}</span>
          </div>
          <p className="mt-1 text-sm text-gray-500">{currentPlan.name} Plan</p>
        </div>

        {/* Usage Stats */}
        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Monthly Transactions</p>
              <p className="text-sm font-medium text-gray-900">
                {usage.transactions.used}/{usage.transactions.limit}
              </p>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-indigo-600 rounded-full"
                style={{
                  width: `${(usage.transactions.used / usage.transactions.limit) * 100}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">Storage Used (GB)</p>
              <p className="text-sm font-medium text-gray-900">
                {usage.storage.used}/{usage.storage.limit}
              </p>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-indigo-600 rounded-full"
                style={{
                  width: `${(usage.storage.used / usage.storage.limit) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
        <div className="mt-4 flex items-center">
          <CreditCardIcon className="h-8 w-8 text-gray-400" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
            <p className="text-sm text-gray-500">Expires 12/2024</p>
          </div>
          <button className="ml-auto text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Update
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Billing History</h3>
        <div className="mt-4 space-y-4">
          {[
            {
              date: '2024-02-15',
              amount: 299,
              status: 'Paid',
              invoice: 'INV-2024-002',
            },
            {
              date: '2024-01-15',
              amount: 299,
              status: 'Paid',
              invoice: 'INV-2024-001',
            },
          ].map((invoice) => (
            <div
              key={invoice.invoice}
              className="flex items-center justify-between text-sm"
            >
              <div>
                <p className="font-medium text-gray-900">{invoice.date}</p>
                <p className="text-gray-500">{invoice.invoice}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">${invoice.amount}</p>
                <p className="text-green-600">{invoice.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-6">
        <div className="flex space-x-4">
          <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Upgrade Plan
          </button>
          <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
            Download Invoices
          </button>
        </div>
        <button className="mt-4 w-full text-gray-500 text-sm hover:text-gray-700">
          Cancel Subscription
        </button>
      </div>
    </div>
  );
} 