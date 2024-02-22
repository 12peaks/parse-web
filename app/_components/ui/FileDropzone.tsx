import { Group, Text, rem } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import {
  Dropzone,
  DropzoneProps,
  FileRejection,
  FileWithPath,
} from "@mantine/dropzone";

type FileDropzoneProps = {
  handleFilesDropped: (files: FileWithPath[]) => void;
  handleFilesReject: (files: FileRejection[]) => void;
} & Partial<DropzoneProps>;

export function FileDropzone({
  handleFilesDropped,
  handleFilesReject,
  ...props
}: FileDropzoneProps) {
  return (
    <Dropzone
      onDrop={(files) => handleFilesDropped(files)}
      onReject={(files) => handleFilesReject(files)}
      maxSize={20 * 1024 ** 2}
      {...props}
    >
      <Group
        justify="center"
        gap="xl"
        mih={140}
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-blue-6)",
            }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-red-6)",
            }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-dimmed)",
            }}
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag files here or click to select files
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Attach as many files as you like, each file should not exceed 20mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}
