"use client";
import { useState, useEffect, forwardRef } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getTriageEvent,
  updateTriageEvent,
  createTimelineEvent,
} from "@/api/triageEvents";
import { getTeamUsers } from "@/api/teams";
import { getCurrentUser } from "@/api/users";
import { TriageEventTimeline } from "@/app/_components/triage/TriageEventTimeline";
import { TriageEventComments } from "@/app/_components/triage/TriageEventComments";
import {
  Badge,
  Button,
  Select,
  Text,
  Textarea,
  Avatar,
  Group,
} from "@mantine/core";
import { IconChevronLeft, IconPaperclip } from "@tabler/icons-react";
import fire from "@/public/fire.png";
import { useModals } from "@mantine/modals";
import { CustomSelect } from "@/app/_components/ui/CustomSelect";
import type { TriageFile } from "@/types/triageEvent";
//import { FileModal, UploadedFile } from "@/components/FileModal";
//import { updateTriageFiles } from "../api/updateTriageFiles";

type MemberDTO = {
  icon: React.ReactNode;
  description: string;
  label: string;
  value: string;
};

export default function TriageEventPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const modals = useModals();
  const queryClient = useQueryClient();

  const eventQuery = useQuery({
    queryKey: ["event", params.id],
    queryFn: () => getTriageEvent(params.id),
    enabled: !!params.id,
  });

  const teamMembersQuery = useQuery({
    queryKey: ["team-members"],
    queryFn: () => getTeamUsers(),
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  const [avatarUrl, setAvatarUrl] = useState("");
  const [editingSeverity, setEditingSeverity] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingReporter, setEditingReporter] = useState(false);
  const [editingOwner, setEditingOwner] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [teamMembers, setTeamMembers] = useState<MemberDTO[]>([]);
  const [newStatus, setNewStatus] = useState(
    eventQuery.data ? eventQuery.data.status : ""
  );
  const [newSeverity, setNewSeverity] = useState(
    eventQuery.data ? eventQuery.data.severity : ""
  );
  const [newOwner, setNewOwner] = useState(
    eventQuery.data ? eventQuery.data.owner_id ?? "" : ""
  );
  const [newReporter, setNewReporter] = useState<string>(
    eventQuery.data ? eventQuery.data.user_id ?? "" : ""
  );
  const [newDescription, setNewDescription] = useState(
    eventQuery.data ? eventQuery.data.description : ""
  );

  const saveEventMutation = useMutation({
    mutationFn: updateTriageEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["event", params.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["timeline-events", params.id],
      });
    },
  });

  const createTimelineEventMutation = useMutation({
    mutationFn: createTimelineEvent,
  });

  const handleStatusSave = () => {
    if (eventQuery.data) {
      if (newStatus !== eventQuery.data.status) {
        createTimelineEventMutation.mutate({
          oldValue: eventQuery.data.status,
          newValue: newStatus,
          field: "status",
          triageEventId: params.id,
        });
        saveEventMutation.mutate({
          id: params.id,
          status: newStatus,
        });
      }
      setEditingStatus(false);
    }
  };

  const handleSeveritySave = () => {
    if (eventQuery.data) {
      if (newSeverity !== eventQuery.data.severity) {
        createTimelineEventMutation.mutate({
          oldValue: eventQuery.data.severity,
          newValue: newSeverity,
          field: "severity",
          triageEventId: params.id,
        });
        saveEventMutation.mutate({
          id: params.id,
          severity: newSeverity,
        });
      }
      setEditingSeverity(false);
    }
  };

  const handleDescriptionSave = () => {
    if (eventQuery.data) {
      if (newDescription !== eventQuery.data.description) {
        createTimelineEventMutation.mutate({
          oldValue: eventQuery.data.description,
          newValue: newDescription,
          field: "description",
          triageEventId: params.id,
        });
        saveEventMutation.mutate({
          id: params.id,
          description: newDescription,
        });
      }
      setEditingDescription(false);
    }
  };

  const getNewName = (id: string): string | undefined => {
    if (teamMembersQuery.data) {
      for (const teamMember of teamMembersQuery.data) {
        if (teamMember.id === id) {
          return teamMember.name;
        }
      }
    }
  };

  const handleOwnerSave = () => {
    if (eventQuery.data) {
      const newOwnerId = newOwner;
      if (newOwnerId !== eventQuery.data.owner_id) {
        const triageEventId = params.id;
        createTimelineEventMutation.mutate({
          oldValue: eventQuery.data.owner.name,
          newValue: getNewName(newOwner) || "",
          field: "owner",
          triageEventId,
        });
        saveEventMutation.mutate({
          id: triageEventId,
          owner_id: newOwnerId,
        });
      }
      setEditingOwner(false);
    }
  };

  const handleReporterSave = () => {
    if (eventQuery.data) {
      const newReporterId = newReporter;
      if (newReporterId !== eventQuery.data.user_id) {
        createTimelineEventMutation.mutate({
          oldValue: eventQuery.data.user.name,
          newValue: getNewName(newReporter) || "",
          field: "reporter",
          triageEventId: params.id,
        });
        saveEventMutation.mutate({
          id: params.id,
          user_id: newReporterId,
        });
      }
      setEditingReporter(false);
    }
  };

  const handleFileRemove = (file: TriageFile) => {
    console.log("remove file", file);
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted && teamMembersQuery.isSuccess && teamMembersQuery.data) {
      let members: MemberDTO[] = [];
      teamMembersQuery.data.forEach((teamMember) => {
        if (teamMember.id === user?.id) {
          setAvatarUrl(teamMember.avatar_url ?? "");
        }
        members.push({
          value: teamMember.id,
          label: teamMember.name ?? "",
          icon: (
            <Avatar
              className="bg-white"
              src={teamMember.avatar_url}
              size={32}
              radius="xl"
            />
          ),
          description: teamMember.email ?? "",
        });
      });
      setTeamMembers(members);
    }
    return () => {
      isMounted = false;
    };
  }, [teamMembersQuery.isSuccess, teamMembersQuery.data, user?.id]);

  if (eventQuery.isLoading || !eventQuery.data || !user) {
    return null;
  }

  return (
    <>
      <div className="py-4">
        {/* Page header */}
        <div className="max-w-3xl mx-auto md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl">
          <div className="flex items-center space-x-5">
            <div className="flex-shrink-0">
              <div className="relative">
                <img className="h-12 w-12" src={fire.src} alt="" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold theme-text">{`TEV-${
                10000 + eventQuery.data.event_number
              }`}</h1>
              <p className="text-sm font-medium theme-text-subtle">
                Created{" "}
                <span className="theme-text">
                  {new Date(eventQuery.data.created_at).toLocaleString()}
                </span>
                <span className="theme-text-subtle font-medium mx-2">
                  &middot;
                </span>
                Last updated{" "}
                <span className="theme-text">
                  {new Date(eventQuery.data.updated_at).toLocaleString()}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
            <Button
              leftSection={
                <IconChevronLeft
                  size={18}
                  strokeWidth={3}
                  className="-ml-2 -mr-1"
                />
              }
              onClick={() => router.push("/triage")}
            >
              Back
            </Button>
          </div>
        </div>

        <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <div className="space-y-6 lg:col-start-1 lg:col-span-2">
            {/* Description list*/}
            <section aria-labelledby="applicant-information-title">
              <div className="shadow sm:rounded-lg border theme-border">
                <div className="px-4 py-5 sm:px-6 items-center flex flex-columns justify-between">
                  <div
                    id="applicant-information-title"
                    className="text-lg leading-6 font-medium theme-text"
                  >
                    Event Information
                  </div>
                </div>
                <div className="border-t theme-border px-4 py-5 sm:px-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 !list-none">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium theme-text-subtle flex flex-column items-center">
                        Reporter
                        {editingReporter ? (
                          <div className="flex flex-column items-center">
                            <Button
                              className="ml-1"
                              variant="subtle"
                              size="compact-xs"
                              onClick={() => handleReporterSave()}
                            >
                              Save
                            </Button>
                            <Button
                              className="ml-1"
                              variant="subtle"
                              color="gray"
                              onClick={() => setEditingReporter(false)}
                              size="compact-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="ml-1"
                            variant="subtle"
                            size="compact-xs"
                            onClick={() => setEditingReporter(true)}
                          >
                            Edit
                          </Button>
                        )}
                      </dt>
                      <dd className="mt-1 text-sm theme-text flex flex-columns items-center">
                        {editingReporter ? (
                          <CustomSelect
                            className="w-full"
                            placeholder="Event reporter"
                            defaultValue={newReporter}
                            setValue={(value) => setNewReporter(value || "")}
                            data={teamMembers}
                            itemComponent={SelectItem}
                            searchable
                            nothingFoundMessage="Teammate not found"
                          />
                        ) : (
                          <>
                            <Avatar
                              className="bg-white mr-2"
                              size={32}
                              src={eventQuery.data.user.avatar_url}
                              alt="reporter"
                            />
                            <div>{eventQuery.data.user?.name}</div>
                          </>
                        )}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium theme-text-subtle flex flex-column items-center">
                        Owner
                        {editingOwner ? (
                          <div className="flex flex-column items-center">
                            <Button
                              className="ml-1"
                              variant="subtle"
                              size="compact-xs"
                              onClick={() => handleOwnerSave()}
                            >
                              Save
                            </Button>
                            <Button
                              className="ml-1"
                              variant="subtle"
                              color="gray"
                              onClick={() => setEditingOwner(false)}
                              size="compact-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="ml-1"
                            variant="subtle"
                            size="compact-xs"
                            onClick={() => setEditingOwner(true)}
                          >
                            Edit
                          </Button>
                        )}
                      </dt>
                      <dd className="mt-1 text-sm theme-text flex flex-columns items-center">
                        {editingOwner ? (
                          <CustomSelect
                            className="w-full"
                            placeholder="Event owner"
                            defaultValue={newOwner}
                            setValue={(value) => setNewOwner(value || "")}
                            data={teamMembers}
                            itemComponent={SelectItem}
                            searchable
                            nothingFoundMessage="Teammate not found"
                          />
                        ) : (
                          <>
                            <Avatar
                              className="bg-white mr-2"
                              size={32}
                              src={eventQuery.data.owner?.avatar_url}
                              alt="owner"
                            />
                            <div>{eventQuery.data.owner?.name}</div>
                          </>
                        )}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium theme-text-subtle flex flex-column items-center">
                        Severity{" "}
                        {editingSeverity ? (
                          <div className="flex flex-column items-center">
                            <Button
                              className="ml-1"
                              variant="subtle"
                              size="compact-xs"
                              onClick={() => handleSeveritySave()}
                            >
                              Save
                            </Button>
                            <Button
                              className="ml-1"
                              variant="subtle"
                              color="gray"
                              onClick={() => setEditingSeverity(false)}
                              size="compact-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="ml-1"
                            variant="subtle"
                            size="compact-xs"
                            onClick={() => setEditingSeverity(true)}
                          >
                            Edit
                          </Button>
                        )}
                      </dt>
                      <dd className="mt-1 text-sm theme-text capitalize">
                        {editingSeverity ? (
                          <Select
                            placeholder="Event severity"
                            value={newSeverity}
                            onChange={(value) => setNewSeverity(value || "")}
                            data={severityOptions}
                          />
                        ) : (
                          <Badge
                            color={
                              eventQuery.data.severity === "high"
                                ? "red"
                                : eventQuery.data.severity === "medium"
                                  ? "orange"
                                  : "yellow"
                            }
                          >
                            {eventQuery.data.severity}
                          </Badge>
                        )}
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium theme-text-subtle flex flex-column items-center">
                        Status
                        {editingStatus ? (
                          <div className="flex flex-column items-center">
                            <Button
                              className="ml-1"
                              variant="subtle"
                              onClick={() => handleStatusSave()}
                              size="compact-xs"
                            >
                              Save
                            </Button>
                            <Button
                              className="ml-1"
                              variant="subtle"
                              color="gray"
                              onClick={() => setEditingStatus(false)}
                              size="compact-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="ml-1"
                            variant="subtle"
                            size="compact-xs"
                            onClick={() => setEditingStatus(true)}
                          >
                            Edit
                          </Button>
                        )}
                      </dt>
                      <dd className="mt-1 text-sm theme-text capitalize">
                        {editingStatus ? (
                          <Select
                            placeholder="Event status"
                            value={newStatus}
                            onChange={(value) => setNewStatus(value || "")}
                            data={statusOptions}
                          />
                        ) : (
                          <>{eventQuery.data.status.split("_").join(" ")}</>
                        )}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium theme-text-subtle flex flex-columns items-center">
                        Description
                        {editingDescription ? (
                          <div className="flex flex-column items-center">
                            <Button
                              className="ml-1"
                              variant="subtle"
                              size="compact-xs"
                              onClick={() => handleDescriptionSave()}
                            >
                              Save
                            </Button>
                            <Button
                              className="ml-1"
                              variant="subtle"
                              color="gray"
                              onClick={() => setEditingDescription(false)}
                              size="compact-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="ml-1"
                            variant="subtle"
                            size="compact-xs"
                            onClick={() => setEditingDescription(true)}
                          >
                            Edit
                          </Button>
                        )}
                      </dt>
                      <dd className="mt-1 text-sm theme-text">
                        {editingDescription ? (
                          <Textarea
                            className="w-full"
                            placeholder="Event description"
                            value={newDescription}
                            onChange={(e) =>
                              setNewDescription(e.currentTarget.value)
                            }
                          />
                        ) : (
                          <> {eventQuery.data.description}</>
                        )}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium theme-text-subtle flex flex-columns items-center">
                        Attachments
                        <div className="flex flex-column items-center">
                          <Button
                            className="ml-1"
                            variant="subtle"
                            size="compact-xs"
                            onClick={() => console.log("add files")}
                          >
                            Add
                          </Button>
                        </div>
                      </dt>

                      <dd className="mt-1 text-sm theme-text">
                        <ul className="border theme-border rounded-md divide-y theme-divide">
                          {eventQuery.data.attachments_data &&
                            eventQuery.data.attachments_data.map((file) => (
                              <li
                                key={file.id}
                                className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                              >
                                <div className="w-0 flex-1 flex items-center">
                                  <IconPaperclip
                                    className="flex-shrink-0 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  <span className="ml-2 flex-1 w-0 truncate">
                                    {file.name}
                                  </span>
                                </div>
                                <div className="ml-4 flex-shrink-0 flex flex-column items-center">
                                  <Button
                                    component="a"
                                    href={file.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    variant="subtle"
                                    size="compact-sm"
                                    color="blue"
                                  >
                                    Download
                                  </Button>
                                  <Button
                                    className="ml-4"
                                    variant="subtle"
                                    size="compact-sm"
                                    color="red"
                                    onClick={() => handleFileRemove(file)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </li>
                            ))}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </section>
            <TriageEventComments
              eventComments={eventQuery.data.triage_event_comments}
              eventId={params.id}
              avatarUrl={avatarUrl}
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

              {/* Activity Feed */}
              <div className="flow-root">
                <TriageEventTimeline eventId={params.id} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

const SelectItem = forwardRef<HTMLDivElement, MemberDTO>(
  ({ icon, label, description, ...others }: MemberDTO, ref) => (
    <div ref={ref} {...others}>
      <Group>
        <div>{icon}</div>
        <div className="flex flex-col space-y-1">
          <Text size="sm">{label}</Text>
          <Text size="xs" opacity={0.6}>
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

const statusOptions = [
  { value: "new", label: "New" },
  { value: "investigating", label: "Investigating" },
  { value: "cause_identified", label: "Cause identified" },
  { value: "fix_in_progress", label: "Fix in progress" },
  { value: "resolved", label: "Resolved" },
];

const severityOptions = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];
