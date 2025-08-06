import { ApiResponse, AuthResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}/api${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async register(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  // Session methods
  async getSessions() {
    return this.request('/sessions');
  }

  async getMySessions() {
    return this.request('/my-sessions');
  }

  async getMySession(id: string) {
    return this.request(`/my-sessions/${id}`);
  }

  async saveDraft(sessionData: Record<string, unknown>) {
    return this.request('/my-sessions/save-draft', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    });
  }

  async publishSession(sessionData: Record<string, unknown>) {
    return this.request('/my-sessions/publish', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    });
  }

  async deleteSession(id: string) {
    return this.request(`/my-sessions/${id}`, {
      method: 'DELETE'
    });
  }
}

export const apiClient = new ApiClient();
