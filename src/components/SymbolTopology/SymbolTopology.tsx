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
  Controller,
  EdgeModel,
  NodeModel,
  SelectionEventListener,
  TopologyControlButton,
} from "@patternfly/react-topology";
import { Spinner } from "@patternfly/react-core";

import { graphDataSample } from "../../exampleData";
import { Symbol } from "../../types";
import { getControlButtons, getLayoutFactory, setStartNodePosition } from "./utils";
import { ModelType, TopologyLayout } from "./types";
import { SymbolEdge } from "./SymbolEdge";
import { SymbolNode } from "./SymbolNode";

interface SymbolTopologyProps {
  /** Type of topology layout. Defaults to BreadthFirst. */
  layout?: TopologyLayout;
  /** Scale of the graph. */
  scale?: number;
  /** Starting node to focus on. Defaults to the first indexed node. */
  startNode?: Partial<Symbol> | undefined;
  /** Initial selected node/edge IDs. */
  initialSelectedIds?: string[];
  /** Control buttons to extend default actions. */
  controlButtons?: (selectedIds: string[]) => TopologyControlButton[];
  /** Callback on selection of node/edges. */
  onSelect?(selectedIds?: string[]): void;
}

export const SymbolTopology = ({
  scale,
  startNode,
  controlButtons,
  initialSelectedIds = [],
  layout = TopologyLayout.PipelineDagre,
  onSelect,
}: SymbolTopologyProps) => {
  const [selectedIds, setSelectedIds] = React.useState<string[]>(initialSelectedIds);
  const controllerRef = React.useRef<Controller>();
  const controller = controllerRef.current;
  const [nodeNameDictionary, setNodeNameDictionary] = React.useState<Record<string, string[]>>({});
  const startNodeRef = React.useRef<Partial<Symbol>>();

  // Update the starting position on startNode change
  React.useEffect(() => {
    startNodeRef.current = startNode;
    const startNodeName = startNodeRef.current?.name;

    if (controller && startNodeName && Object.keys(nodeNameDictionary).includes(startNodeName)) {
      setSelectedIds([startNodeName]);
      setStartNodePosition(controller, startNodeName);
    }
  }, [startNode, controller, nodeNameDictionary, setSelectedIds]);

  React.useEffect(() => {
    const updatedDictionary: Record<string, string[]> = {};
    graphDataSample[0].children.forEach((statement, index) => {
      if (statement.type === "edge_stmt") {
        const source = statement.edge_list?.[0].id || `${ModelType.Edge}-source-${index}`;
        const target = statement.edge_list?.[1].id || `${ModelType.Edge}-target-${index}`;
        if (!updatedDictionary[source]) {
          updatedDictionary[source] = [target];
        } else {
          updatedDictionary[source].push(target);
        }

        if (!updatedDictionary[target]) {
          updatedDictionary[target] = [];
        }
      }
    });
    setNodeNameDictionary(updatedDictionary);
  }, []);

  const nodes: NodeModel[] = React.useMemo(() => {
    const updatedNodes = Object.entries(nodeNameDictionary).map(([nodeName, nodeTargets]) => ({
      id: nodeName,
      label: nodeName,
      type: ModelType.Node,
      ...(nodeTargets.length > 0 && { runAfterTasks: nodeTargets, data: { targets: nodeTargets } }),
      height: 32,
      width: 134,
    }));

    return updatedNodes;
  }, [nodeNameDictionary]);

  const edges = React.useMemo(() => {
    const updatedEdges: EdgeModel[] = [];

    Object.entries(nodeNameDictionary).forEach(([nodeName, nodeTargets]) => {
      nodeTargets.forEach((nodeTarget) => {
        const source = nodeName;
        const target = nodeTarget;
        const id = `${ModelType.Edge}-${source}-${target}`;
        if (nodes.find((n) => n.id === source && nodes.find((n) => n.id === target))) {
          updatedEdges.push({
            id,
            source,
            target,
            type: ModelType.Edge,
          });
        }
      });
    });

    return updatedEdges;
  }, [nodeNameDictionary, nodes]);

  const onSelection: SelectionEventListener = React.useCallback(
    ([selectedId]) => {
      const selectedNodeTargetIds = nodeNameDictionary[selectedId] ?? [];
      const selectedNodeEdgeIds = selectedNodeTargetIds.map(
        (targetId) => `edge-${selectedId}-${targetId}`
      );
      let allSelectedIds = [selectedId, ...selectedNodeTargetIds, ...selectedNodeEdgeIds];

      // When only an edge is selected, select the source and target nodes connected to that edge.
      if (allSelectedIds.length === 1 && selectedId?.includes("edge")) {
        const [, sourceNodeId, targetNodeId] = selectedId.split("-");
        allSelectedIds = [...allSelectedIds, sourceNodeId, targetNodeId];
      }

      onSelect?.(allSelectedIds);
      setSelectedIds(allSelectedIds);
    },
    [nodeNameDictionary, onSelect]
  );

  React.useEffect(() => {
    if (!nodes) {
      return;
    }

    if (!controller) {
      const visual = new Visualization();

      visual.registerComponentFactory(getComponentFactory as ComponentFactory);
      visual.registerLayoutFactory(getLayoutFactory);
      visual.addEventListener(SELECTION_EVENT, onSelection);
      visual.fromModel(
        {
          nodes,
          edges,
          graph: {
            layout,
            scale,
            id: "symbol-graph",
            type: ModelType.Graph,
          },
        },
        true
      );

      controllerRef.current = visual;
    } else {
      controller.fromModel({ nodes, edges }, true);
      controller.getGraph().layout();
      controller.addEventListener(SELECTION_EVENT, onSelection);
    }

    return () => {
      controller?.removeEventListener(SELECTION_EVENT, onSelection);
    };
  }, [layout, scale, edges, nodes, nodeNameDictionary, controller, controllerRef, onSelection]);

  return !!controller?.hasGraph() ? (
    <TopologyView
      id="symbol-topology-view"
      controlBar={
        <TopologyControlBar
          controlButtons={getControlButtons(controller, controlButtons?.(selectedIds))}
        />
      }
    >
      <VisualizationProvider controller={controller}>
        <VisualizationSurface state={{ selectedIds }} />
      </VisualizationProvider>
    </TopologyView>
  ) : (
    <Spinner />
  );
};

export const getComponentFactory = (kind: ModelKind) => {
  switch (kind) {
    case ModelKind.graph:
      return withPanZoom()(GraphComponent);
    case ModelKind.node:
      return withSelection()(SymbolNode);
    case ModelKind.edge:
      return withSelection()(SymbolEdge);
  }
};
