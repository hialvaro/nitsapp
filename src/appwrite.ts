import { Appwrite } from "appwrite";
import { Client, Users } from "node-appwrite";

const config = {
  endpoint: "https://supa.r3d.red/v1",
  project: "623dcfae0a5b8f0027d6",
  key: "cc4d3c4183cc91f5c1a0039955217d6e4eb7085e12c10cba940d33fc504090cd63b485f3cd4c4e688550d62939975b87cd92885a607558d09fe83afd801cca7463ae44d767c98cd18744068bd6f928605d041a693fe5870d1a38610c3c1978fb99b6ffd317a209be88123ff1de81d707d38742b90f1f718030eb9a746282546c",
} as const;

const client = new Client();
client
  .setEndpoint(config.endpoint) // Your API Endpoint
  .setProject(config.project) // Your project ID
  .setKey(config.key); // Your secret API key

export const aw_users = new Users(client);

const appwrite = new Appwrite();
appwrite.setEndpoint(config.endpoint).setProject(config.project);

export default appwrite;
