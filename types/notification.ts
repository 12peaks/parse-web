export type Notification = {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  status: string;
  text: string;
  image_url: string;
  target_model: string;
  target_model_id: string;
  group_id: string | null;
  post_id: string | null;
  notify_user_id: string;
};
