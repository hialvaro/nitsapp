import { Appwrite } from "appwrite";
import { Server } from "./utils/config";

export const sdk = new Appwrite()
  .setEndpoint(Server.endpoint as string)
  .setProject(Server.project as string);
