import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    price: '99',
    period: 'month',
    description: 'Perfect for small businesses starting with blockchain escrow',
    features: [
      'Up to 10 escrow transactions/month',
      'Basic smart contract templates',
      'Email support',
      'Transaction fee: 1.5%',
      'Basic analytics dashboard',
    ],
    cta: 'Start Free Trial',
    featured: false,
  },
  {
    name: 'Professional',
    price: '299',
    period: 'month',
    description: 'Ideal for growing businesses with regular escrow needs',
    features: [
      'Up to 50 escrow transactions/month',
      'Advanced smart contract templates',
      'Priority support',
      'Transaction fee: 1%',
      'AI-powered dispute resolution',
      'Advanced analytics & reporting',
      'API access',
    ],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'year',
    description: 'For large organizations with custom requirements',
    features: [
      'Unlimited escrow transactions',
      'Custom smart contract development',
      'Dedicated account manager',
      'Custom transaction fees',
      'White-label solution',
      'Custom API integration',
      'Advanced security features',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
];

export default function Pricing() {
  return (
    <div className="bg-gray-50 py-8 md:py-12 px-2 sm:px-4 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Transparent Pricing for Your Business
        </h2>
        <p className="mt-4 text-xl text-gray-600">
          Choose the perfect plan to secure your global trade transactions
        </p>
      </div>

      {/* Early Adopter Banner */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-indigo-800">
                Early Adopter Incentive
              </h3>
              <p className="mt-2 text-sm text-indigo-700">
                Get 3 months free and 50% off transaction fees when you sign up for an annual plan.
                Limited time offer!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mt-12 md:mt-16 max-w-7xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
              plan.featured
                ? 'ring-2 ring-indigo-600 bg-white'
                : 'bg-white'
            }`}
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900">{plan.name}</h2>
              <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-base font-medium text-gray-500">
                  /{plan.period}
                </span>
              </p>
              <Link
                to="/register"
                className={`mt-8 block w-full bg-indigo-600 text-white text-center rounded-md py-2 font-semibold hover:bg-indigo-700 ${
                  plan.featured ? 'text-white' : ''
                }`}
              >
                {plan.cta}
              </Link>
            </div>
            <div className="pt-6 pb-8 px-6">
              <h3 className="text-xs font-semibold text-gray-900 tracking-wide uppercase">
                What's included
              </h3>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex space-x-3">
                    <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-500">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Enterprise Features */}
      <div className="max-w-7xl mx-auto mt-12 md:mt-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Why Choose BlockPort Global?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Blockchain Security</h3>
            <p className="text-gray-600">
              Leverage the power of blockchain for transparent, immutable transaction records and
              smart contracts.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">AI-Powered Dispute Resolution</h3>
            <p className="text-gray-600">
              Advanced machine learning algorithms help predict and prevent disputes before they occur.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Global Network</h3>
            <p className="text-gray-600">
              Connect with verified traders and logistics partners worldwide through our trusted network.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto mt-12 md:mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Global Trade?
        </h2>
        <p className="text-gray-600 mb-8">
          Join the future of secure, efficient international trade with BlockPort Global
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/register"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700"
          >
            Start Free Trial
          </Link>
          <Link
            to="/contact"
            className="bg-white text-indigo-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-50 border border-indigo-600"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  );
} 