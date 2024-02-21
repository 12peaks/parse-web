import { CurrentUser } from "@/types/user";

type TriagedEventCommentsProps = {
  eventId: string;
  avatarUrl: string;
  user: CurrentUser;
};

export const TriageEventComments = ({
  eventId,
  avatarUrl,
  user,
}: TriagedEventCommentsProps) => {
  return (
    <div>
      <h1>TriagedEventComments</h1>
    </div>
  );
};
