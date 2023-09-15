import React from "react";
import { filesSample, fileDetailsSamples, instancesSample, symbolsSample } from "./exampleData";

const mockDelay = Math.random() * 1000;

export const getFileDetailsById = (fileId) => {
  return new Promise((resolve, reject) => {
    setTimeout(
      resolve(fileDetailsSamples.find((fileSample) => fileSample.id === fileId)),
      Math.random() * 1000
    );
  });
};

export const getSymbol = (symbolId) => {
  return new Promise((resolve, reject) => {
    setTimeout(
      resolve(symbolsSample.find((symbolSample) => symbolSample.id === symbolId)),
      Math.random() * 1000
    );
  });
};

export const getInstance = (instanceId) => {
  return new Promise((resolve, reject) => {
    setTimeout(
      resolve(instancesSample.find((instanceSample) => instanceSample.id === instanceId)),
      Math.random() * 1000
    );
  });
};

export const getFileDetails = (instanceId, symbolName) => {
  return new Promise((resolve, reject) => {
    setTimeout(
      resolve(
        fileDetailsSamples.find(
          (file) => file.instanceId === instanceId && file.symbolNames.includes(symbolName)
        )
      ),
      mockDelay
    );
  });
};

export const getInstances = () => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve(instancesSample), Math.random() * 1000);
  });
};

export const getSymbols = (instanceId) => {
  return new Promise((resolve, reject) => {
    setTimeout(
      resolve(
        instanceId
          ? symbolsSample.filter((symbol) => symbol.instanceId === instanceId)
          : symbolsSample
      ),
      mockDelay
    );
  });
};

export const getFilesByInstanceId = (instanceId) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve(filesSample.filter((file) => file.instanceId === instanceId)), mockDelay);
  });
};

export const getFiles = (instanceId, symbolName) => {
  return new Promise((resolve, reject) => {
    setTimeout(
      resolve(
        filesSample.filter(
          (file) => file.instanceId === instanceId && file.symbolNames.includes(symbolName)
        )
      ),
      mockDelay
    );
  });
};

export const useFetchMockApi = (endpoint, params = [], onFetch) => {
  const [data, setData] = React.useState();

  const fetch = React.useCallback(async () => {
    const result: FileDetails = await endpoint(...params);

    onFetch?.();
    setData(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, onFetch, ...params]);

  // Fetch file details when the component initially renders or the fileId changes
  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return data;
};
