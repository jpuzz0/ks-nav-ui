import React from "react";
import { Button } from "@patternfly/react-core";

interface FileSourceCodeProps {
  children: React.ReactNode;
  symbolNames: string[] | undefined;
  setFocusedSymbol(symbol: { name: string | undefined }): void;
}

export const FileSourceCode = ({
  children,
  symbolNames,
  setFocusedSymbol,
}: FileSourceCodeProps) => {
  const sourceCode = decodeURIComponent(String(children || ""));
  const symbolNameRegex = new RegExp(`(${symbolNames?.join("|")})`, "g");

  const onLinkClick = React.useCallback(
    (symbolName: string | undefined) => setFocusedSymbol({ name: symbolName }),
    [setFocusedSymbol]
  );

  const getLinkedSourceCode = (regex: RegExp) => {
    const sourceCodeParts = sourceCode.split(regex);

    return sourceCodeParts.map((codePart, index) => {
      if (regex.test(codePart)) {
        return (
          <Button
            key={`${codePart}-${index}`} // index to account for multiple instances of the same symbol
            variant="link"
            isInline
            component="span"
            onClick={() => onLinkClick(codePart)}
          >
            {codePart}
          </Button>
        );
      }

      return codePart;
    });
  };

  return (
    <pre style={{ fontSize: "12px", overflow: "scroll" }}>
      {getLinkedSourceCode(symbolNameRegex)}
    </pre>
  );
};
