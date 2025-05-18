import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function Home() {
  // Carousel auto-scroll logic
  const carouselRef = useRef(null);
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    let scrollStep = 1;
    let resetTimeout;
    const scroll = () => {
      if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
        carousel.scrollLeft = 0;
      } else {
        carousel.scrollLeft += scrollStep;
      }
      resetTimeout = setTimeout(scroll, 20);
    };
    scroll();
    return () => clearTimeout(resetTimeout);
  }, []);

  const clients = [
    { name: 'Acme Corp', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/airbnb.svg' },
    { name: 'Globex', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/google.svg' },
    { name: 'Initech', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/amazon.svg' },
    { name: 'Umbrella', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/microsoft.svg' },
    { name: 'Wayne Enterprises', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/netflix.svg' },
    { name: 'Stark Industries', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tesla.svg' },
    { name: 'Wonka', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/spotify.svg' },
    { name: 'Hooli', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/slack.svg' },
    { name: 'Soylent', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg' },
    { name: 'Cyberdyne', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/zoom.svg' },
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-indigo-700 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">BlockPort Global</h1>
          <p className="text-lg md:text-2xl mb-6 max-w-2xl text-gray-100 font-medium">
            The all-in-one escrow and smart contract platform for global trade.<br />
            <span className="text-gray-200">Secure, transparent, and seamless transactions for importers, exporters, and logistics providers worldwide.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-full shadow hover:bg-indigo-50 hover:text-indigo-900 transition-all duration-200">Get Started</Link>
            <Link to="/pricing" className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-full shadow hover:bg-indigo-700 transition-all duration-200">View Pricing</Link>
          </div>
        </div>
      </header>

      {/* Why BlockPort Global */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Why BlockPort Global?</h2>
          <div className="mx-auto mb-10 w-24 h-1 bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full"></div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-indigo-100">
                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 01-1.4.8H6a1.65 1.65 0 01-1.4-.8L2 12V7a2 2 0 012-2h16a2 2 0 012 2v5l-2.6 3z" /></svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Blockchain Security</h3>
              <p className="text-gray-600">Enjoy unmatched security with blockchain-powered escrow services. Immutable transaction records and smart contracts ensure trust and transparency.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-indigo-100">
                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h3m4 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Fast and Efficient</h3>
              <p className="text-gray-600">Accelerate your trade transactions. Reduce delays and paperwork by digitizing your escrow management.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-indigo-100">
                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 0h-1v4h-1m-4 0h-1v-4h-1" /></svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Simplified Management</h3>
              <p className="text-gray-600">Intuitive dashboards and easy-to-use tools to manage contracts, payments, and trade operations seamlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How BlockPort Works */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">How BlockPort Works</h2>
          <div className="mx-auto mb-10 w-24 h-1 bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full"></div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">1</div>
              <h4 className="font-semibold mb-2 text-gray-900">Create a Contract</h4>
              <p className="text-gray-600">Easily initiate contracts between trade parties using simple templates.</p>
            </div>
            <div>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">2</div>
              <h4 className="font-semibold mb-2 text-gray-900">Secure Funds in Escrow</h4>
              <p className="text-gray-600">Funds are held securely in blockchain-powered escrow, protecting all parties involved.</p>
            </div>
            <div>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">3</div>
              <h4 className="font-semibold mb-2 text-gray-900">Verify & Release</h4>
              <p className="text-gray-600">Once contract conditions are fulfilled, funds are transparently released to the designated recipient.</p>
            </div>
            <div>
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">4</div>
              <h4 className="font-semibold mb-2 text-gray-900">Detailed Audit Trails</h4>
              <p className="text-gray-600">Automatic blockchain tracking provides immutable records and audit trails for all transactions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is BlockPort Global For */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Who Is BlockPort Global For?</h2>
          <div className="mx-auto mb-10 w-24 h-1 bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Importers & Exporters</h3>
              <p className="text-gray-600">Simplify international transactions with secure escrow management.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Logistics Providers</h3>
              <p className="text-gray-600">Reduce risks, accelerate payments, and improve operational efficiency.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">E-Commerce & Marketplaces</h3>
              <p className="text-gray-600">Secure high-value transactions effortlessly.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Real Estate Transactions</h3>
              <p className="text-gray-600">Trusted escrow management for high-value property transactions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Clients Carousel */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-indigo-700 to-blue-600">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">Our Clients</h2>
          <div
            ref={carouselRef}
            className="flex overflow-x-auto md:overflow-x-hidden gap-8 py-4 relative scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-gray-100"
            style={{ scrollBehavior: 'smooth' }}
          >
            {[...clients, ...clients].map((client, idx) => (
              <div key={client.name + idx} className="flex flex-col items-center min-w-[120px]">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow mb-2">
                  <img src={client.logo} alt={client.name} className="w-12 h-12 object-contain" />
                </div>
                <span className="font-semibold text-white text-base mt-2">{client.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Sales Inquiry */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Enterprise Sales Inquiry</h2>
          <p className="mb-6 text-gray-700">Interested in customized solutions or bulk services? Contact our enterprise team for tailored solutions.</p>
          <Link to="/contact" className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-full shadow hover:bg-indigo-700 transition">Contact Enterprise Team</Link>
        </div>
      </section>

      {/* Feature Highlights: Subscription Management & Analytics */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center flex flex-col items-center">
              <h3 className="font-semibold text-xl mb-2 text-gray-900">Subscription Management</h3>
              <p className="mb-4 text-gray-600">Easily manage your subscriptions, billing history, and payment details directly from your user dashboard.</p>
              <Link to="/dashboard" className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-full shadow hover:bg-indigo-700 transition">Go to Dashboard</Link>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center flex flex-col items-center">
              <h3 className="font-semibold text-xl mb-2 text-gray-900">Analytics & Insights</h3>
              <p className="mb-4 text-gray-600">Gain powerful insights from advanced analytics and reports to optimize your global trade transactions and business performance.</p>
              <Link to="/dashboard" className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-full shadow hover:bg-indigo-700 transition">View Analytics</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Stay Updated</h2>
          <p className="mb-6 text-gray-700">Subscribe to our newsletter to receive the latest updates, insights, and innovations in global trade and escrow solutions.</p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input type="email" placeholder="Your Email Address" className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto placeholder:text-gray-400" />
            <button type="submit" className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-full shadow hover:bg-indigo-700 transition">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold text-white">© 2025 BlockPort Global. All rights reserved.</span>
          </div>
          <nav className="flex space-x-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/pricing" className="hover:text-white">Pricing</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
            <Link to="/login" className="hover:text-white">Login</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
} 