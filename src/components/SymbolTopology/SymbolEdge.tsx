import { css } from "@patternfly/react-styles";
import styles from "@patternfly/react-topology/dist/js/css/topology-components";
import { Edge, observer, integralShapePath, WithSelectionProps } from "@patternfly/react-topology";

interface SymbolEdgeProps extends WithSelectionProps {
  /** The graph edge element to represent */
  element: Edge;
  /** Additional classes added to the edge */
  className?: string;
  /** Offset for integral shape path */
  nodeSeparation?: number;
}

export const SymbolEdge = observer(
  ({ element, className, nodeSeparation, onSelect, selected }: SymbolEdgeProps) => {
    const startPoint = element.getStartPoint();
    const endPoint = element.getEndPoint();
    const groupClassName = css(styles.topologyEdge, className);
    const startIndent: number = element.getData()?.indent || 0;

    return (
      <g data-test-id="task-handler" className={groupClassName} fillOpacity={0} onClick={onSelect}>
        <path
          d={integralShapePath(startPoint, endPoint, startIndent, nodeSeparation)}
          transform="translate(0.5,0.5)"
          shapeRendering="geometricPrecision"
          {...(selected && {
            style: {
              fill: "var(--edge--active--fill)",
              stroke: "var(--edge--active--stroke)",
              strokeWidth: "var(--edge--active--stroke-width)",
            },
          })}
        />
      </g>
    );
  }
);
