import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
  });
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Only show consent if it hasn't been set before
      const hasSetPreferences = localStorage.getItem('hasSetPreferences');
      if (!hasSetPreferences) {
        setShowConsent(true);
      }
    } else {
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(newPreferences);
  };

  const handleAcceptSelected = () => {
    savePreferences(preferences);
  };

  const savePreferences = (newPreferences) => {
    try {
      localStorage.setItem('cookieConsent', JSON.stringify(newPreferences));
      localStorage.setItem('hasSetPreferences', 'true');
      setShowConsent(false);
      setShowPreferences(false);

      // Update Google Analytics settings if available
      if (window.gtag) {
        try {
          window.gtag('consent', 'update', {
            analytics_storage: newPreferences.analytics ? 'granted' : 'denied',
            ad_storage: newPreferences.marketing ? 'granted' : 'denied',
          });
        } catch (error) {
          console.error('Error updating analytics consent:', error);
        }
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto p-6">
        {!showPreferences ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="mb-4 md:mb-0 md:mr-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                We value your privacy
              </h3>
              <p className="text-gray-600 text-sm">
                We use cookies to enhance your browsing experience, serve personalized
                content, and analyze our traffic. By clicking "Accept All", you consent
                to our use of cookies.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowPreferences(true)}
                className="text-indigo-600 hover:text-indigo-900 font-medium"
              >
                Cookie Settings
              </button>
              <button
                onClick={handleAcceptAll}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Cookie Preferences
              </h3>
              <p className="text-gray-600 text-sm">
                Manage your cookie preferences below. Some cookies are necessary for
                the website to function and cannot be disabled.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Necessary Cookies
                  </h4>
                  <p className="text-xs text-gray-500">
                    Required for the website to function properly
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Analytics Cookies
                  </h4>
                  <p className="text-xs text-gray-500">
                    Help us improve our website by collecting usage information
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Marketing Cookies
                  </h4>
                  <p className="text-xs text-gray-500">
                    Used to deliver personalized advertisements
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) =>
                    setPreferences({ ...preferences, marketing: e.target.checked })
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPreferences(false)}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Back
              </button>
              <button
                onClick={handleAcceptSelected}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 