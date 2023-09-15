import React from "react";

import {
  TaskNode,
  NodeComponentProps,
  WithContextMenuProps,
  WithSelectionProps,
  withContextMenu,
  Node,
} from "@patternfly/react-topology";
import {
  Button,
  Divider,
  List,
  ListItem,
  Modal,
  ModalVariant,
  Title,
} from "@patternfly/react-core";

import { SourceNodeMenu } from "./SourceNodeMenu";

type SymbolNodeProps = NodeComponentProps & WithSelectionProps & WithContextMenuProps;

const SymbolNodeInternal = ({
  onContextMenu,
  contextMenuOpen,
  element,
  ...props
}: SymbolNodeProps) => {
  const [isDetailsModalOpen, setIsDetailsModelOpen] = React.useState(false);
  const symbolName = element.getId();
  const nodeData = element.getData();
  const targetNodes: string[] = nodeData?.targets;

  React.useEffect(() => {
    element.setData({
      ...nodeData,
      onDetailsMenuItemClick: () => setIsDetailsModelOpen(true),
    });
  }, [element, isDetailsModalOpen, nodeData]);

  const closeDetailsModal = () => setIsDetailsModelOpen(false);

  return (
    <>
      <TaskNode
        element={element}
        {...(targetNodes && {
          onContextMenu,
          contextMenuOpen,
        })}
        {...props}
      />

      <Modal
        variant={ModalVariant.small}
        title={`Details for ${symbolName}`}
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        actions={[
          <Button key="close" isInline onClick={closeDetailsModal}>
            Close
          </Button>,
        ]}
      >
        <Title
          headingLevel="h4"
          style={{ fontSize: "17px" }}
        >{`Associated nodes (${targetNodes?.length})`}</Title>
        <Divider style={{ padding: "5px 0px" }} />
        <List isPlain style={{ columnCount: 2 }}>
          {targetNodes?.map((targetNode) => (
            <ListItem key={targetNode} style={{ fontSize: "14px" }}>
              {targetNode}
            </ListItem>
          ))}
        </List>
      </Modal>
    </>
  );
};

export const SymbolNode = withContextMenu((element) => [
  <SourceNodeMenu key="source-node-menu" element={element as Node} />,
])(SymbolNodeInternal);
