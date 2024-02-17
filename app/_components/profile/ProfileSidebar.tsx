import { Avatar } from "@mantine/core";
import type { TeamUser } from "@/types/user";

type ProfileSidebarProps = {
  profile: TeamUser;
};

export const ProfileSidebar = ({ profile }: ProfileSidebarProps) => {
  return (
    <div className="py-4 px-8 rounded shadow border theme-border">
      <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
        {profile.email ? (
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium theme-text-subtle">Email</dt>
            <dd className="mt-1 text-sm">{profile.email}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
};
