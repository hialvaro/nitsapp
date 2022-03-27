import appwrite from "@/appwrite";
import type { Models } from "appwrite";

type UserPreferences = Models.Preferences;
export type User = Models.User<UserPreferences>;

export default function useUser() {
  async function getUser(): Promise<User | null> {
    try {
      return await appwrite.account.get();
    } catch {
      return null;
    }
  }

  async function login(email: string, password: string) {
    return await appwrite.account.createSession(email, password);
  }

  async function logout() {
    return await appwrite.account.deleteSession("current");
  }

  async function registerUser(email: string, password: string, name: string) {
    return await appwrite.account.create<UserPreferences>(
      "unique()",
      email,
      password,
      name
    );
  }

  return {
    getUser,
    login,
    logout,
    registerUser,
  };
}
