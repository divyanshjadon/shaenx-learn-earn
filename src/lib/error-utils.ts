export const getAuthErrorMessage = (error: unknown) => {
  if (!error) return null;

  const err = error as { message?: string; code?: string; status?: number };
  const message = err?.message || String(error);
  const code = err?.code || "";
  const status = err?.status;
  const lower = message.toLowerCase();

  // Already registered
  if (
    code === "user_already_exists" ||
    code === "email_exists" ||
    lower.includes("already registered") ||
    lower.includes("already been registered") ||
    lower.includes("user already exists") ||
    lower.includes("email address is already")
  ) {
    return "An account with this email already exists. Try signing in instead.";
  }

  // Rate limiting
  if (status === 429 || code.includes("rate_limit") || lower.includes("rate limit") || lower.includes("too many requests")) {
    if (lower.includes("email")) {
      return "Too many emails sent. Please wait a few minutes and try again.";
    }
    return "Too many attempts. Please wait a moment and try again.";
  }

  // Password policy
  if (
    code === "weak_password" ||
    lower.includes("password should be") ||
    lower.includes("password is too short") ||
    lower.includes("password should contain")
  ) {
    return `Password doesn't meet requirements: ${message.replace(/^AuthApiError:\s*/i, "")}`;
  }
  if (lower.includes("pwned") || lower.includes("leaked") || lower.includes("data breach")) {
    return "This password has appeared in a data breach. Please choose a different one.";
  }

  // Sign-in specific
  if (lower.includes("invalid login credentials")) {
    return "Invalid email or password";
  }
  if (lower.includes("email not confirmed")) {
    return "Please verify your email before signing in";
  }
  if (lower.includes("invalid email") || lower.includes("unable to validate email")) {
    return "Please enter a valid email address.";
  }
  if (lower.includes("signups not allowed") || lower.includes("signup is disabled")) {
    return "New sign-ups are currently disabled.";
  }
  if (lower.includes("failed to fetch") || lower.includes("network")) {
    return "Network error. Please check your connection and try again.";
  }

  console.error("Auth error:", error);
  return "Authentication failed. Please try again.";
};
