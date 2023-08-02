import React from "react";
import { KernelSymbolTopology } from "./KernelSymbolTopology";
import { Flex, SearchInput } from "@patternfly/react-core";

interface KernelSearchProps {
  initialSymbolId?: string;
}

export const KernelSearch = ({ initialSymbolId }: KernelSearchProps) => {
  const [searchValue, setSearchValue] = React.useState(initialSymbolId);
  const [symbolId, setSymbolId] = React.useState<string>();

  console.log("symbolId: ", symbolId);

  return (
    <Flex direction={{ default: "column" }}>
      <SearchInput
        placeholder="Search by symbol"
        value={searchValue}
        onChange={(_event, value) => setSearchValue(value)}
        onSearch={(_event, value) => setSymbolId(value)}
        onClear={() => setSymbolId("")}
      />
      <KernelSymbolTopology startNodeId={symbolId} />
    </Flex>
  );
};
