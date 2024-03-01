import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Textarea, Select, LoadingOverlay } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import type { FileRejection } from "@mantine/dropzone";
import { createTriageEvent } from "@/api/triageEvents";
import { getTeamUsers } from "@/api/teams";
import { FileDropzone } from "@/app/_components/ui/FileDropzone";
import {
  IconPaperclip,
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

export const NewEventModal = ({
  handleNewEventNavigation,
}: NewEventModalProps) => {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [status, setStatus] = useState("new");
  const [originalPoster, setOriginalPoster] = useState("");
  const [triageOwner, setTriageOwner] = useState("");
  const [teamMembers, setTeamMembers] = useState<MemberDTO[]>([]);
  const [filesUploading, setFilesUploading] = useState(false);
  const [attachments, setAttachments] = useState<FileWithPath[]>([]);

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
      setLoading(false);

      handleNewEventNavigation(data.id);
      modals.closeAll();
    },
    onError: (error) => {
      showNotification({
        title: "Error creating event",
        message: error.message,
        color: "red",
      });
      setLoading(false);
    },
  });

  useEffect(() => {
    let isMounted = true;
    if (isMounted && !isLoading && teamUsers) {
      setTeamMembers(
        teamUsers
          .filter((user) => user.name)
          .map((user) => ({
            value: user.id,
            label: user.name ?? "",
            image: user.avatar_image_url ?? "",
          })),
      );
    }
    return () => {
      isMounted = false;
    };
  }, [isLoading, teamUsers]);

  const handleEventCreate = () => {
    setLoading(true);
    createEventMutation.mutate({
      description,
      severity,
      status,
      owner_id: triageOwner,
      attachments,
    });
  };

  const handleFilesDropped = async (files: File[]) => {
    setFilesUploading(true);
    if (files && files.length > 0) {
      setAttachments((prevFiles) => [...prevFiles, ...files]);
    }
    setFilesUploading(false);
  };

  const handleFilesReject = (files: FileRejection[]) => {
    showNotification({
      title: "File rejected",
      message: `The following file(s): ${files.map((file) => file.file.name).join(", ")} could not be added.`,
      color: "red",
    });
  };

  const handleFileRemove = (file: any) => {
    setAttachments((prevFiles) =>
      prevFiles.filter((f) => f.name !== file.name),
    );
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <LoadingOverlay visible={loading} />
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

      <div className="col-span-12">
        <FileDropzone
          loading={filesUploading}
          handleFilesDropped={handleFilesDropped}
          handleFilesReject={handleFilesReject}
        />
      </div>

      {attachments && attachments.length > 0 ? (
        <>
          {attachments.map((file) => (
            <li
              key={file.name}
              className="col-span-12 pl-3 pr-4 flex items-center justify-between text-sm"
            >
              <div className="w-0 flex-1 flex items-center">
                <IconPaperclip
                  className="flex-shrink-0 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
              </div>
              <div className="ml-4 flex-shrink-0 items-center">
                {!file.path ? (
                  <a
                    href={file.path}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="text-blue-500 hover:text-blue-600 items-center"
                  >
                    <IconCloudDownload size={18} strokeWidth={3} />
                  </a>
                ) : null}
              </div>
              <div className="ml-4 flex-shrink-0 items-center text-red-500 hover:text-red-600 hover:cursor-pointer">
                <IconTrash
                  size={18}
                  strokeWidth={2}
                  onClick={() => handleFileRemove(file)}
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
