// Google Analytics Configuration
export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || null;

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_TRACKING_ID) {
    console.log("Google Analytics is disabled - no tracking ID provided");
    return;
  }

  try {
    // Load Google Analytics Script
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    script.async = true;
    script.onerror = () => {
      console.log(
        "Analytics blocked or failed to load - continuing without analytics"
      );
    };
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", GA_TRACKING_ID, {
      page_path: window.location.pathname,
    });

    // Set default consent state
    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
    });
  } catch (error) {
    console.log("Failed to initialize analytics:", error);
  }
};

// Track Page Views
export const pageview = (url) => {
  if (!window.gtag) return;
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

// Track Events
export const event = ({ action, category, label, value }) => {
  if (!window.gtag) return;
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Predefined Events
export const events = {
  // User Events
  userRegistered: (method) =>
    event({
      action: "sign_up",
      category: "User",
      label: method,
    }),

  userLoggedIn: (method) =>
    event({
      action: "login",
      category: "User",
      label: method,
    }),

  // Subscription Events
  subscriptionStarted: (plan, value) =>
    event({
      action: "begin_subscription",
      category: "Subscription",
      label: plan,
      value: value,
    }),

  subscriptionUpgraded: (fromPlan, toPlan, value) =>
    event({
      action: "upgrade_subscription",
      category: "Subscription",
      label: `${fromPlan}_to_${toPlan}`,
      value: value,
    }),

  subscriptionCancelled: (plan, reason) =>
    event({
      action: "cancel_subscription",
      category: "Subscription",
      label: `${plan}_${reason}`,
    }),

  // Contract Events
  contractCreated: (type, value) =>
    event({
      action: "create_contract",
      category: "Contract",
      label: type,
      value: value,
    }),

  contractSigned: (id) =>
    event({
      action: "sign_contract",
      category: "Contract",
      label: id,
    }),

  // Escrow Events
  escrowCreated: (value) =>
    event({
      action: "create_escrow",
      category: "Escrow",
      label: "new",
      value: value,
    }),

  escrowCompleted: (id, value) =>
    event({
      action: "complete_escrow",
      category: "Escrow",
      label: id,
      value: value,
    }),

  escrowDisputed: (id, reason) =>
    event({
      action: "dispute_escrow",
      category: "Escrow",
      label: `${id}_${reason}`,
    }),

  // Feature Usage Events
  featureUsed: (feature) =>
    event({
      action: "use_feature",
      category: "Feature",
      label: feature,
    }),

  // Error Events
  errorOccurred: (type, message) =>
    event({
      action: "error",
      category: "Error",
      label: `${type}_${message}`,
    }),

  // Sales/Contact Events
  contactFormSubmitted: (type) =>
    event({
      action: "submit_contact",
      category: "Sales",
      label: type,
    }),

  demoRequested: (company) =>
    event({
      action: "request_demo",
      category: "Sales",
      label: company,
    }),

  // Document Events
  documentUploaded: (type) =>
    event({
      action: "upload_document",
      category: "Document",
      label: type,
    }),

  documentShared: (type) =>
    event({
      action: "share_document",
      category: "Document",
      label: type,
    }),

  // Support Events
  supportTicketCreated: (type) =>
    event({
      action: "create_ticket",
      category: "Support",
      label: type,
    }),

  supportTicketResolved: (type, duration) =>
    event({
      action: "resolve_ticket",
      category: "Support",
      label: type,
      value: duration,
    }),
};

// Conversion Tracking
export const trackConversion = (type, value) => {
  if (!window.gtag) return;
  window.gtag("event", "conversion", {
    send_to: `${GA_TRACKING_ID}/${type}`,
    value: value,
    currency: "USD",
  });
};

// Enhanced Measurement
export const trackEnhancedEcommerce = {
  viewItem: (item) => {
    if (!window.gtag) return;
    window.gtag("event", "view_item", {
      currency: "USD",
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          price: item.price,
        },
      ],
    });
  },

  addToCart: (item) => {
    if (!window.gtag) return;
    window.gtag("event", "add_to_cart", {
      currency: "USD",
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          price: item.price,
          quantity: 1,
        },
      ],
    });
  },

  beginCheckout: (items, value) => {
    if (!window.gtag) return;
    window.gtag("event", "begin_checkout", {
      currency: "USD",
      items: items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: item.quantity,
      })),
      value: value,
    });
  },

  purchase: (transaction) => {
    if (!window.gtag) return;
    window.gtag("event", "purchase", {
      transaction_id: transaction.id,
      value: transaction.value,
      currency: "USD",
      items: transaction.items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  },
};
