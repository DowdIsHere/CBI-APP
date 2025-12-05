import {
  ApiResponse,
  LoginCredentials,
  RegisterData,
  User,
  UserProfile,
} from '../types';
import { AuthStorage, UserStorage, clearAllData } from './storage';

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.cbi-app.com';

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Helper for API requests
async function authRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP error ${response.status}`,
      };
    }

    return { success: true, data };
  } catch (error) {
    // For development, simulate successful auth
    console.log('Auth API not available, using mock auth');
    return {
      success: false,
      error: 'Network error - using offline mode',
    };
  }
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Auth Service
export const AuthService = {
  // Login with email and password
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    // Try real API first
    const apiResponse = await authRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (apiResponse.success && apiResponse.data) {
      // Save tokens and user data
      await AuthStorage.saveToken(apiResponse.data.token);
      await AuthStorage.saveRefreshToken(apiResponse.data.refreshToken);

      const userProfile: UserProfile = {
        ...apiResponse.data.user,
        totalMeals: 0,
        streak: 0,
        notificationsEnabled: true,
        remindersEnabled: true,
      };
      await UserStorage.save(userProfile);

      return apiResponse;
    }

    // Fallback to offline/mock login for development
    console.log('Using offline login');

    // Check if user exists locally
    const existingUser = await UserStorage.get();
    if (existingUser && existingUser.email === credentials.email) {
      // Simulate successful login with existing local user
      const mockToken = `mock_token_${generateId()}`;
      await AuthStorage.saveToken(mockToken);

      return {
        success: true,
        data: {
          user: existingUser,
          token: mockToken,
          refreshToken: `mock_refresh_${generateId()}`,
        },
      };
    }

    // Create new mock user for development
    const mockUser: User = {
      id: generateId(),
      email: credentials.email,
      name: credentials.email.split('@')[0],
      joinDate: new Date().toISOString().split('T')[0],
      allergies: [],
      sensitivities: [],
    };

    const mockToken = `mock_token_${generateId()}`;
    await AuthStorage.saveToken(mockToken);

    const userProfile: UserProfile = {
      ...mockUser,
      totalMeals: 0,
      streak: 0,
      notificationsEnabled: true,
      remindersEnabled: true,
    };
    await UserStorage.save(userProfile);

    return {
      success: true,
      data: {
        user: mockUser,
        token: mockToken,
        refreshToken: `mock_refresh_${generateId()}`,
      },
    };
  },

  // Register new user
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    // Try real API first
    const apiResponse = await authRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (apiResponse.success && apiResponse.data) {
      await AuthStorage.saveToken(apiResponse.data.token);
      await AuthStorage.saveRefreshToken(apiResponse.data.refreshToken);

      const userProfile: UserProfile = {
        ...apiResponse.data.user,
        totalMeals: 0,
        streak: 0,
        notificationsEnabled: true,
        remindersEnabled: true,
      };
      await UserStorage.save(userProfile);

      return apiResponse;
    }

    // Fallback to offline registration
    const newUser: User = {
      id: generateId(),
      email: data.email,
      name: data.name,
      condition: data.condition,
      joinDate: new Date().toISOString().split('T')[0],
      allergies: [],
      sensitivities: [],
    };

    const mockToken = `mock_token_${generateId()}`;
    await AuthStorage.saveToken(mockToken);

    const userProfile: UserProfile = {
      ...newUser,
      totalMeals: 0,
      streak: 0,
      notificationsEnabled: true,
      remindersEnabled: true,
    };
    await UserStorage.save(userProfile);

    return {
      success: true,
      data: {
        user: newUser,
        token: mockToken,
        refreshToken: `mock_refresh_${generateId()}`,
      },
    };
  },

  // Logout
  async logout(): Promise<void> {
    try {
      // Try to notify server
      const token = await AuthStorage.getToken();
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      // Ignore errors, just clear local data
    }

    // Clear local tokens
    await AuthStorage.clearTokens();
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await AuthStorage.getToken();
    return token !== null;
  },

  // Get current token
  async getToken(): Promise<string | null> {
    return AuthStorage.getToken();
  },

  // Refresh token
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const refreshToken = await AuthStorage.getRefreshToken();
    if (!refreshToken) {
      return { success: false, error: 'No refresh token' };
    }

    const response = await authRequest<{ token: string; refreshToken: string }>(
      '/auth/refresh',
      {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (response.success && response.data) {
      await AuthStorage.saveToken(response.data.token);
      if (response.data.refreshToken) {
        await AuthStorage.saveRefreshToken(response.data.refreshToken);
      }
    }

    return response;
  },

  // Reset password request
  async requestPasswordReset(email: string): Promise<ApiResponse<{ message: string }>> {
    return authRequest<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset password with token
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<ApiResponse<{ message: string }>> {
    return authRequest<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },

  // Delete account and all data
  async deleteAccount(): Promise<ApiResponse<void>> {
    try {
      const token = await AuthStorage.getToken();
      if (token) {
        await fetch(`${API_BASE_URL}/auth/delete-account`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      // Continue with local deletion
    }

    // Clear all local data
    await clearAllData();
    return { success: true };
  },
};

export default AuthService;
