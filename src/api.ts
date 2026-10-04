import auth from '@react-native-firebase/auth';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl ?? 'https://osnyl1403.pythonanywhere.com';

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const user = auth().currentUser;
  if (!user) {
    throw new Error('AUTH_REQUIRED');
  }
  const token = await user.getIdToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function jarvisFetch(path: string, init: RequestInit = {}) {
  const authHeaders = await getAuthHeaders();
  const headers = {
    ...authHeaders,
    ...(init.headers ?? {}),
  };
  return fetch(`${API_URL}${path}`, { ...init, headers });
}

export { API_URL };
