"use client";
import { Badge } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAllTriageEvents } from "@/api/triageEvents";
import { NewEventButton } from "@/app/_components/triage/NewEventButton";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function TriagePage() {
  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: () => getAllTriageEvents(),
  });

  if (isError) {
    showNotification({
      title: "Error",
      message: error.message,
      color: "red",
    });
  }

  if (isLoading) {
    return null;
  }

  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold theme-text">Triage Events</h1>
          <p className="mt-2 text-sm theme-text-subtle">
            Triage events are to help you manage stakeholders during
            firefighting.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <NewEventButton />
        </div>
      </div>
      <div className="mt-4 flex flex-col">
        <div className="">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="shadow-sm border theme-border rounded-md">
              <table
                className="min-w-full border-separate"
                style={{ borderSpacing: 0 }}
              >
                <thead className="theme-bg-subtle">
                  <tr>
                    <th
                      scope="col"
                      className="sticky rounded-tl-md top-0 z-10 border-b theme-border theme-bg-subtle bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold theme-text backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                    >
                      Event ID
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b theme-border theme-bg-subtle bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold theme-text backdrop-blur backdrop-filter sm:table-cell"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b theme-border theme-bg-subtle bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold theme-text backdrop-blur backdrop-filter lg:table-cell"
                    >
                      Severity
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b theme-border theme-bg-subtle bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold theme-text backdrop-blur backdrop-filter"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="sticky rounded-tr-md top-0 z-10 border-b theme-border theme-bg-subtle bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                    >
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events &&
                    events.map((event, eventIdx) => (
                      <tr key={event.id} className="hover:theme-bg-subtle">
                        <td
                          className={classNames(
                            eventIdx !== events.length - 1
                              ? "border-b theme-border"
                              : "rounded-bl-md",
                            "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium theme-text sm:pl-6 lg:pl-8",
                          )}
                        >
                          {`TEV-${10000 + event.event_number}`}
                        </td>
                        <td
                          className={classNames(
                            eventIdx !== events.length - 1
                              ? "border-b theme-border"
                              : "",
                            "max-w-sm truncate px-3 py-4 text-sm theme-text-subtle hidden sm:table-cell",
                          )}
                        >
                          <span className="truncate">{event.description}</span>
                        </td>
                        <td
                          className={classNames(
                            eventIdx !== events.length - 1
                              ? "border-b theme-border"
                              : "",
                            "whitespace-nowrap px-3 py-4 text-sm theme-text-subtle hidden lg:table-cell",
                          )}
                        >
                          <Badge
                            color={
                              event.severity === "high"
                                ? "red"
                                : event.severity === "medium"
                                  ? "orange"
                                  : "yellow"
                            }
                          >
                            {event.severity}
                          </Badge>
                        </td>
                        <td
                          className={classNames(
                            eventIdx !== events.length - 1
                              ? "border-b theme-border"
                              : "",
                            "whitespace-nowrap px-3 py-4 text-sm theme-text-subtle capitalize",
                          )}
                        >
                          {event.status.split("_").join(" ")}
                        </td>
                        <td
                          className={classNames(
                            eventIdx !== events.length - 1
                              ? "border-b theme-border"
                              : "rounded-br-md",
                            "relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6 lg:pr-8",
                          )}
                        >
                          <Link
                            href={`/triage/${event.id}`}
                            className="theme-link-blue"
                          >
                            View<span className="sr-only">, {event.id}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
