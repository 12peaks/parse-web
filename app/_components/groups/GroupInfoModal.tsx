/* eslint-disable @next/next/no-img-element */
import { useState, forwardRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "@/api/groups";
import { updateGroup } from "@/api/groups";
import { Group } from "@/types/group";
import { useModals } from "@mantine/modals";
import { Button, Textarea, TextInput } from "@mantine/core";
import { GlobeAltIcon } from "@heroicons/react/24/solid";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { CustomSelect } from "@/app/_components/ui/CustomSelect";
import { showNotification } from "@mantine/notifications";

type GroupInfoModalProps = {
  group?: Group;
  handleNewNameNavigation?: (newUrl: string) => void;
};

const privacyOptions = [
  {
    label: "Public",
    description:
      "Anyone on your team can see who is in the group and what they post.",
    icon: (
      <GlobeAltIcon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
    ),
    value: "true",
  },
  {
    label: "Private",
    description: "Only members can see who is in the group and what they post.",
    icon: (
      <LockClosedIcon
        className="mr-3 flex-shrink-0 h-6 w-6"
        aria-hidden="true"
      />
    ),
    value: "false",
  },
];

const visibilityOptions = [
  {
    label: "Visible",
    description: "Anyone can find this group.",
    icon: <EyeIcon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />,
    value: "true",
  },
  {
    label: "Private",
    description: "Only members can find this group.",
    icon: (
      <EyeSlashIcon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
    ),
    value: "false",
  },
];

export const GroupInfoModal = ({
  group,
  handleNewNameNavigation,
}: GroupInfoModalProps) => {
  const [name, setName] = useState(group ? group.name : "");
  const [description, setDescription] = useState(
    group ? group.description ?? "" : ""
  );
  const [isGroupPublic, setIsGroupPublic] = useState(
    group ? (!group.is_private).toString() : "true"
  );
  const [isGroupVisible, setIsGroupVisible] = useState(
    group ? group.is_visible.toString() : "true"
  );
  const [iconPhotoUrl, setIconPhotoUrl] = useState(
    group ? group.avatar_url : ""
  );
  const headerImageUrl =
    "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80";

  const modals = useModals();
  const queryClient = useQueryClient();

  const handleFiles = async (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      console.log("REPLACE FILE UPLOADS");
    }
  };

  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: (data: Group) => {
      if (data && data.id) {
        queryClient.invalidateQueries({
          queryKey: ["group", data.url_slug],
        });
        queryClient.invalidateQueries({ queryKey: ["groups-joined"] });
        showNotification({
          title: "Success",
          message: "Group created",
          color: "teal",
        });
        modals.closeAll();
      }
    },
    onError: (error) => {
      showNotification({
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: updateGroup,
    onSuccess: (data: Group) => {
      if (data && data.id) {
        queryClient.invalidateQueries({
          queryKey: ["group", data.url_slug],
        });
        showNotification({
          title: "Success",
          message: "Group updated",
          color: "teal",
        });
        modals.closeAll();
      }
    },
    onError: (error) => {
      showNotification({
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });

  const handleGroupCreate = async () => {
    createGroupMutation.mutateAsync({
      name,
      description,
      is_private: isGroupPublic === "true" ? false : true,
      is_visible: isGroupVisible === "true" ? true : false,
    });
  };

  const handleGroupEdit = async () => {
    if (group) {
      updateGroupMutation.mutateAsync({
        id: group.id,
        name,
        description,
        is_private: isGroupPublic === "true" ? false : true,
        is_visible: isGroupVisible === "true" ? true : false,
      });
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <TextInput
        className="col-span-12"
        placeholder="Group name"
        label="Name"
        required
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      {/* Group Photo 
      <div className="col-span-6">
        <div className="mt-6 flex-grow lg:mt-0 lg:ml-6 lg:flex-grow-0 lg:flex-shrink-0">
          <p
            className="text-sm pt-1 font-medium text-[#212529]"
            aria-hidden="true"
          >
            Group photo
          </p>
          <div className="hidden relative rounded-full overflow-hidden mt-2 lg:block">
            {iconPhotoUrl ? (
              <img
                className="relative rounded-full w-40 h-40 mx-auto flex items-center border border-gray-200 shadow mb-1"
                src={iconPhotoUrl}
                alt=""
              />
            ) : (
              <div className="relative rounded-full w-40 h-40 mx-auto border flex items-center justify-center border-gray-200 shadow mb-1">
                <PhotoIcon className="h-16 w-16 text-gray-500" />
              </div>
            )}

            <label
              htmlFor="desktop-group-photo"
              className="absolute mx-auto inset-0 w-40 h-40 rounded-full bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100"
            >
              <span>Change</span>
              <span className="sr-only"> user photo</span>
              <input
                type="file"
                id="desktop-group-photo"
                onChange={(e) => handleFiles(e.currentTarget.files)}
                accept="image/*"
                name="user-photo"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md"
              />
            </label>
          </div>
          <div className="mt-1 lg:hidden">
            <div className="flex items-center">
              <div
                className="flex-shrink-0 inline-block rounded-full overflow-hidden h-12 w-12"
                aria-hidden="true"
              >
                {iconPhotoUrl ? (
                  <img
                    className="relative rounded-full w-full h-full mx-auto border border-gray-200 shadow mb-1"
                    src={iconPhotoUrl}
                    alt=""
                  />
                ) : (
                  <div className="relative rounded-full w-full h-full mx-auto border flex items-center justify-center border-gray-200 shadow mb-1">
                    <PhotoIcon className="h-8 w-8 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="ml-5 rounded-md shadow-sm">
                <div className="group relative border border-gray-300 rounded-md py-2 px-3 flex items-center justify-center hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500">
                  <label
                    htmlFor="mobile-user-photo"
                    className="relative text-sm leading-4 font-medium text-gray-700 pointer-events-none"
                  >
                    <span>Change</span>
                    <span className="sr-only"> group photo</span>
                  </label>
                  <input
                    id="mobile-user-photo"
                    name="user-photo"
                    type="file"
                    className="absolute w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      */}

      <Textarea
        className="col-span-12"
        placeholder="Group description"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
      />

      <CustomSelect
        className="col-span-6"
        label="Privacy"
        placeholder="Select option"
        defaultValue={isGroupPublic}
        setValue={setIsGroupPublic}
        data={privacyOptions}
      />

      <CustomSelect
        className={`col-span-6 ${isGroupPublic === "true" ? "visible" : "invisible"}`}
        label="Visibility"
        defaultValue={isGroupVisible}
        setValue={setIsGroupVisible}
        data={visibilityOptions}
      />

      <Button
        className="col-span-6"
        variant="light"
        color="gray"
        onClick={() => modals.closeAll()}
      >
        Cancel
      </Button>
      {group && group.id ? (
        <Button className="col-span-6" onClick={() => handleGroupEdit()}>
          Save
        </Button>
      ) : (
        <Button className="col-span-6" onClick={() => handleGroupCreate()}>
          Create
        </Button>
      )}
    </div>
  );
};
