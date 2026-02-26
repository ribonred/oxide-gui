export interface Participant {
  id: string;
  alias: string;
  external_id: string;
  email: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}
