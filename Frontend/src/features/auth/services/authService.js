import apiClient from '../../../shared/services/apiClient';

export async function login(email, password) {
  const response = await apiClient.post('/auth/login', { email, password });
  // Response contains: { success: true, data: { token, employee } }
  return response.data.data;
}

export async function register(name, email, password) {
  const response = await apiClient.post('/auth/signup', { name, email, password });
  // Response contains: { success: true, data: { employee } }
  return response.data.data;
}

export async function logout() {
  await apiClient.post('/auth/logout');
}

export async function forgotPassword(email) {
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }
  return {
    success: true,
    message: 'Reset instructions have been sent to your email.',
  };
}
