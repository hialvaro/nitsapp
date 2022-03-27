import awardsApi, { type AwardDocument } from "@/api/awards";
import { Appwrite, type Models } from "appwrite";

type UserPreferences = Models.Preferences;
export type User = Models.User<UserPreferences>;

const config = {
  endpoint: "https://supa.r3d.red/v1",
  project: "623dcfae0a5b8f0027d6",
} as const;

const appwrite = new Appwrite();
appwrite.setEndpoint(config.endpoint).setProject(config.project);

export default function useAppwrite() {
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

  async function getAllAwards() {
    return await awardsApi.getAllAwards(appwrite);
  }

  async function getAwardsByCode(code: string) {
    return await awardsApi.getAwardsByCode(appwrite, code);
  }

  async function updateAward(award: AwardDocument) {
    return await awardsApi.updateAward(appwrite, award);
  }

  return {
    getAllAwards,
    getAwardsByCode,
    getUser,
    login,
    logout,
    registerUser,
    updateAward,
  };
}
