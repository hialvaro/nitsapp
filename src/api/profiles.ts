import appwrite from "@/appwrite";
import type { Profile } from "@/types";
import { Query, type Models } from "appwrite";

const profilesCollectionId = "6241c3c2e864fc09a4fa";
export type ProfileDocument = Profile & Models.Document;

const profilesApi = {
  getAllUsers: async (): Promise<ProfileDocument[]> =>
    (
      await appwrite.database.listDocuments<ProfileDocument>(
        profilesCollectionId
      )
    ).documents,

  getUserById: async (id: string): Promise<ProfileDocument> =>
    (
      await appwrite.database.listDocuments<ProfileDocument>(
        profilesCollectionId,
        [Query.equal("$id", id)]
      )
    ).documents[0],

  getUsersByIds: async (ids: string[]): Promise<ProfileDocument[]> =>
    (
      await appwrite.database.listDocuments<ProfileDocument>(
        profilesCollectionId,
        [Query.equal("$id", ids)]
      )
    ).documents,

  createProfile: async (profile: Profile): Promise<Models.Document> =>
    await appwrite.database.createDocument(
      profilesCollectionId,
      "unique()",
      profile
    ),
};

export default profilesApi;
