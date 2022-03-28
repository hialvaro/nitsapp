import appwrite from "@/appwrite";
import type { Award } from "@/types";
import { Query, type Models } from "appwrite";

const awardsCollectionId = "623dd13a121effab1eaf";

export type AwardDocument = Award & Models.Document;

const awardsApi = {
  getAllAwards: async (): Promise<AwardDocument[]> =>
    (await appwrite.database.listDocuments<AwardDocument>(awardsCollectionId))
      .documents,

  getAwardsByCode: async (code: string): Promise<AwardDocument[]> =>
    (
      await appwrite.database.listDocuments<AwardDocument>(awardsCollectionId, [
        Query.equal("code", code),
      ])
    ).documents,

  getAwardsById: async (id: string | string[]): Promise<AwardDocument[]> =>
    (
      await appwrite.database.listDocuments<AwardDocument>(awardsCollectionId, [
        Query.equal("$id", id),
      ])
    ).documents,

  updateAward: async (award: AwardDocument): Promise<AwardDocument> =>
    await appwrite.database.updateDocument(
      awardsCollectionId,
      award.$id,
      award
    ),
};

export default awardsApi;
