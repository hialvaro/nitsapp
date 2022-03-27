import appwrite from "@/appwrite";
import type { Models } from "appwrite";
import { onMounted, ref, readonly } from "vue";

type UserPreferences = Models.Preferences;
export type User = Models.User<UserPreferences>;

export default function useUser() {
  const user = ref<User | null>(null);

  onMounted(async () => {
    await getUser();
  });

  async function getUser(): Promise<void> {
    try {
      user.value = await appwrite.account.get();
    } catch {
      user.value = null;
    }
  }

  async function login(email: string, password: string): Promise<void> {
    await appwrite.account.createSession(email, password);
    await getUser();
  }

  async function logout(): Promise<void> {
    await appwrite.account.deleteSession("current");
    await getUser();
  }

  async function register(
    email: string,
    password: string,
    name: string
  ): Promise<void> {
    await appwrite.account.create<UserPreferences>(
      "unique()",
      email,
      password,
      name
    );
    await getUser();
  }

  return {
    user: readonly(user),
    login,
    logout,
    register,
  };
}
