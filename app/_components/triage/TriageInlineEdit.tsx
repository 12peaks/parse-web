import { useState } from "react";
import { Button } from "@mantine/core";

type TriageInlineEditProps = {
  label: string;
  classes?: string;
  handleSave: () => void;
  inputComponent: React.ReactNode;
  displayComponent: React.ReactNode;
};

export const TriageInlineEdit = ({
  label,
  classes,
  handleSave,
  inputComponent,
  displayComponent,
}: TriageInlineEditProps) => {
  const [editingField, setEditingField] = useState(false);

  return (
    <div className={classes}>
      <dt className="text-sm font-medium theme-text-subtle flex flex-column items-center">
        {label}
        {editingField ? (
          <div className="flex flex-column items-center">
            <Button
              className="ml-1"
              variant="subtle"
              size="compact-xs"
              onClick={() => {
                handleSave();
                setEditingField(false);
              }}
            >
              Save
            </Button>
            <Button
              className="ml-1"
              variant="subtle"
              color="gray"
              onClick={() => setEditingField(false)}
              size="compact-xs"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            className="ml-1"
            variant="subtle"
            size="compact-xs"
            onClick={() => setEditingField(true)}
          >
            Edit
          </Button>
        )}
      </dt>
      <dd className="mt-1 text-sm theme-text flex flex-columns items-center">
        {editingField ? inputComponent : displayComponent}
      </dd>
    </div>
  );
};
