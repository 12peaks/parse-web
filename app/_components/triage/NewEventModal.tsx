import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Textarea, Select } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { createTriageEvent } from "@/api/triageEvents";
import { getTeamUsers } from "@/api/teams";
//import TriageFileDropzone from "./TriageFileDropzone";
//import { showNotification, updateNotification } from "@mantine/notifications";
//import { uploadTriageFile } from "../api/uploadTriageFile";
import {
  IconPaperclip,
  IconCheck,
  IconCloudDownload,
  IconTrash,
} from "@tabler/icons-react";

type NewEventModalProps = {
  handleNewEventNavigation: (eventId: string) => void;
};

type MemberDTO = {
  value: string;
  label: string;
  image: string;
};

export interface FileWithPath extends File {
  readonly path?: string;
}

type TriageFile = {
  file: FileWithPath;
  url: string;
};

const NewEventModal = ({ handleNewEventNavigation }: NewEventModalProps) => {
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [status, setStatus] = useState("new");
  const [originalPoster, setOriginalPoster] = useState("");
  const [triageOwner, setTriageOwner] = useState("");
  const [teamMembers, setTeamMembers] = useState<MemberDTO[]>([]);
  const [filesUploading, setFilesUploading] = useState(false);
  const [triageFiles, setTriageFiles] = useState<TriageFile[]>([]);

  const modals = useModals();
  const queryClient = useQueryClient();

  const { data: teamUsers, isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: () => getTeamUsers(),
  });

  const createEventMutation = useMutation({
    mutationFn: createTriageEvent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });

      handleNewEventNavigation(data.id);
      modals.closeAll();
    },
  });

  useEffect(() => {
    let isMounted = true;
    if (isMounted && !isLoading && teamUsers) {
      let members: MemberDTO[] = [];
      setTeamMembers(
        teamUsers
          .filter((user) => user.name)
          .map((user) => ({
            value: user.id,
            label: user.name ?? "",
            image: user.avatar_url ?? "",
          }))
      );
    }
    return () => {
      isMounted = false;
    };
  }, [isLoading, teamUsers]);

  const handleEventCreate = () => {
    createEventMutation.mutate({
      description,
      severity,
      status,
      owner_id: triageOwner,
    });
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <Select
        className="col-span-6"
        placeholder="Event status"
        label="Status"
        value={status}
        onChange={(value) => setStatus(value || "")}
        data={statusOptions}
      />
      <Select
        className="col-span-6"
        placeholder="Event severity"
        label="Severity"
        value={severity}
        onChange={(value) => setSeverity(value || "")}
        data={severityOptions}
      />

      <Select
        className="col-span-6"
        placeholder="Event reporter"
        label="Reporter"
        value={originalPoster}
        onChange={(value) => setOriginalPoster(value || "")}
        data={teamMembers}
        searchable
        nothingFoundMessage="Teammate not found"
      />

      <Select
        className="col-span-6"
        placeholder="Event owner"
        label="Owner"
        value={triageOwner}
        onChange={(value) => setTriageOwner(value || "")}
        data={teamMembers}
        searchable
        nothingFoundMessage="Teammate not found"
      />

      <Textarea
        className="col-span-12"
        placeholder="Event description"
        label="What's happening?"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
      />

      <div className="col-span-12"></div>

      {triageFiles && triageFiles.length > 0 ? (
        <>
          {triageFiles.map((file) => (
            <li
              key={file.file.name}
              className="col-span-12 pl-3 pr-4 flex items-center justify-between text-sm"
            >
              <div className="w-0 flex-1 flex items-center">
                <IconPaperclip
                  className="flex-shrink-0 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span className="ml-2 flex-1 w-0 truncate">
                  {file.file.name}
                </span>
              </div>
              <div className="ml-4 flex-shrink-0 items-center">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 hover:text-blue-600 items-center"
                >
                  <IconCloudDownload size={18} strokeWidth={3} />
                </a>
              </div>
              <div className="ml-4 flex-shrink-0 items-center text-red-500 hover:text-red-600 hover:cursor-pointer">
                <IconTrash
                  size={18}
                  strokeWidth={2}
                  onClick={() => console.log("Remove file")}
                />
              </div>
            </li>
          ))}
        </>
      ) : null}

      <Button
        className="col-span-6"
        variant="light"
        color="gray"
        onClick={() => modals.closeAll()}
      >
        Cancel
      </Button>

      <Button
        className="col-span-6"
        disabled={filesUploading}
        onClick={() => handleEventCreate()}
      >
        Create
      </Button>
    </div>
  );
};

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

export default NewEventModal;
