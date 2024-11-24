'use client'
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useWallet, useDisconnect, useConnectUI } from "@fuels/react";
import { HomeIcon, PlusCircleIcon, MagnifyingGlassIcon, UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export const Navbar = () => {
  const location = useLocation();
  const { wallet } = useWallet();
  const { connect } = useConnectUI();
  const { disconnect } = useDisconnect();
  const [balance, setBalance] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (wallet) {
        const balance = await wallet.getBalance();
        setBalance(Number(balance.toString())/1e8);
      }
    };
    fetchBalance();
  }, [wallet]);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "List Property", href: "/list-property" },
  ];

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link
                to="/"
                className="flex items-center px-2 text-xl font-bold text-indigo-600"
              >
                BlockStay
              </Link>
            </div>
            <div className="ml-6 flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                    location.pathname === item.href
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            {wallet ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Balance: {balance} ETH
                </span>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    <UserCircleIcon className="h-6 w-6" />
                    Account
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className={`block px-4 py-2 text-sm ${
                          location.pathname === "/profile"
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                          event.preventDefault();
                          disconnect();
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => connect()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
