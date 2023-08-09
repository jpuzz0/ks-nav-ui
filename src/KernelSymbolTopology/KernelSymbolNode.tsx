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
  DefaultNode,
  Node,
} from "@patternfly/react-topology";
import { ConnectdevelopIcon } from "@patternfly/react-icons";

type KernelSymbolNodeProps = NodeComponentProps & WithSelectionProps & WithContextMenuProps;

export const KernelSymbolNode = ({
  element,
  onSelect,
  selected,
  onContextMenu,
  contextMenuOpen,
  ...rest
}: KernelSymbolNodeProps) => (
  <DefaultNode
    element={element}
    onSelect={onSelect}
    selected={selected}
    onContextMenu={onContextMenu}
    contextMenuOpen={contextMenuOpen}
    truncateLength={100}
    {...rest}
  >
    <g transform={`translate(10, 10)`}>
      <ConnectdevelopIcon style={{ color: "#393F44" }} width={25} height={25} />
    </g>
  </DefaultNode>
);

export const KernelSymbolTaskNode = ({
  element,
  onSelect,
  selected,
  onContextMenu,
  contextMenuOpen,
  ...rest
}: KernelSymbolNodeProps) => {
  const nodeElement = element as Node;
  const { height: taskHeight } = nodeElement.getBounds();
  const y = taskHeight / 10;
  const startX = -26;
  const arrowHeadPoints = `${startX + 12 / 2} ${y} ${startX + 16} ${y + 12 / 2} ${
    startX + 12 / 2
  } ${y + 12} ${y + 12 / 2}`;

  useAnchor(
    React.useCallback((node: Node) => new CustomTaskAnchorSource(node), []),
    AnchorEnd.source
  );
  useAnchor(
    React.useCallback((node: Node) => new CustomTaskAnchorTarget(node), []),
    AnchorEnd.target
  );

  return (
    <TaskNode
      element={element}
      onSelect={onSelect}
      selected={selected}
      onContextMenu={onContextMenu}
      contextMenuOpen={contextMenuOpen}
      {...rest}
    >
      <polygon
        transform="translate(10.5, 10)"
        points={arrowHeadPoints}
        fill={"var(--pf-topology__edge--Stroke)"}
      />
    </TaskNode>
  );
};

export const KernelSymbolCustomAnchorNode = (props: KernelSymbolNodeProps) => {
  useAnchor(
    React.useCallback((node: any) => new CustomDefaultAnchor(node), []),
    AnchorEnd.target
  );

  return <KernelSymbolNode {...props} />;
};

export const KernelSymbolCustomTaskAnchorNode = (props: KernelSymbolNodeProps) => {
  return (
    <KernelSymbolTaskNode {...props}>
      {/* <WhenDecorator element={props.element} /> */}
    </KernelSymbolTaskNode>
  );
};

class CustomDefaultAnchor extends AbstractAnchor {
  getLocation(): Point {
    return this.getReferencePoint();
  }

  getReferencePoint(): Point {
    const bounds = this.owner.getBounds();
    const nodeWidth = this.owner.getDimensions().width;
    return new Point(nodeWidth / 2, bounds.y);
  }
}

class CustomTaskAnchorSource extends AbstractAnchor {
  getLocation(): Point {
    return this.getReferencePoint();
  }

  getReferencePoint(): Point {
    const bounds = this.owner.getBounds();
    const verticalOffset = 1;

    return new Point(bounds.right(), bounds.y + bounds.height + verticalOffset - 12 / 2);
  }
}

class CustomTaskAnchorTarget extends AbstractAnchor {
  getLocation(): Point {
    return this.getReferencePoint();
  }

  getReferencePoint(): Point {
    const bounds = this.owner.getBounds();
    const verticalOffset = 1;

    return new Point(bounds.right(), bounds.y + bounds.height + verticalOffset - 12 / 2);
  }
}
