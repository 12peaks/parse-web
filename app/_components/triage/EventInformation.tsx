import { useState, useEffect, forwardRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Select,
  Text,
  Textarea,
  Avatar,
  Group,
} from "@mantine/core";
import { IconPaperclip } from "@tabler/icons-react";
import { getTeamUsers } from "@/api/teams";
import { updateTriageEvent, createTimelineEvent } from "@/api/triageEvents";
import { CustomSelect } from "@/app/_components/ui/CustomSelect";
import type { TriageEvent } from "@/types/triageEvent";
import { CurrentUser } from "@/types/user";
import type { TriageFile } from "@/types/triageEvent";
import { TriageInlineEdit } from "./TriageInlineEdit";

type EventInformationProps = {
  event: TriageEvent;
  user: CurrentUser;
};

type MemberDTO = {
  icon: React.ReactNode;
  description: string;
  label: string;
  value: string;
};

export const EventInformation = ({ event, user }: EventInformationProps) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [teamMembers, setTeamMembers] = useState<MemberDTO[]>([]);
  const [newStatus, setNewStatus] = useState(event ? event.status : "");
  const [newSeverity, setNewSeverity] = useState(event ? event.severity : "");
  const [newOwner, setNewOwner] = useState(event ? event.owner_id ?? "" : "");
  const [newReporter, setNewReporter] = useState<string>(
    event ? event.user_id ?? "" : ""
  );
  const [newDescription, setNewDescription] = useState(
    event ? event.description : ""
  );

  const teamMembersQuery = useQuery({
    queryKey: ["team-members"],
    queryFn: () => getTeamUsers(),
  });

  const queryClient = useQueryClient();

  const saveEventMutation = useMutation({
    mutationFn: updateTriageEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["event", event.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["timeline-events", event.id],
      });
    },
  });

  const createTimelineEventMutation = useMutation({
    mutationFn: createTimelineEvent,
  });

  const handleStatusSave = () => {
    if (event) {
      if (newStatus !== event.status) {
        createTimelineEventMutation.mutate({
          old_value: event.status,
          new_value: newStatus,
          field: "status",
          triage_event_id: event.id,
        });
        saveEventMutation.mutate({
          id: event.id,
          status: newStatus,
        });
      }
    }
  };

  const handleSeveritySave = () => {
    if (event) {
      if (newSeverity !== event.severity) {
        createTimelineEventMutation.mutate({
          old_value: event.severity,
          new_value: newSeverity,
          field: "severity",
          triage_event_id: event.id,
        });
        saveEventMutation.mutate({
          id: event.id,
          severity: newSeverity,
        });
      }
    }
  };

  const handleDescriptionSave = () => {
    if (event) {
      if (newDescription !== event.description) {
        createTimelineEventMutation.mutate({
          old_value: event.description,
          new_value: newDescription,
          field: "description",
          triage_event_id: event.id,
        });
        saveEventMutation.mutate({
          id: event.id,
          description: newDescription,
        });
      }
    }
  };

  function getNewName(id: string): string | undefined {
    if (teamMembersQuery.data) {
      for (const teamMember of teamMembersQuery.data) {
        if (teamMember.id === id) {
          return teamMember.name;
        }
      }
    }
  }

  const handleOwnerSave = () => {
    if (event) {
      const newOwnerId = newOwner;
      if (newOwnerId !== event.owner_id) {
        const triageEventId = event.id;
        createTimelineEventMutation.mutate({
          old_value: event.owner.name,
          new_value: getNewName(newOwner) || "",
          field: "owner",
          triage_event_id: event.id,
        });
        saveEventMutation.mutate({
          id: triageEventId,
          owner_id: newOwnerId,
        });
      }
    }
  };

  const handleReporterSave = () => {
    if (event) {
      const newReporterId = newReporter;
      if (newReporterId !== event.user_id) {
        createTimelineEventMutation.mutate({
          old_value: event.user.name,
          new_value: getNewName(newReporter) || "",
          field: "reporter",
          triage_event_id: event.id,
        });
        saveEventMutation.mutate({
          id: event.id,
          user_id: newReporterId,
        });
      }
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

  return (
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
            <TriageInlineEdit
              label="Reporter"
              classes="sm:col-span-1"
              handleSave={handleReporterSave}
              inputComponent={
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
              }
              displayComponent={
                <>
                  <Avatar
                    className="bg-white mr-2"
                    size={32}
                    src={event.user.avatar_url}
                    alt="reporter"
                  />
                  <div>{event.user?.name}</div>
                </>
              }
            />

            <TriageInlineEdit
              label="Owner"
              classes="sm:col-span-1"
              handleSave={handleOwnerSave}
              inputComponent={
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
              }
              displayComponent={
                <>
                  <Avatar
                    className="bg-white mr-2"
                    size={32}
                    src={event.owner?.avatar_url}
                    alt="owner"
                  />
                  <div>{event.owner?.name}</div>
                </>
              }
            />

            <TriageInlineEdit
              label="Severity"
              classes="sm:col-span-1"
              handleSave={handleSeveritySave}
              inputComponent={
                <Select
                  placeholder="Event severity"
                  value={newSeverity}
                  onChange={(value) => setNewSeverity(value || "")}
                  data={severityOptions}
                />
              }
              displayComponent={
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
              }
            />

            <TriageInlineEdit
              label="Status"
              classes="sm:col-span-1 capitalize"
              handleSave={handleStatusSave}
              inputComponent={
                <Select
                  placeholder="Event status"
                  value={newStatus}
                  onChange={(value) => setNewStatus(value || "")}
                  data={statusOptions}
                />
              }
              displayComponent={event.status.split("_").join(" ")}
            />

            <TriageInlineEdit
              label="Description"
              classes="sm:col-span-2"
              handleSave={handleDescriptionSave}
              inputComponent={
                <Textarea
                  className="w-full"
                  placeholder="Event description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.currentTarget.value)}
                />
              }
              displayComponent={event.description}
            />

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
                  {event.attachments_data &&
                    event.attachments_data.map((file) => (
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
  );
};

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
