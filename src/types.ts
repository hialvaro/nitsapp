export type AwardType = "rar" | "comú" | "èpic" | "llegendàri";

export type Award = {
  code: string;
  created_at: string;
  description: string;
  howmany: number;
  id: number;
  imgFilename: string | null;
  title: string;
  type: AwardType;
  users: string[] | null;
};
