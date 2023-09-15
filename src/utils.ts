import { Instance, RoutePath } from "./types";

export const getFilePath = (fileId: string | undefined) =>
  `${RoutePath.File}${fileId ? `/${fileId}` : ""}`;

export const getInstanceVersion = (instance: Instance | undefined) =>
  instance ? `${instance.version} (${instance.note})` : "";
