import { createContext, useContext, ReactNode } from "react";
import { AirbnbContract } from "../sway-api";

interface ContractContextType {
  contract: AirbnbContract | undefined;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export function ContractProvider({
  children,
  contract,
}: {
  children: ReactNode;
  contract: AirbnbContract | undefined;
}) {
  return (
    <ContractContext.Provider value={{ contract }}>
      {children}
    </ContractContext.Provider>
  );
}

export function useContract() {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
}
