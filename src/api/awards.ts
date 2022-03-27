import type { Award } from "@/types";
import { Query, type Appwrite, type Models } from "appwrite";

const awardsCollectionId = "623dd13a121effab1eaf";

export type AwardDocument = Award & Models.Document;

const awardsApi = {
  getAllAwards: async (appwrite: Appwrite): Promise<AwardDocument[]> =>
    (await appwrite.database.listDocuments<AwardDocument>(awardsCollectionId))
      .documents,
  getAwardsByCode: async (
    appwrite: Appwrite,
    code: string
  ): Promise<AwardDocument[]> =>
    (
      await appwrite.database.listDocuments<AwardDocument>(awardsCollectionId, [
        Query.equal("code", code),
      ])
    ).documents,
  updateAward: async (
    appwrite: Appwrite,
    award: AwardDocument
  ): Promise<AwardDocument> =>
    await appwrite.database.updateDocument(
      awardsCollectionId,
      award.$id,
      award
    ),
};

export default awardsApi;
