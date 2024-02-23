/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, TextInput } from "@mantine/core";
import { updateUser } from "@/api/users";
import { useModals } from "@mantine/modals";
import type { TeamUser } from "@/types/user";
import { FileWithPath } from "@mantine/dropzone";

type EditProfileProps = {
  profile: TeamUser;
};

export const EditProfileModal = ({ profile }: EditProfileProps) => {
  const [name, setName] = useState(profile && profile.name ? profile.name : "");
  const [avatar, setAvatar] = useState<File | null>(null);

  const [email, setEmail] = useState(
    profile && profile.email ? profile.email : ""
  );

  const [iconPhotoUrl, setIconPhotoUrl] = useState(
    profile && profile.avatar_url ? profile.avatar_url : ""
  );

  const modals = useModals();
  const queryClient = useQueryClient();

  const handleFiles = async (files: FileList | null) => {
    if (files && files.length > 0) {
      setAvatar(files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setIconPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const updateProfileMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["profile", profile.id],
      });
      modals.closeAll();
    },
  });

  const handleProfileEdit = async () => {
    updateProfileMutation.mutate({
      name: name,
      avatar: avatar ?? undefined,
    });
  };

  return (
    <div className="">
      <div>
        <h2 className="text-lg leading-6 font-medium">Profile</h2>
        <p className="mt-1 text-sm theme-text-subtle">
          This information will be displayed on your profile page to team
          members.
        </p>
      </div>

      <div className="mt-6 flex flex-col lg:flex-row">
        <div className="mt-6 flex-grow lg:mt-0 lg:flex-grow-0 lg:flex-shrink-0">
          <p className="text-sm font-medium" aria-hidden="true">
            Photo
          </p>
          <div className="mt-1 lg:hidden">
            <div className="flex items-center">
              <div
                className="flex-shrink-0 inline-block rounded-full overflow-hidden h-12 w-12"
                aria-hidden="true"
              >
                <img
                  className="rounded-full h-full w-full"
                  src={iconPhotoUrl}
                  alt=""
                />
              </div>
              <div className="ml-5 rounded-md shadow-sm">
                <div className="group relative border theme-border rounded-md py-2 px-3 flex items-center justify-center hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <label
                    htmlFor="mobile-user-photo"
                    className="relative text-sm leading-4 font-medium theme-text-subtle pointer-events-none"
                  >
                    <span>Change</span>
                    <span className="sr-only"> user photo</span>
                  </label>
                  <input
                    id="mobile-user-photo"
                    name="user-photo"
                    type="file"
                    onChange={(e) => handleFiles(e.currentTarget.files)}
                    accept="image/*"
                    className="absolute w-full h-full opacity-0 cursor-pointer theme-border rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="hidden relative rounded-full overflow-hidden lg:block">
            <img
              className="relative rounded-full w-40 h-40 bg-white"
              src={iconPhotoUrl}
              alt=""
            />
            <label
              htmlFor="desktop-profile-photo"
              className="absolute inset-0 w-full h-full bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100"
            >
              <span>Change</span>
              <span className="sr-only"> user photo</span>
              <input
                type="file"
                id="desktop-profile-photo"
                name="user-photo"
                onChange={(e) => handleFiles(e.currentTarget.files)}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer theme-border rounded-md"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 sm:col-span-6">
          <TextInput
            type="text"
            name="name"
            id="name"
            label="Name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </div>

        <div className="col-span-12 sm:col-span-6">
          <TextInput
            type="text"
            name="email"
            label="Email"
            id="email"
            value={email}
            disabled
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </div>

        <Button
          className="col-span-6"
          variant="light"
          color="gray"
          onClick={() => modals.closeAll()}
        >
          Cancel
        </Button>

        <Button className="col-span-6" onClick={() => handleProfileEdit()}>
          Save
        </Button>
      </div>
    </div>
  );
};
