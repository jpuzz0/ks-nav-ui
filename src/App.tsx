import React from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { configure } from "mobx";

import { KsNavContextProvider, useKsNavContext } from "./context";
import { RoutePath } from "./types";
import { DatasetSearchPage, FileDetailsPage } from "./pages";
import { getFilePath } from "./utils";
import { getFileDetails, getSymbol, getInstance } from "./mockApi";
import { SymbolTopologySnapshot } from "./components";

// Prevent mobx warning triggered when updating the starting node position in the topology view
configure({
  enforceActions: "never",
});

export const App = () => (
  <div style={{ width: "100%", height: "100%", verticalAlign: "middle" }}>
    <KsNavContextProvider>
      <BrowserRouter>
        <KsNavRoutes />
      </BrowserRouter>
    </KsNavContextProvider>
  </div>
);

const KsNavRoutes = () => {
  const navigate = useNavigate();
  const { setSelectedInstance, setSelectedSymbol } = useKsNavContext();
  const [searchParams] = useSearchParams();
  const instanceId = searchParams.get("instanceId");
  const symbolId = searchParams.get("symbolId");

  const navigateToFileDetails = React.useCallback(async () => {
    if (instanceId && symbolId) {
      const file = await getFileDetails(instanceId, symbolId);
      const symbol = await getSymbol(symbolId);
      const instance = await getInstance(instanceId);

      // Populate context based on search params
      setSelectedInstance(instance);
      setSelectedSymbol(symbol);

      if (file) {
        navigate(getFilePath(file.id));
      }
    }
  }, [instanceId, symbolId, setSelectedInstance, setSelectedSymbol, navigate]);

  // Redirect user to the file associated with specified search params
  // for instanceId and symbolId if they both exist.
  React.useEffect(() => {
    navigateToFileDetails();
  }, [navigateToFileDetails]);

  return (
    <Routes>
      <Route path={RoutePath.Home} element={<DatasetSearchPage />} />
      <Route path={`${RoutePath.File}/:fileId`} element={<FileDetailsPage />} />
      <Route path={RoutePath.Graph} element={<SymbolTopologySnapshot />} />
      <Route path="*" element={<Navigate to={RoutePath.Home} replace />} />
    </Routes>
  );
};
