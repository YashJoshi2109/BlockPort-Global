import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Initialize analytics (you can replace this with your preferred analytics service)
const initializeAnalytics = () => {
  // Example: Initialize Google Analytics
  // window.dataLayer = window.dataLayer || [];
  // function gtag(){dataLayer.push(arguments);}
  // gtag('js', new Date());
  // gtag('config', 'YOUR-GA-ID');
};

export const useAnalytics = () => {
  const location = useLocation();

  // Track page views
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  const trackPageView = (path) => {
    // Example: Track page view
    console.log("Page View:", path);
    // gtag('event', 'page_view', {
    //   page_path: path,
    // });
  };

  const trackEvent = (category, action, label = null, value = null) => {
    // Example: Track custom event
    console.log("Event:", { category, action, label, value });
    // gtag('event', action, {
    //   event_category: category,
    //   event_label: label,
    //   value: value,
    // });
  };

  const trackConversion = (type, value = 0) => {
    // Example: Track conversion
    console.log("Conversion:", { type, value });
    // gtag('event', 'conversion', {
    //   send_to: 'YOUR-CONVERSION-ID',
    //   value: value,
    //   currency: 'USD',
    // });
  };

  // Predefined events for common actions
  const events = {
    // Authentication events
    signup: (method) => trackEvent("Auth", "Sign Up", method),
    login: (method) => trackEvent("Auth", "Login", method),

    // Subscription events
    viewPricing: () => trackEvent("Subscription", "View Pricing"),
    selectPlan: (plan) => trackEvent("Subscription", "Select Plan", plan),
    startTrial: (plan) => trackEvent("Subscription", "Start Trial", plan),
    subscribe: (plan, value) => {
      trackEvent("Subscription", "Subscribe", plan, value);
      trackConversion("subscription", value);
    },

    // Contract events
    createContract: (type) => trackEvent("Contract", "Create", type),
    signContract: (id) => trackEvent("Contract", "Sign", id),

    // Escrow events
    createEscrow: (value) => trackEvent("Escrow", "Create", null, value),
    releaseEscrow: (id) => trackEvent("Escrow", "Release", id),

    // Feature usage
    useFeature: (feature) => trackEvent("Feature", "Use", feature),

    // Error tracking
    error: (type, message) => trackEvent("Error", type, message),
  };

  return {
    trackPageView,
    trackEvent,
    trackConversion,
    events,
  };
};

// Analytics Provider Component
export const initAnalytics = () => {
  useEffect(() => {
    initializeAnalytics();
  }, []);

  return null;
};
