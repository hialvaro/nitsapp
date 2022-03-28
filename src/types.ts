export type AwardType = "rar" | "comú" | "èpic" | "llegendàri";

export type Award = {
  code: string;
  description: string;
  howmany: number;
  $id: number;
  title: string;
  type: AwardType;
  users: string[];
};

export type Profile = {
  // TODO: Add fields
};
