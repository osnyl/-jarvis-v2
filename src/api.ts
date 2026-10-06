import auth from '@react-native-firebase/auth';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl ?? 'https://osnyl1403.pythonanywhere.com';

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const user = auth().currentUser;
  if (!user) {
    throw new Error('AUTH_REQUIRED');
  }
  const token = await user.getIdToken(true);
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function jarvisFetch(path: string, init: RequestInit = {}) {
  const authHeaders = await getAuthHeaders();
  const headers = {
    ...authHeaders,
    ...(init.headers ?? {}),
  };
  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API_${response.status}: ${body || response.statusText}`);
  }
  return response;
}

export { API_URL };
