import Constants from 'expo-constants';
import { supabase } from './supabase';
import { FoodItem, AppData } from '../data/types';
import { checkNetworkConnection, ErrorMessages } from './errorHandling';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

// Get auth token for API requests
async function getAuthToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

// Generic API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const isConnected = await checkNetworkConnection();
  if (!isConnected) {
    return { success: false, error: ErrorMessages.NETWORK_OFFLINE };
  }

  const token = await getAuthToken();
  if (!token) {
    return { success: false, error: 'Please sign in to continue' };
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Request failed',
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      error: 'Unable to connect to server. Please try again.',
    };
  }
}

// ============================================
// FOOD ANALYSIS
// ============================================

interface AnalyzeResponse {
  success: boolean;
  foods: FoodItem[];
  message?: string;
}

export async function analyzeFood(
  imageBase64: string,
  mediaType: string = 'image/jpeg'
): Promise<{ success: boolean; foods: FoodItem[]; error?: string }> {
  const result = await apiRequest<AnalyzeResponse>('/api/analyze', {
    method: 'POST',
    body: JSON.stringify({
      image: imageBase64,
      mediaType,
    }),
  });

  if (!result.success) {
    return { success: false, foods: [], error: result.error };
  }

  return {
    success: true,
    foods: result.data?.foods || [],
  };
}

// ============================================
// DATA SYNC
// ============================================

interface SyncResponse {
  success: boolean;
  data?: AppData;
  updatedAt?: string;
}

export async function syncDataToCloud(data: AppData): Promise<{ success: boolean; error?: string }> {
  const result = await apiRequest<{ success: boolean }>('/api/sync', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });

  return {
    success: result.success,
    error: result.error,
  };
}

export async function fetchDataFromCloud(): Promise<{
  success: boolean;
  data?: AppData;
  updatedAt?: string;
  error?: string;
}> {
  const result = await apiRequest<SyncResponse>('/api/sync', {
    method: 'GET',
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return {
    success: true,
    data: result.data?.data,
    updatedAt: result.data?.updatedAt,
  };
}

// ============================================
// USER PROFILE
// ============================================

interface ProfileResponse {
  success: boolean;
  profile: {
    id: string;
    email: string;
    name?: string;
    condition?: string;
    avatar_url?: string;
  };
}

export async function fetchProfile(): Promise<{
  success: boolean;
  profile?: ProfileResponse['profile'];
  error?: string;
}> {
  const result = await apiRequest<ProfileResponse>('/api/profile', {
    method: 'GET',
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return {
    success: true,
    profile: result.data?.profile,
  };
}

export async function updateProfile(profile: {
  name?: string;
  condition?: string;
  avatar_url?: string;
}): Promise<{ success: boolean; error?: string }> {
  const result = await apiRequest<{ success: boolean }>('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(profile),
  });

  return {
    success: result.success,
    error: result.error,
  };
}

// ============================================
// HEALTH CHECK
// ============================================

export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}
