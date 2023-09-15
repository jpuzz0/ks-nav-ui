import React from "react";
import { useNavigate } from "react-router-dom";

import { InputGroup, InputGroupItem, Button, ButtonVariant } from "@patternfly/react-core";
import ArrowRightIcon from "@patternfly/react-icons/dist/esm/icons/arrow-right-icon";

import { useKsNavContext } from "../context";
import { getFileDetails } from "../mockApi";
import { getFilePath } from "../utils";
import { SymbolSelect } from "./SymbolSelect";

interface SymbolSearchProps {
  onSearch?(symbolName: string | undefined): void;
}

export const SymbolSearch = ({ onSearch }: SymbolSearchProps) => {
  const { selectedInstance, selectedSymbol } = useKsNavContext();
  const navigate = useNavigate();

  const onSubmit = React.useCallback(async () => {
    const instanceId = selectedInstance?.id;
    const symbolName = selectedSymbol?.name;

    if (instanceId && symbolName) {
      const fileDetails = await getFileDetails(instanceId, symbolName);

      navigate(getFilePath(fileDetails?.id));
    }

    symbolName && onSearch?.(symbolName);
  }, [selectedInstance?.id, selectedSymbol?.name, navigate, onSearch]);

  return (
    <InputGroup>
      <InputGroupItem style={{ width: "100%" }}>
        <SymbolSelect />
      </InputGroupItem>

      <InputGroupItem isPlain>
        <Button
          type="submit"
          variant={ButtonVariant.control}
          aria-label="Search by symbol name"
          onClick={onSubmit}
          isDisabled={!selectedSymbol}
        >
          <ArrowRightIcon />
        </Button>
      </InputGroupItem>
    </InputGroup>
  );
};
