import React from "react";

import {
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  GraphComponent,
  ModelKind,
  withPanZoom,
  withSelection,
  SELECTION_EVENT,
  ComponentFactory,
  TopologyView,
  TopologyControlBar,
  GRAPH_LAYOUT_END_EVENT,
  PointIface,
  Controller,
} from "@patternfly/react-topology";

import { getControlButtons, getLayoutFactory, getSymbolData, setStartNodePosition } from "./utils";
import { TopologyLayout } from "./types";
import { KernelSymbolNode } from "./KernelSymbolNode";
import { KernelSymbolEdge } from "./KernelSymbolEdge";

interface KernelSymbolTopologyProps {
  /** Type of topology layout. Defaults to BreadthFirst. */
  layout?: TopologyLayout;
  /** Scale of the graph. */
  scale?: number;
  /** Starting graph point. */
  startPoint?: PointIface;
  /** Starting node to focus on. Defaults to the first indexed node. */
  startNodeId?: string;
}

export const KernelSymbolTopology = ({
  scale,
  startNodeId,
  layout = TopologyLayout.BreadthFirst,
  startPoint = { x: 100, y: 100 },
}: KernelSymbolTopologyProps) => {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const { x: startPointX, y: startPointY } = startPoint;

  const controller: Controller = React.useMemo(() => {
    const visual = new Visualization();
    const { edges, nodes } = getSymbolData();

    visual.registerComponentFactory(getComponentFactory as ComponentFactory);
    visual.registerLayoutFactory(getLayoutFactory);
    visual.addEventListener(SELECTION_EVENT, setSelectedIds);

    if (startNodeId) {
      visual.addEventListener(GRAPH_LAYOUT_END_EVENT, () =>
        setStartNodePosition(visual, startNodeId, { x: startPointX, y: startPointY })
      );
    }

    visual.fromModel(
      {
        nodes,
        edges,
        graph: {
          layout,
          id: "g1",
          type: "graph",
          ...(scale && { scale }),
          ...(startPointX && { x: startPointX }),
          ...(startPointY && { y: startPointY }),
        },
      },
      false
    );

    return visual;
  }, [layout, scale, startNodeId, startPointX, startPointY]);

  return (
    <TopologyView
      id="kernel-topology-view"
      controlBar={
        <TopologyControlBar
          controlButtons={getControlButtons(controller, startPoint, startNodeId)}
        />
      }
    >
      <VisualizationProvider controller={controller}>
        <VisualizationSurface state={{ selectedIds }} />
      </VisualizationProvider>
    </TopologyView>
  );
};

const getComponentFactory = (kind: ModelKind) => {
  switch (kind) {
    case ModelKind.graph:
      return withPanZoom()(GraphComponent);
    case ModelKind.node:
      return withSelection()(KernelSymbolNode);
    case ModelKind.edge:
      return KernelSymbolEdge;
  }
};
