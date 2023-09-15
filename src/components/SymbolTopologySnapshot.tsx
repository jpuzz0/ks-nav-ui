import { useSearchParams } from "react-router-dom";
import { SymbolTopology } from "./SymbolTopology";

export const SymbolTopologySnapshot = () => {
  const [searchParams] = useSearchParams();
  const initialSelectedIds = searchParams.getAll("id");

  return <SymbolTopology initialSelectedIds={initialSelectedIds} />;
};
