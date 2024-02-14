/* eslint-disable @next/next/no-img-element */
import { Button, Select } from "@mantine/core";
import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useModals } from "@mantine/modals";
import he from "he";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { createPost } from "@/api/posts";
import { getJoinedGroups, getGroupById } from "@/api/groups";
import { getTeamUsers } from "@/api/teams";
import { CurrentUser } from "@/types/user";
import { Group } from "@/types/group";
import placeholderAvatar from "@/public/sunglasses.png";
import { ComposerEditor } from "@/app/_components/ui/ComposerEditor";

hljs.configure({
  languages: ["javascript", "ruby", "python", "rust"],
});

type ComposerModalProps = {
  groupId: string | null;
  teamId: string;
  homeFeed: boolean;
  user: CurrentUser;
};

type MentionDTO = {
  user_id: string | undefined;
  post_id: string;
  mentioned_user_id: string | undefined;
  group_id: string | null;
};

type MentionUserDTO = {
  id: string;
  value: string;
  avatar: string;
  uid: string;
};

export const ComposerModal = ({
  groupId,
  teamId,
  homeFeed,
  user,
}: ComposerModalProps) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [groupToPost, setGroupToPost] = useState<string | null>("my profile");

  const queryClient = useQueryClient();
  const modals = useModals();

  const groupsQuery = useQuery({
    queryKey: ["groups"],
    queryFn: getJoinedGroups,
    enabled: homeFeed,
  });

  const teamQuery = useQuery({
    queryKey: ["team-members"],
    queryFn: getTeamUsers,
  });

  const groupQuery = useQuery({
    queryKey: ["group-info", groupId],
    queryFn: () => getGroupById(groupId ?? ""),
    enabled: !!groupId,
  });

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: async (data) => {
      await getMentionsAndCreate(data.id);
      await queryClient.invalidateQueries({
        queryKey: ["feed", groupId, homeFeed],
      });
      modals.closeAll();
      setContent("");
    },
  });

  const mentions = useMemo(
    () => ({
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["@"],
      dataAttributes: ["id", "value", "uid"],
      source: (searchTerm: string, renderList: any, mentionChar: string) => {
        const list = teamQuery.data?.map((user) => {
          return {
            id: user.id,
            value: user.name,
            avatar: user.avatar_url,
            uid: user.id,
          };
        });
        const includesSearchTerm = list?.filter((item) =>
          item.value?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        renderList(includesSearchTerm);
      },
      onSelect: (item: any, insertItem: (item: any) => void) => {
        insertItem(item);
      },
    }),
    [teamQuery.data]
  );

  const handleImageUpload = useCallback(async (file: File) => {
    if (file && file.name) {
      // TODO: Replace with file upload
      return "https://via.placeholder.com/150";
    } else {
      return "";
    }
  }, []);

  const getMentionsAndCreate = async (postId: string) => {
    let mentionsToSave: MentionDTO[] = [];
    const mentionElements = Array.from(
      document.querySelectorAll(
        ".composer .ql-editor .mention"
      ) as NodeListOf<HTMLElement>
    );
    if (mentionElements && mentionElements.length > 0) {
      mentionElements.forEach((el) => {
        if (el.dataset.uid !== "null") {
          mentionsToSave.push({
            user_id: el.dataset.id,
            post_id: postId,
            mentioned_user_id: el.dataset.uid,
            group_id: groupId ? groupId : null,
          });
        }
      });
      //const { error } = await supabase.from("mentions").insert(mentionsToSave);
      //if (error) {
      //  console.error(error);
      //}
    }
  };

  const buildGroupValues = (groups: Group[]) => {
    const groupValues = groups.map((group) => {
      return group.name;
    });
    return ["my profile", ...groupValues];
  };

  const handlePostCreate = async () => {
    setLoading(true);
    let strippedHtml = content.replace(/<[^>]+>/g, "");
    let decodedStrippedHtml = he.decode(strippedHtml);
    if (decodedStrippedHtml.replaceAll(" ", "").length === 0) {
      decodedStrippedHtml = "Image/Video";
    }
    let postGroupId = groupId;
    if (groupToPost !== "my profile" && groupsQuery.data) {
      const postGroup = groupsQuery.data.find(
        (group) => group.name === groupToPost
      );
      postGroupId = postGroup ? postGroup.id : null;
    }
    if (user) {
      createPostMutation.mutate({
        content,
        text_content: decodedStrippedHtml,
        group_id: postGroupId,
      });
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 flex-shrink-0">
          <img
            className="h-12 w-12 rounded-full bg-white"
            src={user.avatar_url ? user.avatar_url : placeholderAvatar.src}
            alt=""
          />
        </div>
        <div className="ml-4 flex flex-col justify-center">
          <div className="font-medium theme-text -mb-2">{user?.name}</div>
          {homeFeed && groupsQuery.isSuccess && groupsQuery.data ? (
            <div className="flex flex-row items-center space-x-1 -mb-[6px]">
              <span className="text-sm mt-[2px]">Posting to</span>
              <Select
                value={groupToPost}
                size="sm"
                searchable
                nothingFoundMessage="No matches..."
                classNames={{
                  input: "focus:ring-0 w-fit-content",
                }}
                variant="unstyled"
                onChange={(val) => setGroupToPost(val)}
                data={buildGroupValues(groupsQuery.data)}
              ></Select>
            </div>
          ) : (
            <div className="theme-text-subtle text-xs">{user.email}</div>
          )}
        </div>
      </div>
      <div className="composer">
        <ComposerEditor
          composerContent={content}
          setComposerContent={setContent}
        />
      </div>
      <div className="bottom-row mt-4">
        <Button
          id="composer-post-btn"
          variant="gradient"
          gradient={{ from: "#a21caf", to: "blue", deg: 35 }}
          fullWidth
          disabled={
            loading || he.decode(content.replace(/<[^>]+>/g, "")).length === 0
          }
          size="md"
          onClick={() => handlePostCreate()}
        >
          Post it!
        </Button>
      </div>
    </>
  );
};
