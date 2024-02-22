import axios from "@/libs/axios";
import type { TriageEventComment } from "@/types/triageEvent";

export const createTriageEventComment = async ({
  text,
  event_id,
}: {
  text: string;
  event_id: string;
}): Promise<TriageEventComment> => {
  const response = await axios.post(`/api/triage_event_comments`, {
    text,
    triage_event_id: event_id,
  });
  if (response.status === 200) {
    return response.data;
  } else {
    return {} as TriageEventComment;
  }
};

export const deleteTriageEventComment = async ({
  comment_id,
}: {
  comment_id: string;
}): Promise<void> => {
  const response = await axios.delete(
    `/api/triage_event_comments/${comment_id}`
  );
  if (response.status === 200) {
    return;
  } else {
    return;
  }
};
