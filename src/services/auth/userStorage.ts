// src/services/auth/userStorage.ts
import { UserData } from "./types";

const USER_DATA_KEY = "user_data";

/**
 * Saves user data to localStorage
 */
export function saveUserData(userData: UserData): void {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
}

/**
 * Gets user data from localStorage
 */
export function getUserData(): UserData | null {
  const userDataStr = localStorage.getItem(USER_DATA_KEY);
  if (!userDataStr) return null;

  try {
    return JSON.parse(userDataStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}

/**
 * Updates a specific property in user data
 */
export function updateUserProperty<K extends keyof UserData>(
  propertyName: K,
  value: UserData[K]
): boolean {
  try {
    const userData = getUserData();
    if (!userData) return false;

    userData[propertyName] = value;
    saveUserData(userData);
    return true;
  } catch (error) {
    console.error("Error updating user data property:", error);
    return false;
  }
}

/**
 * Removes user data from localStorage
 */
export function removeUserData(): void {
  localStorage.removeItem(USER_DATA_KEY);
}
