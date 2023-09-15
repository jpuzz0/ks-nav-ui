import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Button,
  Divider,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelContent,
  Flex,
  FlexItem,
  Page,
  PageSidebar,
  PageSidebarBody,
  Switch,
} from "@patternfly/react-core";
import OutlinedWindowRestoreIcon from "@patternfly/react-icons/dist/esm/icons/outlined-window-restore-icon";

import { getFileDetailsById } from "../mockApi";
import { FileDetails, RoutePath, FocusedSymbol, UrlParam } from "../types";
import {
  SymbolTopology,
  FileSourceCode,
  SymbolSearch,
  FileNav,
  FileBreadcrumb,
} from "../components";
import { useKsNavContext } from "../context";

export const FileDetailsPage = () => {
  const navigate = useNavigate();
  const { selectedInstance, selectedSymbol, setSelectedInstance, setSelectedSymbol } =
    useKsNavContext();
  const [fileDetails, setFileDetails] = React.useState<FileDetails>();
  const [focusedSymbol, setFocusedSymbol] = React.useState<FocusedSymbol | undefined>(
    selectedSymbol
  );
  const [initialSelectedIds, setInitialSelectedIds] = React.useState<string[] | undefined>([]);
  const [isDrawerVisible, setIsDrawerVisible] = React.useState(true);
  const { fileId } = useParams<UrlParam.FileId>();

  // Navigate to the home page if instance context is lost on page reload
  // TODO, read querystring with instanceId so users can come back to the same results
  React.useEffect(() => {
    if (!selectedInstance) {
      navigate(RoutePath.Home);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFileDetails = React.useCallback(async () => {
    const details: FileDetails = await getFileDetailsById(fileId);

    // Redirect to the landing page if the fileId does not exist
    if (!details) {
      navigate(RoutePath.Home);
    }

    setFileDetails(details);
  }, [fileId, navigate]);

  // Fetch file details when the component initially renders or the fileId changes
  React.useEffect(() => {
    fetchFileDetails();
  }, [fetchFileDetails]);

  const onUpdateInstanceClick = React.useCallback(() => {
    setSelectedInstance(undefined);
    setSelectedSymbol(undefined);
    navigate(RoutePath.Home, { replace: true });
  }, [navigate, setSelectedInstance, setSelectedSymbol]);

  const onGraphElementSelect = React.useCallback((selectedIds?: string[] | undefined) => {
    setFocusedSymbol(undefined);
    // Maintain a record of selected IDs to be used when/if re-rendering the topology view,
    // specifically when showing/hiding via the header's switch.
    setInitialSelectedIds(selectedIds);
  }, []);

  return (
    <Page
      isManagedSidebar
      sidebar={
        <PageSidebar>
          <PageSidebarBody>
            <FileNav />
          </PageSidebarBody>
        </PageSidebar>
      }
      mainContainerId="file-details-page"
    >
      <Drawer isExpanded={isDrawerVisible} position="bottom" style={{ maxHeight: "100vh" }}>
        <DrawerContent
          panelContent={
            <DrawerPanelContent
              isResizable
              defaultSize="50%"
              minSize="50%"
              maxSize="calc(100% - 76px)"
            >
              <SymbolTopology
                startNode={focusedSymbol}
                initialSelectedIds={initialSelectedIds}
                onSelect={onGraphElementSelect}
                controlButtons={(selectedIds: string[]) => [
                  {
                    id: "open-new-window-button",
                    icon: <OutlinedWindowRestoreIcon />,
                    tooltip: "Open new window",
                    ariaLabel: "Open new window",
                    callback: () =>
                      window.open(
                        `${RoutePath.Graph}?${new URLSearchParams(
                          selectedIds.map((id) => ["id", id])
                        ).toString()}`,
                        "_blank"
                      ),
                  },
                ]}
              />
            </DrawerPanelContent>
          }
        >
          <DrawerContentBody
            style={{
              maxHeight: isDrawerVisible ? "50%" : "100%",
            }}
          >
            <Flex
              direction={{ default: "column" }}
              flexWrap={{ default: "nowrap" }}
              style={{ height: "100%" }}
            >
              <Flex
                justifyContent={{ default: "justifyContentSpaceBetween" }}
                flexWrap={{ default: "nowrap" }}
              >
                <FileBreadcrumb fileName={fileDetails?.name} />

                <FlexItem
                  align={{ default: "alignRight" }}
                  style={{ padding: "20px", paddingBottom: "12px" }}
                >
                  <Flex
                    flexWrap={{ default: "nowrap" }}
                    alignItems={{ default: "alignItemsCenter" }}
                  >
                    <div style={{ whiteSpace: "nowrap" }}>
                      <Switch
                        id="toggle-graph-switch"
                        label="Show graph"
                        isChecked={isDrawerVisible}
                        onChange={() => setIsDrawerVisible((prevValue) => !prevValue)}
                      />
                    </div>

                    <Button onClick={onUpdateInstanceClick} variant="secondary">
                      Select new dataset
                    </Button>

                    <SymbolSearch
                      onSearch={(symbolName) =>
                        symbolName !== focusedSymbol?.name && setFocusedSymbol({ name: symbolName })
                      }
                    />
                  </Flex>
                </FlexItem>
              </Flex>

              <Divider style={{ marginBottom: 0 }} />

              <FlexItem
                style={{
                  padding: "20px",
                  overflow: "scroll",
                  height: "100%",
                }}
              >
                <FileSourceCode
                  symbolNames={fileDetails?.symbolNames}
                  setFocusedSymbol={(name) => {
                    setFocusedSymbol(name);
                    !isDrawerVisible && setIsDrawerVisible(true);
                  }}
                >
                  {fileDetails?.sourceCode}
                </FileSourceCode>
              </FlexItem>
            </Flex>
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </Page>
  );
};
