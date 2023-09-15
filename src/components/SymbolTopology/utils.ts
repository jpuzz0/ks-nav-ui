import {
  BreadthFirstLayout,
  Controller,
  Graph,
  Layout,
  PipelineDagreLayout,
  Point,
  TopologyControlButton,
  Visualization,
  action,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
} from "@patternfly/react-topology";

import { TopologyLayout } from "./types";

export const setStartNodePosition = (
  visual: Visualization | Controller,
  startNodeId: string | undefined
): void => {
  const graph = visual.getGraph();
  const startNode = graph.getNodes().find((node) => node.getId() === startNodeId);

  if (startNode) {
    const graphPosition = graph.getPosition();
    const startNodePosition = startNode.getPosition();

    if (graphPosition.x !== startNodePosition.x || graphPosition.y !== startNodePosition.y) {
      graph.reset();

      const graphBounds = graph.getBounds();
      const newPosition = new Point(
        graphBounds.x + graphBounds.width / 2 - startNodePosition.x,
        graphBounds.y + graphBounds.height / 2 - startNodePosition.y
      );

      graph.setPosition(newPosition);
    }
  }
};

export const getControlButtons = (
  controller: Controller,
  customButtons?: TopologyControlButton[]
): TopologyControlButton[] => {
  const graph = controller.getGraph();

  return createTopologyControlButtons({
    ...defaultControlButtonsOptions,
    zoomInCallback: action(() => graph.scaleBy(4 / 3)),
    zoomOutCallback: action(() => graph.scaleBy(0.75)),
    fitToScreenCallback: action(() => graph.fit(80)),
    resetViewCallback: action(() => graph.reset()),
    ...(customButtons && { customButtons }),
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
