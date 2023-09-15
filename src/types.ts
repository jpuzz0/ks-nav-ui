import { SelectOptionProps } from "@patternfly/react-core";

export interface File {
  id: string;
  name: string;
}

export interface FileDetails extends File {
  symbolNames: string[];
  sourceCode: string;
}

export enum FieldId {
  SymbolName = "symbolName",
  InstanceVersion = "instanceVersion",
}

export interface Instance {
  id: string;
  version: string;
  note: string;
}

export interface Symbol {
  id: string;
  name: string;
  instanceId: string;
}

export enum RoutePath {
  Home = "/",
  File = "/file",
  Graph = "/graph",
}

export enum UrlParam {
  FileId = "fileId",
}

export type SelectOptionType = Omit<SelectOptionProps, "label"> & {
  label: string;
};

export type FocusedSymbol = Partial<Pick<Symbol, "name">>;
