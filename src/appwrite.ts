import { Appwrite } from "appwrite";

const config = {
  endpoint: "https://supa.r3d.red/v1",
  project: "623dcfae0a5b8f0027d6",
} as const;

const appwrite = new Appwrite();
appwrite.setEndpoint(config.endpoint).setProject(config.project);

export default appwrite;
