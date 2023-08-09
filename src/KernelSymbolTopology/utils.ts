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
  const graph = visual.getGraph();
  const startNodePosition = graph
    .getNodes()
    .find((node, index) => node.getId() === startNodeId || index === 0)
    ?.getPosition();

  if (startNodePosition) {
    graph.setPosition(
      new Point(
        startNodePosition.x + (startPoint?.x || 0),
        startNodePosition.y + (startPoint?.y || 0)
      )
    );
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
