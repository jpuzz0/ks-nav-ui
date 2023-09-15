import React from "react";
import { Instance, Symbol } from "./types";

export interface KsNavContextProps {
  selectedSymbol: Symbol | undefined;
  setSelectedSymbol: React.Dispatch<React.SetStateAction<Symbol | undefined>>;
  selectedInstance: Instance | undefined;
  setSelectedInstance: React.Dispatch<React.SetStateAction<Instance | undefined>>;
}

export const KsNavContext = React.createContext({} as KsNavContextProps);

export interface KsNavContextProviderProps {
  children: React.ReactNode;
}

export const KsNavContextProvider: React.FunctionComponent<KsNavContextProviderProps> = ({
  children,
}) => {
  const [selectedSymbol, setSelectedSymbol] = React.useState<Symbol>();
  const [selectedInstance, setSelectedInstance] = React.useState<Instance>();

  return (
    <KsNavContext.Provider
      value={{ selectedSymbol, setSelectedSymbol, selectedInstance, setSelectedInstance }}
    >
      {children}
    </KsNavContext.Provider>
  );
};

KsNavContextProvider.displayName = "KsNavContextProvider";

export const useKsNavContext = () => React.useContext(KsNavContext);
