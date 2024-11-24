import { PropertyForm } from "../components/PropertyForm";
import { useContract } from "../context/ContractContext";
import { useNavigate } from "react-router-dom";
import { HomeIcon, BuildingOffice2Icon, PlusCircleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export const ListPropertyPage = () => {
  const { contract } = useContract();
  const navigate = useNavigate();

  const handlePropertyListed = async () => {
    toast.success("Property listed successfully!");
    navigate("/explore");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Gradient */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 pb-5 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="flex items-center gap-x-3">
              <div className="rounded-lg bg-white/10 p-2">
                <BuildingOffice2Icon className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                List Your Property
              </h1>
            </div>
            <p className="mt-2 text-indigo-100">
              Join our network of property owners and start earning with BlockStay
            </p>
          </div>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <nav className="flex space-x-4" aria-label="Progress">
            <div className="flex items-center space-x-3 text-indigo-600">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100">
                <PlusCircleIcon className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium">Add Property Details</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5">
          <div className="flex min-h-[400px]">
            {/* Left Side - Form */}
            <div className="flex-1 p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium leading-6 text-gray-900">
                    Property Details
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Fill in the details below to list your property on BlockStay.
                    All information will be stored securely on the blockchain.
                  </p>
                </div>
                
                <PropertyForm 
                  contract={contract} 
                  onPropertyListed={handlePropertyListed} 
                />
              </div>
            </div>

            {/* Right Side - Info Panel */}
            <div className="hidden w-96 bg-gray-50 lg:block">
              <div className="p-8">
                <h3 className="text-sm font-medium text-gray-500">Listing Tips</h3>
                <div className="mt-4 space-y-4">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <tip.icon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{tip.title}</p>
                        <p className="mt-1 text-sm text-gray-500">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-lg bg-indigo-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <HomeIcon className="h-5 w-5 text-indigo-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-indigo-800">Need Help?</h3>
                      <p className="mt-2 text-sm text-indigo-700">
                        Our support team is here to help you create the perfect listing.
                        Contact us anytime.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const tips = [
  {
    title: "High-Quality Photos",
    description: "Upload clear, well-lit photos that showcase your property's best features.",
    icon: HomeIcon,
  },
  {
    title: "Accurate Pincode",
    description: "Be honest about your Pincode, as it will be visible to potential renters.",
    icon: BuildingOffice2Icon,
  }
];