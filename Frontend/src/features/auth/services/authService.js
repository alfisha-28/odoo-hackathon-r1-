// Simulated latency helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login(email, password) {
  await delay(1000);
  
  // Basic validation checks (mocks errors for testing)
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  // Simulate authentication success
  return {
    id: 'usr_flowsync_001',
    name: 'Alex Rivera',
    email: email,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    role: 'Enterprise Administrator',
    department: 'Operations & IT',
  };
}

export async function register(name, email, password) {
  await delay(1200);

  if (!name || name.trim().length < 2) {
    throw new Error('Full Name must be at least 2 characters.');
  }
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }

  return {
    id: 'usr_flowsync_002',
    name: name,
    email: email,
    avatar: null,
    role: 'Standard User',
    department: 'Unassigned',
  };
}

export async function forgotPassword(email) {
  await delay(800);
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid email address.');
  }
  return {
    success: true,
    message: 'Reset instructions have been sent to your email.',
  };
}
