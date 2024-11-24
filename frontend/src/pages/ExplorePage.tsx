import { useState, useEffect } from "react";
import { PropertyList } from "../components/PropertyList";
import { useContract } from "../context/ContractContext";
import { PropertyInfo } from "../types";
import { hexToBase58 } from "../utils/Convert";
import { Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export const ExplorePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState<PropertyInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "booked">("all");
  const { contract } = useContract();

  // Existing fetch logic...
  const fetchProperties = async () => {
    if (!contract) return;
    try {
      setIsLoading(true);
      const {value} = await contract.functions.total_property_listed().get();
      const propertyList: PropertyInfo[] = [];

      for (let i = 1; i <= value.toNumber(); i++) {
        const propertyInfo = await contract.functions.property_info(i).get();
        const propertyImages = await contract.functions.get_property_images(i).get();
        
        if (propertyInfo.value) {
          let image1Cid, image2Cid;
          if (propertyImages.value) {
            const image1Hex = propertyImages.value.image1.toString();
            const image2Hex = propertyImages.value.image2.toString();
            image1Cid = image1Hex ? hexToBase58(image1Hex) : undefined;
            image2Cid = image2Hex ? hexToBase58(image2Hex) : undefined;
          }

          propertyList.push({
            id: i,
            owner: propertyInfo.value.owner.Address?.bits.toString() || "",
            pincode: propertyInfo.value.pincode.toString(),
            listed: propertyInfo.value.listed === "Listed" ? true : false,
            image1: image1Cid,
            image2: image2Cid,
            available: propertyInfo.value.available === "Available" ? true : false
          });
        }
      }

      setProperties(propertyList);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to fetch properties");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [contract]);

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.pincode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability = 
      availabilityFilter === "all" ? true :
      availabilityFilter === "available" ? property.available :
      availabilityFilter === "booked" ? !property.available :
      true;
    
    return matchesSearch && matchesAvailability;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Gradient */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 pb-5 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="flex items-center gap-x-3">
              <div className="rounded-lg bg-white/10 p-2">
                <Search className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
              Explore Properties
              </h1>
            </div>
            <p className="mt-2 text-indigo-100">
            Find your perfect stay from our curated collection
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-lg border-0 py-3 pl-11 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-shadow duration-200 ease-in-out"
              placeholder="Search by location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-3">
            {["all", "available", "booked"].map((filter) => (
              <button
                key={filter}
                onClick={() => setAvailabilityFilter(filter as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out ${
                  availabilityFilter === filter
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent absolute top-0 left-0 animate-spin"></div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-medium text-gray-900">Loading Properties</p>
              <p className="text-sm text-gray-500">Finding the perfect stays for you...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                {filteredProperties.length} Properties Found
              </h2>
            </div>
            <PropertyList properties={filteredProperties} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;