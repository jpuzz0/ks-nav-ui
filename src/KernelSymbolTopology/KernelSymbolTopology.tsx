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
  EdgeModel,
  NodeModel,
  TaskEdge,
  TaskNode,
  observer,
  RunStatus,
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

  const nodeNameDictionary: Record<string, string[]> = React.useMemo(() => ({}), []);

  const edges = realDataSample[0].children.reduce((acc: EdgeModel[], statement, index) => {
    if (statement.type === "edge_stmt") {
      const source = statement.edge_list?.[0].id || `${ModelType.Edge}-source-${index}`;
      const target = statement.edge_list?.[1].id || `${ModelType.Edge}-target-${index}`;
      const id = `${ModelType.Edge}-${source}-${target}`;

      acc.push({
        id,
        source,
        target,
        type: ModelType.Edge,
      });

      if (!nodeNameDictionary[source]) {
        nodeNameDictionary[source] = [target];
      } else {
        nodeNameDictionary[source].push(target);
      }

      if (!nodeNameDictionary[target]) {
        nodeNameDictionary[target] = [];
      }
    }

    return acc;
  }, []);

  const nodes: NodeModel[] = Object.entries(nodeNameDictionary).map(([nodeName, nodeTargets]) => ({
    id: nodeName,
    label: nodeName,
    type: ModelType.Node,
    runAfterTasks: nodeTargets,
    height: 32,
    width: 134,
    data: {
      status: RunStatus.Succeeded,
    },
  }));

  const controller: Controller = React.useMemo(() => {
    const visual = new Visualization();

    visual.registerComponentFactory(getComponentFactory as ComponentFactory);
    visual.registerLayoutFactory(getLayoutFactory);

    visual.fromModel(
      {
        graph: {
          layout: "PipelineDagreLayout",
          id: "g1",
          type: ModelType.Graph,
        },
      },
      true
    );

    return visual;
  }, []);

  React.useEffect(() => {
    const graphLayoutEndEvent = () =>
      setStartNodePosition(
        controller,
        startNodeId,
        startPointX && startPointY ? { x: startPointX, y: startPointY } : undefined
      );
    const selectionEvent = ([selectedId]: any) => {
      const selectedNodeTargets = nodeNameDictionary[selectedId] ?? [];
      setSelectedIds([selectedId, ...selectedNodeTargets]);
    };

    controller.addEventListener(SELECTION_EVENT, selectionEvent);

    if (startNodeId) {
      controller.addEventListener(GRAPH_LAYOUT_END_EVENT, graphLayoutEndEvent);
    }

    controller.fromModel(
      {
        nodes: nodes.slice(0, 20),
        edges: edges.slice(0, 20),
      },
      true
    );

    // Re-run the layout on model change
    controller.getGraph().layout();

    return () => {
      controller.removeEventListener(SELECTION_EVENT, selectionEvent);
      controller.removeEventListener(GRAPH_LAYOUT_END_EVENT, graphLayoutEndEvent);
    };
  }, [controller, edges, layout, nodeNameDictionary, nodes, startNodeId, startPointX, startPointY]);

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
      return withSelection()(DemoTaskNode);
    case ModelKind.edge:
      return TaskEdge;
  }
};

const DemoTaskNodeWithoutObserver: React.FunctionComponent<any> = (props) => {
  const data = props.element.getData();
  return <TaskNode {...props} status={data?.status} />;
};

const DemoTaskNode = observer(DemoTaskNodeWithoutObserver);
