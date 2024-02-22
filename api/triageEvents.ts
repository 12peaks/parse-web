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
    return [];
  }
};

export const getTriageEvent = async (
  triage_event_id: string
): Promise<TriageEvent> => {
  const response = await axios.get(`/api/triage_events/${triage_event_id}`);
  if (response.status === 200) {
    return response.data;
  } else {
    return {} as TriageEvent;
  }
};

export const createTriageEvent = async (
  triage_event: CreateTriageEventDTO
): Promise<TriageEvent> => {
  const formData = new FormData();

  Object.entries(triage_event).forEach(([key, value]) => {
    if (key !== "attachments" && value !== undefined) {
      formData.append(
        `triage_event[${key}]`,
        typeof value === "object" ? JSON.stringify(value) : value
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
    return {} as TriageEvent;
  }
};

export const createTimelineEvent = async ({
  oldValue,
  newValue,
  field,
  triageEventId,
}: CreateTimelineEventDTO): Promise<TriageTimelineEvent[]> => {
  const response = await axios.post("/api/triage_timeline_events", {
    oldValue,
    newValue,
    field,
    triageEventId,
  });

  if (response.status === 200) {
    return response.data;
  } else {
    return [];
  }
};

export const updateTriageEvent = async (
  triage_event: UpdateTriageEventDTO
): Promise<TriageEvent> => {
  const formData = new FormData();

  Object.entries(triage_event).forEach(([key, value]) => {
    if (key !== "attachments" && value !== undefined) {
      formData.append(
        `triage_event[${key}]`,
        typeof value === "object" ? JSON.stringify(value) : value
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
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  if (response.status === 200) {
    return response.data;
  } else {
    return {} as TriageEvent;
  }
};

export const deleteTriageEvent = async (
  triage_event_id: string
): Promise<void> => {
  const response = await axios.delete(`/api/triage_events/${triage_event_id}`);
  if (response.status === 200) {
    return;
  } else {
    return;
  }
};
