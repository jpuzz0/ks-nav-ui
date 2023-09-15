import React from "react";

import {
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  useFormContext,
} from "@patternfly/react-core";

import { FieldId, Instance } from "../types";
import { getInstances, useFetchMockApi } from "../mockApi";
import { useKsNavContext } from "../context";
import { getInstanceVersion } from "../utils";

interface InstanceSelectProps {
  placeholder: string;
}

export const InstanceSelect = ({ placeholder }: InstanceSelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { setSelectedInstance, setSelectedSymbol } = useKsNavContext();
  const { getValue, setValue } = useFormContext();
  const instances = useFetchMockApi(getInstances) as unknown as Instance[];
  const selectedInstanceVersion = getValue(FieldId.InstanceVersion);

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: any) => {
    const instance: Instance = value;
    const instanceVersion = getInstanceVersion(instance);

    if (instanceVersion !== selectedInstanceVersion) {
      setValue(FieldId.InstanceVersion, instanceVersion);
      setValue(FieldId.SymbolName, "");
      setSelectedSymbol(undefined);
    }

    setSelectedInstance(value);
    setIsOpen(false);
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle ref={toggleRef} onClick={() => setIsOpen(!isOpen)} isExpanded={isOpen} isFullWidth>
      {selectedInstanceVersion || placeholder}
    </MenuToggle>
  );

  return (
    <Select
      id="instance-version-select"
      isOpen={isOpen}
      selected={selectedInstanceVersion}
      onSelect={onSelect}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      toggle={toggle}
      shouldFocusToggleOnSelect
    >
      <SelectList>
        {instances?.map((instance) => (
          <SelectOption key={instance.id} value={instance}>
            {getInstanceVersion(instance)}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  );
};
