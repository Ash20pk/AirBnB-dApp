import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContract } from "../context/ContractContext";
import { PropertyInfo } from "../types";
import { BookingForm } from "../components/BookingForm";
import { BookingInfo } from "../components/BookingInfo";
import { hexToBase58 } from "../utils/Convert";
import { Building2, MapPin, User, ChevronLeft, ChevronRight, ArrowLeft, Calendar, Home } from "lucide-react";
import toast from "react-hot-toast";

export const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contract } = useContract();
  const [property, setProperty] = useState<PropertyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Existing fetch logic...
  const fetchPropertyDetails = async () => {
    if (!contract || !id) return;
    try {
      setIsLoading(true);
      const propertyInfo = await contract.functions.property_info(Number(id)).get();
      const propertyImages = await contract.functions.get_property_images(Number(id)).get();
      
      if (propertyInfo.value) {
        let image1Cid, image2Cid;
        if (propertyImages.value) {
          const image1Hex = propertyImages.value.image1.toString();
          const image2Hex = propertyImages.value.image2.toString();
          image1Cid = image1Hex ? hexToBase58(image1Hex) : undefined;
          image2Cid = image2Hex ? hexToBase58(image2Hex) : undefined;
        }

        setProperty({
          id: Number(id),
          owner: propertyInfo.value.owner.Address?.bits.toString() || "",
          pincode: propertyInfo.value.pincode.toString(),
          listed: propertyInfo.value.listed === "Listed" ? true : false,
          image1: image1Cid,
          image2: image2Cid,
        });
      }
    } catch (error) {
      console.error("Error fetching property details:", error);
      toast.error("Failed to fetch property details");
      navigate("/explore");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyDetails();
  }, [contract, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-indigo-600 rounded-full border-t-transparent absolute top-0 left-0 animate-spin"></div>
        </div>
        <p className="text-gray-500">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="rounded-full bg-red-50 p-3">
          <Home className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Property not found</h2>
        <button
          onClick={() => navigate("/explore")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore
        </button>
      </div>
    );
  }

  const images = [property.image1, property.image2].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 pb-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <button
              onClick={() => navigate("/explore")}
              className="mb-4 inline-flex items-center gap-2 text-black hover:text-gray-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Explore
            </button>
            <div className="flex items-center gap-x-3">
              <div className="rounded-lg bg-white/10 p-2">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Property #{property.id}
              </h1>
            </div>
            <p className="mt-2 text-indigo-100">
              Located in {property.pincode}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 -mt-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Image Carousel */}
          <div className="relative w-full h-screen overflow-hidden">
            {images.length > 0 ? (
              <>
                <img
                  src={`https://gateway.pinata.cloud/ipfs/${images[currentImageIndex]}`}
                  alt={`Property ${property.id}`}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm transition-all"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm transition-all"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex 
                              ? 'bg-white w-4' 
                              : 'bg-white/60 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
                <Building2 className="h-24 w-24 text-indigo-200" />
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Info */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                    property.listed
                      ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                      : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                  }`}>
                    {property.listed ? "Listed" : "Unlisted"}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>Pincode: {property.pincode}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="break-all">Owner: {property.owner}</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Booking Form */}
              {property.listed && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Book this Property
                  </h2>
                  <BookingForm
                    propertyId={property.id}
                    onBookingComplete={fetchPropertyDetails}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};