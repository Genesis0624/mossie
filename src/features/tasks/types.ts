export type TaskStatus =
  | "inbox"
  | "express"
  | "to_plan"
  | "planned"
  | "in_progress"
  | "waiting"
  | "someday"
  | "delegated"
  | "completed"
  | "canceled";

export type Task = {
  id: string;
  title: string;
  type: "operativa" | "estrategica";
  is_express: boolean;
  status: TaskStatus;
  completed_at: string | null;
  created_at: string;
};
