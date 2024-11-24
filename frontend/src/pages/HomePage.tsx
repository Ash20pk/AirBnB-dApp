import { useNavigate } from "react-router-dom";
import { useIsConnected } from "@fuels/react";
import {
  ShieldCheckIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Decentralized Booking",
    description: "All bookings are secured on the blockchain, ensuring transparency and immutability of your reservations.",
    icon: ShieldCheckIcon,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "IPFS Image Storage",
    description: "Property images are stored on IPFS, providing permanent and decentralized storage for your listings.",
    icon: PhotoIcon,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Smart Contract Powered",
    description: "Smart contracts handle all transactions, eliminating the need for intermediaries and reducing costs.",
    icon: CurrencyDollarIcon,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    name: "User-Friendly Interface",
    description: "Modern and intuitive interface makes it easy to list properties and make bookings.",
    icon: UserGroupIcon,
    gradient: "from-orange-500 to-yellow-500",
  },
];

export const HomePage = () => {
  const navigate = useNavigate();
  const { isConnected } = useIsConnected();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]" />
        <div className="absolute left-60 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-pink-500 opacity-20 blur-[100px]" />
      </div>

      {/* Hero Section */}
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 inline-flex animate-pulse items-center rounded-full bg-gradient-to-r from-indigo-600/80 via-indigo-500/80 to-indigo-600/80 px-4 py-1.5">
            <span className="text-sm font-semibold text-white">
              Powered by FuelVM
            </span>
          </div>
          <h1 className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
            Welcome to BlockStay
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Decentralized property booking platform. List your property or find your next stay, 
            all secured by blockchain technology.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {isConnected ? (
              <>
                <button
                  onClick={() => navigate("/explore")}
                  className="group relative rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30"
                >
                  Explore Properties
                  <div className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white/25 transition-transform duration-200 ease-in-out group-hover:scale-150 group-hover:opacity-0" />
                </button>
                <button
                  onClick={() => navigate("/list-property")}
                  className="group flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900 transition-all duration-200 ease-in-out hover:text-indigo-600"
                >
                  List Your Property
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </>
            ) : (
              <div className="rounded-full bg-gray-100 px-6 py-3 text-sm text-gray-500">
                Please connect your wallet to continue
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 pb-24 sm:pb-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Why BlockStay?
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for secure property booking
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl lg:mt-24">
          <dl className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl"
              >
                <dt className="flex items-center gap-4">
                  <div className={`rounded-xl bg-gradient-to-r ${feature.gradient} p-3`}>
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="text-lg font-semibold leading-7 text-gray-900">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-4 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            ))}
          </dl>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shimmer {
            0% { background-position: -400px 0; }
            100% { background-position: 400px 0; }
          }
          .animate-shimmer {
            background-size: 200% 100%;
            animation: shimmer 4s linear infinite;
          }
        `
      }} />
    </div>
  );
};