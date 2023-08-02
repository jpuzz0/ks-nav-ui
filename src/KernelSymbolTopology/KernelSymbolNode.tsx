import React from "react";
import {
  TaskNode,
  NodeComponentProps,
  WithContextMenuProps,
  WithSelectionProps,
  AbstractAnchor,
  Point,
  useAnchor,
  AnchorEnd,
} from "@patternfly/react-topology";

type KernelSymbolNodeProps = NodeComponentProps & WithSelectionProps & WithContextMenuProps;

export const KernelSymbolNode = ({
  element,
  onSelect,
  selected,
  onContextMenu,
  contextMenuOpen,
  ...rest
}: KernelSymbolNodeProps) => (
  <TaskNode
    element={element}
    onSelect={onSelect}
    selected={selected}
    onContextMenu={onContextMenu}
    contextMenuOpen={contextMenuOpen}
    truncateLength={18}
    {...rest}
  />
);

export const KernelSymbolCustomAnchorNode = (props: KernelSymbolNodeProps) => {
  useAnchor(
    React.useCallback((node: any) => new CustomTaskAnchor(node), []),
    AnchorEnd.target
  );

  return <KernelSymbolNode {...props} />;
};

export default class CustomTaskAnchor extends AbstractAnchor {
  getLocation(): Point {
    return this.getReferencePoint();
  }

  getReferencePoint(): Point {
    const bounds = this.owner.getBounds();
    const nodeWidth = this.owner.getDimensions().width;
    return new Point(nodeWidth / 2, bounds.y);
  }
}
