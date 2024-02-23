"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getTriageEvent } from "@/api/triageEvents";
import { getCurrentUser } from "@/api/users";
import { TriageEventTimeline } from "@/app/_components/triage/TriageEventTimeline";
import { TriageEventComments } from "@/app/_components/triage/TriageEventComments";
import { EventPageHeader } from "@/app/_components/triage/EventPageHeader";
import { EventInformation } from "@/app/_components/triage/EventInformation";

export default function TriageEventPage() {
  const params = useParams<{ id: string }>();

  const { data: event, isLoading: eventIsLoading } = useQuery({
    queryKey: ["event", params.id],
    queryFn: () => getTriageEvent(params.id),
    enabled: !!params.id,
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  if (eventIsLoading || !event || !user) {
    return null;
  }

  return (
    <>
      <div className="py-4">
        <EventPageHeader event={event} />

        <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <div className="space-y-6 lg:col-start-1 lg:col-span-2">
            <EventInformation event={event} user={user} />
            <TriageEventComments
              eventComments={event.triage_event_comments}
              eventId={params.id}
              user={user}
            />
          </div>

          <section
            aria-labelledby="timeline-title"
            className="lg:col-start-3 lg:col-span-1"
          >
            <div className="border theme-border px-4 py-5 shadow sm:rounded-lg sm:px-6">
              <h2
                id="timeline-title"
                className="text-lg font-medium theme-text"
              >
                Timeline
              </h2>
              <div className="flow-root">
                <TriageEventTimeline event={event} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
