import { useState } from "react";
import {
  Combobox,
  Group,
  Input,
  InputBase,
  Text,
  useCombobox,
} from "@mantine/core";

type CustomSelectOption = {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: string;
};

export function CustomSelect(
  props: any,
  { data }: { data: CustomSelectOption[] }
) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [value, setValue] = useState<string | null>(null);
  const selectedOption = data.find((item) => item.value === value);

  const options = data.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
      <SelectOption {...item} />
    </Combobox.Option>
  ));

  return (
    <Combobox
      {...props}
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(value) => {
        setValue(value);
        combobox.closeDropdown();
      }}
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
        />
        {selectedOption ? (
          <SelectOption {...selectedOption} />
        ) : (
          <Input.Placeholder>Select option</Input.Placeholder>
        )}
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

function SelectOption({ icon, label, description }: CustomSelectOption) {
  return (
    <Group>
      {icon}
      <div>
        <Text size="sm" fw={500}>
          {label}
        </Text>
        <Text size="xs" opacity={0.6}>
          {description}
        </Text>
      </div>
    </Group>
  );
}
