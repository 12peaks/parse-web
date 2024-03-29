import axios from "@/libs/axios";
import type {
  TriageEvent,
  CreateTriageEventDTO,
  UpdateTriageEventDTO,
  CreateTimelineEventDTO,
  TriageTimelineEvent,
} from "@/types/triageEvent";

export const getAllTriageEvents = async (): Promise<TriageEvent[]> => {
  const response = await axios.get("/api/triage_events");
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to fetch triage events");
  }
};

export const getTriageEvent = async (
  triage_event_id: string,
): Promise<TriageEvent> => {
  const response = await axios.get(`/api/triage_events/${triage_event_id}`);
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to fetch triage event");
  }
};

export const getTriageTimelineEvents = async (
  event_id: string,
): Promise<TriageTimelineEvent[]> => {
  const response = await axios.get(
    `/api/triage_timeline_events?triage_event_id=${event_id}`,
  );
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to fetch triage timeline events");
  }
};

export const createTriageEvent = async (
  triage_event: CreateTriageEventDTO,
): Promise<TriageEvent> => {
  const formData = new FormData();

  Object.entries(triage_event).forEach(([key, value]) => {
    if (key !== "attachments" && value !== undefined) {
      formData.append(
        `triage_event[${key}]`,
        typeof value === "object" ? JSON.stringify(value) : value,
      );
    }
  });

  if (triage_event.attachments && triage_event.attachments.length > 0) {
    triage_event.attachments.forEach((attachment) => {
      formData.append("triage_event[attachments][]", attachment);
    });
  }

  const response = await axios.post("/api/triage_events", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to create triage event");
  }
};

export const createTimelineEvent = async ({
  old_value,
  new_value,
  field,
  triage_event_id,
}: CreateTimelineEventDTO): Promise<TriageTimelineEvent[]> => {
  const response = await axios.post("/api/triage_timeline_events", {
    old_value,
    new_value,
    field,
    triage_event_id,
  });

  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to create timeline event");
  }
};

export const updateTriageEvent = async (
  triage_event: UpdateTriageEventDTO,
): Promise<TriageEvent> => {
  const formData = new FormData();

  Object.entries(triage_event).forEach(([key, value]) => {
    if (key !== "id" && key !== "attachments" && value !== undefined) {
      formData.append(
        `triage_event[${key}]`,
        typeof value === "object" ? JSON.stringify(value) : value,
      );
    }
  });

  if (triage_event.attachments && triage_event.attachments.length > 0) {
    triage_event.attachments.forEach((attachment) => {
      formData.append("triage_event[attachments][]", attachment);
    });
  }

  const response = await axios.put(
    `/api/triage_events/${triage_event.id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to update triage event");
  }
};

export const deleteTriageEvent = async (
  triage_event_id: string,
): Promise<void> => {
  const response = await axios.delete(`/api/triage_events/${triage_event_id}`);
  if (response.status === 200) {
    return;
  } else {
    throw new Error("Failed to delete triage event");
  }
};
