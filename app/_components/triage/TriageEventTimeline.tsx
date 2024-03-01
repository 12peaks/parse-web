import Link from "next/link";
import { Timeline, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { IconAlertCircle, IconCheck, IconClock } from "@tabler/icons-react";
import { getTriageTimelineEvents } from "@/api/triageEvents";
import { TriageEvent } from "@/types/triageEvent";

type TriageEventTimelineProps = {
  event: TriageEvent;
};

export const TriageEventTimeline = ({ event }: TriageEventTimelineProps) => {
  const {
    data: timelineEvents,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryKey: ["timeline-events", event.id],
    queryFn: () => getTriageTimelineEvents(event.id),
    enabled: !!event.id,
  });

  if (isSuccess && timelineEvents.length === 0) {
    return <div className="mx-auto text-center">No timeline events yet.</div>;
  }

  if (isError) {
    showNotification({
      title: "Error",
      message: error.message,
      color: "red",
    });
    return null;
  }

  return (
    <>
      {isSuccess && timelineEvents ? (
        <Timeline
          bulletSize={24}
          lineWidth={2}
          classNames={{
            itemTitle: "!text-sm",
            item: "!mt-4",
          }}
          active={timelineEvents.length}
        >
          <Timeline.Item
            bullet={<IconAlertCircle size={16} strokeWidth={2} />}
            title={"New Event"}
          >
            <Text color="dimmed" size="xs">
              Event created by
              <Text component="span" size="xs" fw={500}>
                {" "}
                {event.user.name}
              </Text>
            </Text>
            <Text size="xs" mt={4}>
              {new Date(event.created_at).toLocaleString()}
            </Text>
          </Timeline.Item>
          {timelineEvents.map((event) => (
            <Timeline.Item
              key={event.id}
              className="capitalize"
              color={
                event.field === "status" && event.new_value === "resolved"
                  ? "green"
                  : ""
              }
              bullet={
                event.field === "status" && event.new_value === "resolved" ? (
                  <IconCheck size={16} strokeWidth={2} />
                ) : (
                  <IconClock size={16} strokeWidth={2} />
                )
              }
              title={`${event.field.split("_").join(" ")} updated`}
            >
              <Text className="normal-case" color="dimmed" size="xs">
                <span className="capitalize">{event.field}</span> updated{" "}
                {event.field !== "description" ? (
                  <>
                    from {event.old_value?.split("_").join(" ")} to{" "}
                    {event.new_value.split("_").join(" ")}{" "}
                  </>
                ) : null}
                by
                <Text component="span" size="xs" fw={500}>
                  {" "}
                  <Link href={`/team/${event.user.id}`}>{event.user.name}</Link>
                </Text>
              </Text>
              <Text size="xs" mt={4}>
                {new Date(event.created_at).toLocaleString()}
              </Text>
            </Timeline.Item>
          ))}
        </Timeline>
      ) : null}
    </>
  );
};
