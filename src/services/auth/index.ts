// src/services/auth/index.ts

// Export types
export * from "./types";

// Export core auth functionality
export { register, login, logout, isAuthenticated } from "./authentication";

// Export token management
export { getToken, saveToken, removeToken } from "./tokenStorage";

// Export user data management
export { getUserData, updateUserProperty, removeUserData } from "./userStorage";

// Export authentication providers
export { authenticateWithGoogle } from "./providers/googleAuthService";
