
export const getAuthErrorMessage = (error: unknown) => {
  if (!error) return null;

  const message = (error as { message?: string })?.message || String(error);


  
  // Map specific errors to safe messages
  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password';
  }
  if (message.includes('Email not confirmed')) {
    return 'Please verify your email before signing in';
  }
  if (message.includes('User already registered')) {
    return 'This email is already registered';
  }
  if (message.includes('Password should be')) {
    return 'Password is too weak. Please use a stronger password.';
  }
  
  // Generic fallback for other errors to prevent leaking internal details
  console.error('Auth error:', error); // Keep log for debugging but hide from user
  return 'Authentication failed. Please try again.';
};
