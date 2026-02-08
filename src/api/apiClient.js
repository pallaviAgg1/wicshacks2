// API client for the custom Express backend (replaces Base44 SDK)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ============================================
// CROWD REPORT API
// ============================================

const CrowdReportAPI = {
  // List all active reports
  async filter(where = {}, orderBy = '-created_date', limit = 50) {
    const query = new URLSearchParams();
    
    if (where.status) {
      query.append('status', where.status);
    }
    
    query.append('limit', limit);
    query.append('offset', 0);
    
    const endpoint = `/api/entities/CrowdReport?${query.toString()}`;
    return apiCall(endpoint);
  },

  // Create a new report
  async create(data) {
    return apiCall('/api/entities/CrowdReport', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get single report
  async get(id) {
    return apiCall(`/api/entities/CrowdReport/${id}`);
  },

  // Update report
  async update(id, data) {
    return apiCall(`/api/entities/CrowdReport/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete report
  async delete(id) {
    return apiCall(`/api/entities/CrowdReport/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// SOS REQUEST API
// ============================================

const SOSRequestAPI = {
  // List all active SOS requests
  async filter(where = {}, orderBy = '-created_date', limit = 50) {
    const query = new URLSearchParams();
    
    if (where.status) {
      query.append('status', where.status);
    }
    
    query.append('limit', limit);
    query.append('offset', 0);
    
    const endpoint = `/api/entities/SOSRequest?${query.toString()}`;
    return apiCall(endpoint);
  },

  // Create a new SOS request
  async create(data) {
    return apiCall('/api/entities/SOSRequest', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get single SOS request
  async get(id) {
    return apiCall(`/api/entities/SOSRequest/${id}`);
  },

  // Update SOS request
  async update(id, data) {
    return apiCall(`/api/entities/SOSRequest/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete SOS request
  async delete(id) {
    return apiCall(`/api/entities/SOSRequest/${id}`, {
      method: 'DELETE',
    });
  },
};

// Export as compatible object (matches base44 SDK interface)
export const apiClient = {
  entities: {
    CrowdReport: CrowdReportAPI,
    SOSRequest: SOSRequestAPI,
  },
  health: async () => {
    return apiCall('/api/health');
  },
};

export default apiClient;
