import { Dispatch, SetStateAction } from "react";
import { Combobox, Input, InputBase, Text, useCombobox } from "@mantine/core";

export type Item = {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: string;
};

export function CustomSelect({
  data,
  defaultValue,
  setValue,
  ...comboboxProps
}: {
  data: Item[];
  defaultValue: string | null;
  setValue: Dispatch<SetStateAction<string>>;
  [key: string]: any;
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const selectedOption = data.find((item) => item.value === defaultValue);

  const options = data.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
      <SelectOption {...item} />
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(value) => {
        setValue(value);
        combobox.closeDropdown();
      }}
      {...comboboxProps}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          multiline
        >
          {selectedOption ? (
            <SelectOption {...selectedOption} />
          ) : (
            <Input.Placeholder>Select option</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

function SelectOption({ icon, label, description }: Item) {
  return (
    <div className="flex flex-row space-x-2">
      <div>{icon}</div>
      <div>
        <Text size="sm" fw={500}>
          {label}
        </Text>
        <Text size="xs" opacity={0.6}>
          {description}
        </Text>
      </div>
    </div>
  );
}
