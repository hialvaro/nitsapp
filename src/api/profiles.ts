import appwrite from "@/appwrite";
import type { Profile } from "@/types";
import { Query, type Models } from "appwrite";

const profilesCollectionId = "6241c3c2e864fc09a4fa";
export type ProfileDocument = Profile & Models.Document;

const profilesApi = {
  getAllUsers: async (): Promise<ProfileDocument[]> => {
    return (
      await appwrite.database.listDocuments<ProfileDocument>(
        profilesCollectionId
      )
    ).documents;
  },

  getUserById: async (id: string | string[]): Promise<ProfileDocument> => {
    const profile = (
      await appwrite.database.listDocuments<ProfileDocument>(
        profilesCollectionId,
        [Query.equal("$id", id)]
      )
    ).documents[0];
    return profile;
  },

  createProfile: async (profile: Profile): Promise<Models.Document> =>
    await appwrite.database.createDocument(
      profilesCollectionId,
      "unique()",
      profile
    ),
};

export default profilesApi;
