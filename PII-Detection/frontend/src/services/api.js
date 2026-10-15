import { authService } from './auth.js';

const API_BASE = '/api';

async function fetchWithAuth(url, options = {}) {
  const token = await authService.getToken();
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If not FormData, default content-type to application/json
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Health & System Info
  async checkHealth() {
    return fetchWithAuth('/health');
  },

  // Scanning APIs
  async scanText(text, fileName = 'Pasted Text Scan', options = {}) {
    return fetchWithAuth('/scan/text', {
      method: 'POST',
      body: JSON.stringify({ text, fileName, options })
    });
  },

  async scanDocument(file, onProgress) {
    const formData = new FormData();
    formData.append('document', file);

    const token = await authService.getToken();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}/scan/document`);

      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        try {
          const response = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(response);
          } else {
            reject(new Error(response.error || `Upload failed with status ${xhr.status}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during file upload. Check server connectivity.'));
      };

      xhr.send(formData);
    });
  },

  // History APIs
  async getScans() {
    return fetchWithAuth('/scans');
  },

  async getScanById(id) {
    return fetchWithAuth(`/scans/${id}`);
  },

  async deleteScan(id) {
    return fetchWithAuth(`/scans/${id}`, {
      method: 'DELETE'
    });
  },

  // Dashboard Stats API
  async getDashboardStats() {
    return fetchWithAuth('/dashboard/stats');
  },

  // Settings APIs
  async getSettings() {
    return fetchWithAuth('/settings');
  },

  async updateSettings(settings) {
    return fetchWithAuth('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }
};
