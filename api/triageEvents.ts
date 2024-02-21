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
  const response = await axios.post("/api/triage_events", triage_event);
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
  const response = await axios.put(
    `/api/triage_events/${triage_event.id}`,
    triage_event
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
