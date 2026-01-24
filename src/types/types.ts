/**
 * SHARED TYPES FOR FLIP SAVVY
 * Used by both Frontend (Next.js/Capacitor) and Backend (Express)
 */

// --- User Types ---

export type SubscriptionStatus = "basic" | "hobby" | "pro" | "business";
export type PaymentProvider = "stripe" | "apple" | "google" | "none";

export interface User {
  id: string;
  email: string;
  subscriptionStatus: SubscriptionStatus;
  darkMode: boolean;
  
  // Usage tracking
  dailyScansCount: number;
  lastScanDate: string;

  // Billing
  paymentProvider: PaymentProvider;
  providerCustomerId?: string;
  providerSubscriptionId?: string;
  subscriptionEndDate?: string | Date; // Date is often stringified in JSON responses
  cancelAtPeriodEnd: boolean;

  // Status
  isVerified: boolean;
  isActive: boolean;
  
  // Timestamps (Sequelize adds these automatically)
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// --- Search History Types ---

export interface SearchHistory {
  id: number;
  userId: string;
  itemTitle: string;
  priceRange: string;
  description?: string;
  imageUrl?: string;
  platform?: string;
  grade?: string;
  estimatedShippingCost?: string;
  inInventory: boolean;
  quantity: number;
  purchasePrice: number;
  
  // JSON fields from Sequelize
  specs: Record<string, any>;
  sources: any[]; 
  
  // Timestamps
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// --- API Response Wrappers ---
// Useful for keeping your fetch calls consistent

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}