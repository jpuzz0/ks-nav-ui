import React from "react";
import { useParams } from "react-router-dom";

import { Nav, NavExpandable, NavItem, NavList } from "@patternfly/react-core";

import { getFilesByInstanceId, useFetchMockApi } from "../mockApi";
import { useKsNavContext } from "../context";
import { File, UrlParam } from "../types";

export const FileNav = () => {
  const { fileId } = useParams<UrlParam.FileId>();
  const { selectedInstance } = useKsNavContext();
  const files: File[] = useFetchMockApi(getFilesByInstanceId, [selectedInstance?.id]) || [];
  const focusedFile = files.find((file) => file.id === fileId);
  const selectedInstanceVersion =
    selectedInstance && `${selectedInstance.version} (${selectedInstance.note})`;

  const navItemDictionary: Record<string, string[]> = files.reduce((acc, { name: path }: File) => {
    const filePathParts = path.split("/");
    const fileName = filePathParts.pop() ?? "";

    filePathParts.reduce(
      (prev: any, pathPart, i) =>
        (prev[pathPart] =
          filePathParts.length - i - 1
            ? prev[pathPart] || {}
            : (prev[pathPart] || []).concat([fileName])),
      acc
    );

    return acc;
  }, {});

  const buildNavItems = React.useCallback(
    (navItemObject: Record<string, string[]> | string[], navItemPath: string = "") => {
      let navItems: React.ReactElement[] = [];

      if (Object.keys(navItemDictionary).length > 0) {
        navItems = Object.entries(navItemObject).map(([nestedNavKey, nestedNavValue]) => {
          let navItem: React.ReactElement;

          if (typeof nestedNavValue === "object") {
            // Keep track of paths unique to each nav expandable element
            // to determine which to expand based on the focused file.
            navItemPath = navItemPath ? `${navItemPath}/${nestedNavKey}` : nestedNavKey;

            navItem = (
              <NavExpandable
                key={nestedNavKey}
                title={nestedNavKey}
                isExpanded={focusedFile?.name.includes(navItemPath)}
              >
                {buildNavItems(nestedNavValue, navItemPath)}
              </NavExpandable>
            );

            navItemPath = "";
          } else {
            navItem = (
              <NavItem key={nestedNavValue} isActive={focusedFile?.name.includes(nestedNavValue)}>
                {nestedNavValue}
              </NavItem>
            );
          }

          return navItem;
        });
      }

      return navItems;
    },
    [focusedFile?.name, navItemDictionary]
  );

  return (
    <div
      style={{
        backgroundColor: "var(--pf-v5-global--BackgroundColor--dark-300)",
        height: "100vh",
        width: "300px",
      }}
    >
      <Nav aria-label="Files nav">
        <div
          style={{
            color: "var(--pf-v5-c-nav__link--Color)",
            padding: "24px 24px 10px 24px",
            textAlign: "left",
          }}
          title="Selected dataset version"
        >
          <b>{selectedInstanceVersion}</b>
        </div>
        <NavList>{buildNavItems(navItemDictionary)}</NavList>
      </Nav>
    </div>
  );
};
