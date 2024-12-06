import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useConnectUI, useIsConnected, useWallet } from "@fuels/react";
import { Toaster } from "react-hot-toast";
import { AirbnbContract } from "./sway-api";
import { PropertyInfo } from "./types";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { ExplorePage } from "./pages/ExplorePage";
import { ListPropertyPage } from "./pages/ListPropertyPage";
import { PropertyDetailsPage } from "./pages/PropertyDetailsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ContractProvider } from "./context/ContractContext";

const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ADDRESS;

export default function App() {
  const [contract, setContract] = useState<AirbnbContract>();
  const { connect, isConnecting } = useConnectUI();
  const { isConnected } = useIsConnected();
  const { wallet } = useWallet();

  useEffect(() => {
    async function initializeContract() {
      if (isConnected && wallet) {
        const airbnbContract = new AirbnbContract(CONTRACT_ID, wallet);
        setContract(airbnbContract);
      }
    }

    initializeContract();
  }, [isConnected, wallet]);

  if (!isConnected) {
    return (
      <Router>
        <div className="h-screen w-screen flex flex-col bg-gray-50">
          <Toaster position="top-right" />
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={connect}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          </div>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <ContractProvider contract={contract}>
        <div className="h-screen w-screen flex flex-col bg-gray-50">
          <Toaster position="top-right" />
          <Navbar />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/list-property" element={<ListPropertyPage />} />
              <Route path="/property/:id" element={<PropertyDetailsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
        </div>
      </ContractProvider>
    </Router>
  );
}