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
  PointIface,
  Controller,
  EdgeModel,
  NodeModel,
  TaskEdge,
  TaskNode,
} from "@patternfly/react-topology";

import { getControlButtons, getLayoutFactory, setStartNodePosition } from "./utils";
import { ModelType, TopologyLayout } from "./types";

import { realDataSample } from "../exampleData";

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
  startNodeId, // = "__x64_sys_ioctl",
  layout = TopologyLayout.PipelineDagre,
  startPoint, // = { x: 150, y: 100 },
}: KernelSymbolTopologyProps) => {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const startPointX = startPoint?.x;
  const startPointY = startPoint?.y;
  const controllerRef = React.useRef<Controller>();
  const controller = controllerRef.current;
  const [nodeNameDictionary, setNodeNameDictionary]  = React.useState<Record<string, string[]>>({});

  React.useEffect(() => {
    const updatedDictionary: Record<string, string[]> = {};
    realDataSample[0].children.forEach((statement, index) => {
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
        runAfterTasks: nodeTargets,
        height: 32,
        width: 134,
      }));
      return updatedNodes.slice(0, 20);
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

  const graphLayoutEndEvent = React.useCallback((controller: Controller) =>
    setStartNodePosition(
      controller,
      startNodeId,
      startPointX && startPointY ? { x: startPointX, y: startPointY } : undefined
    ), [startNodeId, startPointX, startPointY]);

  React.useEffect(() => {
    if (!nodes) {
      return;
    }

    const selectionEvent = ([selectedId]: any) => {
      const selectedNodeTargets = nodeNameDictionary[selectedId] ?? [];
      setSelectedIds([selectedId, ...selectedNodeTargets]);
    }

    if (!controller) {
      const visual = new Visualization();

      visual.registerComponentFactory(getComponentFactory as ComponentFactory);
      visual.registerLayoutFactory(getLayoutFactory);

      visual.addEventListener(SELECTION_EVENT, selectionEvent);

      visual.fromModel(
        {
          nodes,
          edges,
          graph: {
            layout: "PipelineDagreLayout",
            id: "g1",
            type: ModelType.Graph,
          },
        },
        false,
      );
      controllerRef.current = visual;
      controllerRef.current.addEventListener(SELECTION_EVENT, selectionEvent);
      return () => {
        controllerRef.current?.removeEventListener(SELECTION_EVENT, selectionEvent);
      }
    }
    controller.fromModel({ nodes, edges }, true);
    controller.getGraph().layout();
    controller.addEventListener(SELECTION_EVENT, selectionEvent);

    return () => {
      controller.removeEventListener(SELECTION_EVENT, selectionEvent);
    }
  }, [controller, edges, nodes, graphLayoutEndEvent, nodeNameDictionary]);

  React.useEffect(() => {
    if (controller && startNodeId) {
      setStartNodePosition(
        controller,
        startNodeId,
        startPointX && startPointY ? { x: startPointX, y: startPointY } : undefined
      );
    }
  }, [controller, startNodeId, startPointX, startPointY]);

  return !!controller?.hasGraph() ? (
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
  ) : null;
};

const getComponentFactory = (kind: ModelKind) => {
  switch (kind) {
    case ModelKind.graph:
      return withPanZoom()(GraphComponent);
    case ModelKind.node:
      return withSelection()(TaskNode);
    case ModelKind.edge:
      return TaskEdge;
  }
};
