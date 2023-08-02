import {
  BreadthFirstLayout,
  Controller,
  EdgeModel,
  Graph,
  Layout,
  NodeModel,
  PipelineDagreLayout,
  Point,
  PointIface,
  TopologyControlButton,
  Visualization,
  action,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
} from "@patternfly/react-topology";
import { example } from "../exampleData";
import { SymbolData, TopologyLayout } from "./types";

// Eventually the example data will be fetched and this will be a
// custom hook where we'll have a fetch on render within a React effect.
export const getSymbolData = (): SymbolData => {
  const nodeNameSet = new Set<string>();

  const edges = example[0].children.reduce((acc: EdgeModel[], statement, index) => {
    if (statement.type === "edge_stmt") {
      const source = statement.edge_list?.[0].id || `edge-source-${index}`;
      const target = statement.edge_list?.[1].id || `edge-target-${index}`;
      const id = `edge-${source}-${target}`;

      acc.push({
        id,
        source,
        target,
        type: "edge",
      });

      nodeNameSet.add(source);
      nodeNameSet.add(target);
    }

    return acc;
  }, []);

  const nodes: NodeModel[] = [...nodeNameSet].map((nodeName) => ({
    id: nodeName,
    label: nodeName,
    type: "node",
    width: 45,
    height: 35,
    style: {
      padding: [45, 45],
    },
  }));

  return { edges, nodes };
};

export const setStartNodePosition = (
  visual: Visualization | Controller,
  startNodeId: string | undefined,
  startPoint: PointIface
): void => {
  const graph = visual.getGraph();
  const startNodePosition = graph
    .getNodes()
    .find((node, index) => node.getId() === startNodeId || index === 0)
    ?.getPosition();

  if (startNodePosition) {
    graph.setPosition(
      new Point(startNodePosition.x + startPoint.x, startNodePosition.y + startPoint.y)
    );
  }
};

export const getControlButtons = (
  controller: Controller,
  startPoint: PointIface,
  startNodeId?: string
): TopologyControlButton[] => {
  const graph = controller.getGraph();

  return createTopologyControlButtons({
    ...defaultControlButtonsOptions,
    zoomInCallback: action(() => {
      graph.scaleBy(4 / 3);
    }),
    zoomOutCallback: action(() => {
      graph.scaleBy(0.75);
    }),
    fitToScreenCallback: action(() => {
      graph.fit(80);
    }),
    resetViewCallback: action(() => {
      graph.reset();

      if (startNodeId) {
        setStartNodePosition(controller, startNodeId, startPoint);
      } else {
        graph.setPosition(new Point(startPoint.x, startPoint.y));
      }
    }),
    legend: false,
  });
};

export const getLayoutFactory = (type: string, graph: Graph): Layout | undefined => {
  switch (type) {
    case TopologyLayout.BreadthFirst:
      return new BreadthFirstLayout(graph);
    case TopologyLayout.PipelineDagre:
      return new PipelineDagreLayout(graph);
  }
};
