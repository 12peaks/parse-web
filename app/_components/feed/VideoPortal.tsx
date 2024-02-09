import { createPortal } from "react-dom";
import { useEffect, useCallback } from "react";
import { setup, isSupported } from "@loomhq/record-sdk";
import { oembed } from "@loomhq/loom-embed";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useModals } from "@mantine/modals";
import { createPost } from "@/api/posts";
import he from "he";
import { showNotification } from "@mantine/notifications";
import { getGroupById } from "@/api/groups";
import { CurrentUser } from "@/types/user";

const PUBLIC_APP_ID = process.env.NEXT_PUBLIC_LOOM_APP_ID;
const BUTTON_ID = "loom-record-sdk-button";

type VideoPortalProps = {
  isActive: boolean;
  groupId: string | null;
  teamId: string;
  user: CurrentUser;
  homeFeed: boolean;
  endPortal: () => void;
};

export const VideoPortal = ({
  isActive,
  groupId,
  teamId,
  homeFeed,
  user,
  endPortal,
}: VideoPortalProps) => {
  const queryClient = useQueryClient();
  const modals = useModals();

  const groupQuery = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => getGroupById(groupId ?? ""),
    enabled: !!groupId,
  });

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["posts", groupId, teamId, user.id, homeFeed],
      });
      modals.closeAll();
    },
  });

  const handlePostCreate = useCallback(
    async (html: string) => {
      let strippedHtml = html.replace(/<[^>]+>/g, "");
      let decodedStrippedHtml = he.decode(strippedHtml);
      if (decodedStrippedHtml.replaceAll(" ", "").length === 0) {
        decodedStrippedHtml = "Video";
      }
      let postGroupId = groupId;
      if (user) {
        createPostMutation.mutate({
          content: html,
          text_content: decodedStrippedHtml,
          group_id: postGroupId,
        });
      }
    },
    [groupId, user, createPostMutation]
  );

  useEffect(() => {
    async function initLoom() {
      const { supported, error } = await isSupported();

      if (!supported) {
        console.warn(`Error setting up Loom: ${error}`);
        return;
      }

      const button = document.getElementById(BUTTON_ID);

      if (!button) {
        return;
      }

      const { configureButton } = await setup({
        publicAppId: PUBLIC_APP_ID,
      });

      const sdkButton = configureButton({ element: button });

      sdkButton.openPreRecordPanel();

      sdkButton.on("insert-click", async (video: any) => {
        const { html } = await oembed(video.sharedUrl, { width: 400 });
        await handlePostCreate(html);
        showNotification({
          title: "Video posted",
          message: `Video was posted to ${
            groupId && groupQuery.data ? groupQuery.data.name : "your profile"
          }`,
          autoClose: 7000,
          color: "green",
        });
        endPortal();
      });

      sdkButton.on("cancel", () => {
        showNotification({
          title: "Recording cancelled",
          message: "Cancelled recording your video",
        });
        endPortal();
      });
    }
    if (isActive) {
      initLoom();
    }
  }, [endPortal, groupId, groupQuery.data, handlePostCreate, isActive]);

  return createPortal(<div id={BUTTON_ID}></div>, document.body);
};
