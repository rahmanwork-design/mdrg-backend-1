// API URL Configuration
// ======================
// Option 1 - Local development: 'http://localhost:3001/api'
// Option 2 - ngrok tunnel: 'https://your-ngrok-url.ngrok-free.app/api'
// Option 3 - Render deploy: 'https://your-render-app.onrender.com/api'
// Option 4 - Your public IP: 'http://YOUR_PUBLIC_IP:3001/api'

// Using Render backend - production deployment
const API_BASE_URL = 'https://mdrg-backend-1.onrender.com/api';

// Helper to get auth token from localStorage
const getToken = () => localStorage.getItem('mdrg_token');

// Generic API request function
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  // Add auth token if available
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  register: (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    company_name?: string;
    phone?: string;
    address?: string;
    city?: string;
    postcode?: string;
  }) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (email: string, password: string) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),

  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),

  getProfile: () => apiRequest('/auth/profile'),

  updateProfile: (profileData: {
    first_name?: string;
    last_name?: string;
    company_name?: string;
    phone?: string;
    address?: string;
    city?: string;
    postcode?: string;
  }) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),

  changePassword: (current_password: string, new_password: string) => 
    apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ current_password, new_password }),
    }),

  forgotPassword: (email: string) => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
};

// Client API
export const clientAPI = {
  getAll: () => apiRequest('/clients'),

  getById: (clientId: string) => apiRequest(`/clients/${clientId}`),

  getCases: (clientId: string) => apiRequest(`/clients/${clientId}/cases`),

  createCase: (clientId: string, caseData: {
    debtor_name: string;
    debtor_company?: string;
    debtor_email?: string;
    debtor_phone?: string;
    debtor_address?: string;
    amount_owed: number;
    currency?: string;
    debt_type?: string;
    description?: string;
    priority?: string;
  }) => apiRequest(`/clients/${clientId}/cases`, {
    method: 'POST',
    body: JSON.stringify(caseData),
  }),

  getCaseDetails: (clientId: string, caseId: string) => 
    apiRequest(`/clients/${clientId}/cases/${caseId}`),

  getStats: (clientId: string) => apiRequest(`/clients/${clientId}/stats`),

  updateStatus: (clientId: string, status: string) => 
    apiRequest(`/clients/${clientId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => apiRequest('/dashboard/stats'),
  getRecentActivity: () => apiRequest('/activity/recent'),
};

// Health check
export const healthCheck = () => apiRequest('/health');

// Storage helpers
export const storage = {
  setToken: (token: string) => localStorage.setItem('mdrg_token', token),
  getToken: () => localStorage.getItem('mdrg_token'),
  removeToken: () => localStorage.removeItem('mdrg_token'),
  
  setUser: (user: any) => localStorage.setItem('mdrg_user', JSON.stringify(user)),
  getUser: () => {
    const user = localStorage.getItem('mdrg_user');
    return user ? JSON.parse(user) : null;
  },
  removeUser: () => localStorage.removeItem('mdrg_user'),
  
  clear: () => {
    localStorage.removeItem('mdrg_token');
    localStorage.removeItem('mdrg_user');
  },
};

export default apiRequest;
