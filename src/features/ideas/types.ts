export type IdeaStatus = "inbox" | "processed" | "archived";

export type Idea = {
  id: string;
  title: string;
  link: string | null;
  status: IdeaStatus;
  converted_to_type: string | null;
  converted_to_task_id: string | null;
  processed_at: string | null;
  archived_at: string | null;
  created_at: string;
};

export const IDEA_SELECT =
  "id, title, link, status, converted_to_type, converted_to_task_id, processed_at, archived_at, created_at";
