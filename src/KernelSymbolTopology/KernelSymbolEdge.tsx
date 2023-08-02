import * as React from "react";

import { css } from "@patternfly/react-styles";
import styles from "@patternfly/react-topology/dist/js/css/topology-components";
import {
  DefaultConnectorTerminal,
  DefaultEdge,
  Edge,
  EdgeTerminalType,
  NodeStatus,
  Point,
  getEdgeStyleClassModifier,
  observer,
} from "@patternfly/react-topology";

interface KernelSymbolEdgeProps {
  /** Additional content added to the edge */
  children?: React.ReactNode;
  /** Additional classes added to the edge */
  className?: string;
  /** The graph edge element to represent */
  element: Edge;
  /** The terminal type to use for the edge end */
  endTerminalType?: EdgeTerminalType;
  /** Additional classes added to the end terminal */
  endTerminalClass?: string;
  /** The status to indicate on the end terminal */
  endTerminalStatus?: NodeStatus;
  /** The size of the end terminal */
  endTerminalSize?: number;
}

export const KernelSymbolDefaultEdge = ({
  element,
  endTerminalType = EdgeTerminalType.directional,
  endTerminalSize = 8,
  ...rest
}: KernelSymbolEdgeProps) => (
  <DefaultEdge
    element={element}
    endTerminalType={endTerminalType}
    endTerminalSize={endTerminalSize}
    {...rest}
  />
);

export const KernelSymbolEdge = ({
  element,
  endTerminalType = EdgeTerminalType.directional,
  endTerminalClass,
  endTerminalStatus,
  endTerminalSize = 5,
  children,
  className,
}: KernelSymbolEdgeProps) => {
  const startPoint = element.getStartPoint();
  const endPoint = element.getEndPoint();
  const bendpoints = element.getBendpoints();

  const d = `M${startPoint.x} ${startPoint.y} ${bendpoints
    .map((b: Point) => `L${b.x} ${b.y} `)
    .join("")}L${endPoint.x} ${endPoint.y}`;

  return (
    <g className={css(styles.topologyEdge, className)}>
      <path
        className={css(styles.topologyEdgeLink, getEdgeStyleClassModifier(element.getEdgeStyle()))}
        d={d}
      />
      <DefaultConnectorTerminal
        className={endTerminalClass}
        isTarget
        edge={element}
        size={endTerminalSize}
        terminalType={endTerminalType}
        status={endTerminalStatus}
      />

      {children}
    </g>
  );
};

export default observer(KernelSymbolEdge);
