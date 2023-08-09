import {
  BreadthFirstLayout,
  Controller,
  Graph,
  Layout,
  PipelineDagreLayout,
  Point,
  PointIface,
  TopologyControlButton,
  Visualization,
  action,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
} from "@patternfly/react-topology";
import { TopologyLayout } from "./types";

export const setStartNodePosition = (
  visual: Visualization | Controller,
  startNodeId: string | undefined,
  startPoint: PointIface | undefined
): void => {
  console.log(`startNodeId: `, startNodeId);
  const graph = visual.getGraph();
  const startNode = graph
    .getNodes()
    .find((node, index) => node.getId() === startNodeId);

  if (startNode) {
    const startNodePosition = startNode.getPosition();
    const bounds = graph.getBounds();
    const newPosition = new Point(
      bounds.x + (bounds.width / 2) - startNodePosition.x + (startPoint?.x || 0),
      bounds.y + (bounds.height / 2) - startNodePosition.y + (startPoint?.y || 0)
    )

    graph.setPosition(newPosition);
  }
};

export const getControlButtons = (
  controller: Controller,
  startPoint: PointIface | undefined,
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
      } else if (startPoint) {
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
