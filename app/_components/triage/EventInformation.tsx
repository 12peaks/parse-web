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

  const queryClient = useQueryClient();

  const teamMembersQuery = useQuery({
    queryKey: ["team-members"],
    queryFn: () => getTeamUsers(),
  });

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

  const handleFieldSave = ({
    field,
    newValue,
    oldValue,
    fieldKey,
    valueTransform,
  }: {
    field: string;
    newValue: string;
    oldValue?: string;
    fieldKey?: string;
    valueTransform?: (val: string) => string;
  }) => {
    const key = fieldKey || field;
    const oldFieldValue = oldValue ?? event[key as keyof TriageEvent];
    if (newValue === oldFieldValue) return;

    const transformOldValue = () => {
      if (valueTransform && typeof oldFieldValue === "string") {
        return valueTransform(oldFieldValue);
      } else if (typeof oldFieldValue === "string") {
        return oldFieldValue;
      } else {
        null;
      }
    };

    const transformNewValue = () => {
      if (valueTransform) {
        return valueTransform(newValue);
      }
      return newValue;
    };

    createTimelineEventMutation.mutate({
      old_value: transformOldValue(),
      new_value: transformNewValue(),
      field: field,
      triage_event_id: event.id,
    });

    saveEventMutation.mutate({
      id: event.id,
      [key]: newValue,
    });
  };

  function getNameFromId(id: string): string {
    let newName = "";
    if (teamMembersQuery.data) {
      for (const teamMember of teamMembersQuery.data) {
        if (teamMember.id === id) {
          newName = teamMember.name ?? "";
        }
      }
    }
    return newName;
  }

  const handleFileRemove = (file: TriageFile) => {
    console.log("remove file", file);
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted && teamMembersQuery.isSuccess && teamMembersQuery.data) {
      let members: MemberDTO[] = [];
      teamMembersQuery.data.forEach((teamMember) => {
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
              handleSave={() =>
                handleFieldSave({
                  field: "reporter",
                  newValue: newReporter,
                  oldValue: event.user_id,
                  fieldKey: "user_id",
                  valueTransform: getNameFromId,
                })
              }
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
              handleSave={() =>
                handleFieldSave({
                  field: "owner",
                  newValue: newOwner,
                  oldValue: event.owner.id,
                  fieldKey: "owner_id",
                  valueTransform: getNameFromId,
                })
              }
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
              handleSave={() =>
                handleFieldSave({ field: "severity", newValue: newSeverity })
              }
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
              handleSave={() =>
                handleFieldSave({ field: "status", newValue: newStatus })
              }
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
              handleSave={() =>
                handleFieldSave({
                  field: "description",
                  newValue: newDescription,
                })
              }
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
