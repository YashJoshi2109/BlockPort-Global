import React, { useState } from 'react';
import toast from 'react-hot-toast';
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
    toast.loading('Sending your message...', { id: 'contact' });
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Message sent successfully! Our team will contact you within 24 hours.', { id: 'contact' });
      setSubmitted(true);
    }, 1500);
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
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Enterprise Solutions & Support
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our sales team to discuss your custom requirements and discover how BlockPort Global can transform your business
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                  Thank you for your interest!
                </h2>
                <p className="text-gray-600">
                  Our enterprise team will contact you within 24 hours to discuss your requirements.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h2>
                  <p className="text-gray-600">Fill out the form below and we'll get back to you shortly.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white placeholder:text-gray-400"
                        placeholder="First Name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white placeholder:text-gray-400"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white placeholder:text-gray-400"
                      placeholder="you@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white placeholder:text-gray-400"
                      placeholder="Company Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white placeholder:text-gray-400"
                      placeholder="Phone Number"
                    />
                  </div>

                  <div>
                    <label htmlFor="employees" className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Employees
                    </label>
                    <select
                      name="employees"
                      id="employees"
                      aria-label="Number of Employees"
                      required
                      value={formData.employees}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white text-gray-700"
                    >
                      <option value="">Select range</option>
                      {employeeRanges.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="block w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white placeholder:text-gray-400 resize-none"
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
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="subscribe" className="ml-3 block text-sm text-gray-700">
                      Keep me updated about new features and announcements
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-6 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-xl"
                  >
                    Contact Sales Team
                  </button>
                </form>
              </>
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