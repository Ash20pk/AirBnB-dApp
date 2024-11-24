import { PropertyInfo } from "../types";
import { HomeIcon, MapPinIcon, UserIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

interface PropertyListProps {
  properties?: PropertyInfo[];
  onPropertySelect?: (property: PropertyInfo) => void;
}

export const PropertyList = ({ properties = [] }: PropertyListProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Available Properties</h2>
      </div>
      
      {properties.length === 0 ? (
        <div className="p-8 text-center">
          <HomeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No properties</h3>
          <p className="mt-1 text-sm text-gray-500">
            No properties have been listed yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="relative flex flex-col bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/property/${property.id}`)}
            >
              {/* Property Image */}
              <div className="h-48 relative">
                {property.image1 ? (
                  <img
                    src={`https://gateway.pinata.cloud/ipfs/${property.image1}`}
                    alt={`Property #${property.id}`}
                    className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="h-full bg-gradient-to-r from-indigo-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                    <HomeIcon className="h-16 w-16 text-indigo-400" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Property #{property.id}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      property.listed
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {property.listed ? "Listed" : "Unlisted"}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>Pincode: {property.pincode}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UserIcon className="h-4 w-4 mr-2" />
                    <span className="truncate" title={property.owner}>
                      Owner: {property.owner.substring(0, 8)}...{property.owner.substring(property.owner.length - 6)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
