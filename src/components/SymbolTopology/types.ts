import { EdgeModel, NodeModel } from "@patternfly/react-topology";

export enum TopologyLayout {
  BreadthFirst = "BreadthFirstLayout",
  PipelineDagre = "PipelineDagreLayout",
}

export interface SymbolData {
  nodes: NodeModel[];
  edges: EdgeModel[];
}

export enum ModelType {
  Graph = "graph",
  Group = "group",
  Node = "node",
  Edge = "edge",
}
