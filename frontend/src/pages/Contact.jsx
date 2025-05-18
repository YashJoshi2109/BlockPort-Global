import React, { useState } from 'react';
import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    employees: '',
    message: '',
    subscribe: true,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement form submission to backend
    setSubmitted(true);
  };

  const employeeRanges = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+',
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Enterprise Solutions & Support
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Get in touch with our sales team to discuss your custom requirements
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white/90 rounded-lg shadow-xl ring-1 ring-gray-200 p-4 sm:p-8">
            {submitted ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                  Thank you for your interest!
                </h2>
                <p className="text-gray-600">
                  Our enterprise team will contact you within 24 hours to discuss your requirements.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      aria-label="First Name"
                      required
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 transition-all autofill:!bg-white bg-white placeholder:text-gray-400"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      aria-label="Last Name"
                      required
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 transition-all autofill:!bg-white bg-white placeholder:text-gray-400"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Business Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    aria-label="Business Email"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 transition-all autofill:!bg-white bg-white placeholder:text-gray-400"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    id="company"
                    aria-label="Company Name"
                    required
                    autoComplete="organization"
                    value={formData.company}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 transition-all autofill:!bg-white bg-white placeholder:text-gray-400"
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    aria-label="Phone Number"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 transition-all autofill:!bg-white bg-white placeholder:text-gray-400"
                    placeholder="Phone Number"
                  />
                </div>

                <div>
                  <label htmlFor="employees" className="block text-sm font-medium text-gray-700">
                    Number of Employees
                  </label>
                  <select
                    name="employees"
                    id="employees"
                    aria-label="Number of Employees"
                    required
                    value={formData.employees}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 transition-all autofill:!bg-white bg-white text-gray-700 placeholder:text-gray-400"
                  >
                    <option value="">Select range</option>
                    {employeeRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Tell us about your requirements
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    aria-label="Tell us about your requirements"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 transition-all autofill:!bg-white bg-white placeholder:text-gray-400 text-black text-lg selection:bg-indigo-200 selection:text-black focus:bg-gray-100"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="subscribe"
                    id="subscribe"
                    aria-label="Subscribe to updates"
                    checked={formData.subscribe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="subscribe" className="ml-2 block text-sm text-gray-700">
                    Keep me updated about new features and announcements
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                >
                  Contact Sales Team
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-4 sm:p-8 mt-8 lg:mt-0">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Why Choose Enterprise?
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <BuildingOfficeIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Dedicated Support</h3>
                    <p className="mt-2 text-gray-600">
                      Get a dedicated account manager and 24/7 priority support for your business
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <GlobeAltIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Custom Integration</h3>
                    <p className="mt-2 text-gray-600">
                      Custom API integration and white-label solutions for your specific needs
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <PhoneIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Contact Us</h3>
                    <p className="mt-2 text-gray-600">
                      Mon-Fri from 8am to 8pm
                    </p>
                    <p className="mt-1 text-indigo-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <EnvelopeIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                    <p className="mt-2 text-gray-600">
                      For general inquiries
                    </p>
                    <p className="mt-1 text-indigo-600">enterprise@blockportglobal.com</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Our Office Location</h3>
                <div className="w-full h-64 rounded-lg overflow-hidden shadow mt-4">
                  <iframe
                    title="BlockPort Global Office Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353159047!3d-37.8162797420217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1f0f7b1%3A0x5045675218ce6e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1620211234567!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 