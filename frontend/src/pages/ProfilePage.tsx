import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContract } from "../context/ContractContext";
import { useWallet, useAccount } from "@fuels/react";
import { BookingInfo } from "../types";
import { Building2, Calendar, MapPin, AlertCircle, ChevronRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { contract } = useContract();
  const { wallet } = useWallet();
  const { account } = useAccount();
  const [bookings, setBookings] = useState<BookingInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Keep existing fetch logic
  const fetchUserBookings = async () => {
    if (!contract || !wallet) return;

    try {
      setIsLoading(true);
      const { value } = await contract.functions.total_booking().get();
      const totalBookings = Number(value.toString());
      const userBookings: BookingInfo[] = [];
      const userAddress = Number(account?.toString());

      for (let i = 1; i <= totalBookings; i++) {
        const { value } = await contract.functions.booking_info(i).get();
        if (value && Number(value.bookedBy.Address?.bits.toString()) === userAddress) {
          userBookings.push({
            id: i,
            bookedBy: value.bookedBy.Address?.bits.toString() || "",
            bookingFrom: Number(value.bookingFrom),
            bookingTo: Number(value.bookingTo),
            status: value.status === "Booked" ? "Booked" : "Cancelled",
            propertyId: Number(value.property_id),
          });
        }
      }

      userBookings.sort((a, b) => b.bookingFrom - a.bookingFrom);
      setBookings(userBookings);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      toast.error("Failed to fetch your bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, [contract, wallet]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Banner Design */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 pb-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="flex items-center gap-x-3">
              <div className="rounded-lg bg-white/10 p-2">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                My Profile
              </h1>
            </div>
            <p className="mt-2 text-indigo-100">
              Manage your bookings and account settings
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 -mt-8">
          <div className="overflow-hidden bg-white rounded-xl shadow-sm mt-20">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-indigo-50 p-3">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{bookings.length}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Add more stats cards as needed */}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="overflow-hidden bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Recent Bookings</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="text-sm text-gray-500">Loading your bookings...</p>
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-indigo-50 p-3">
                <AlertCircle className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-sm font-medium text-gray-900">
                No bookings yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Start by exploring available properties.
              </p>
              <button
                onClick={() => navigate("/explore")}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
              >
                Explore Properties
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="group relative flex items-center gap-x-6 p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-indigo-50">
                    <Building2 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="flex-auto min-w-0">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Property #{booking.propertyId}
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-x-2">
                        <Calendar className="h-4 w-4 flex-none" />
                        <span className="truncate">
                          {new Date(booking.bookingFrom * 1000).toLocaleDateString()} - 
                          {new Date(booking.bookingTo * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        booking.status === "Booked"
                          ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                          : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                      }`}
                    >
                      {booking.status}
                    </span>
                    <button
                      onClick={() => navigate(`/property/${booking.propertyId}`)}
                      className="flex-none rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-indigo-600 shadow-sm ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 hover:bg-indigo-50 transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};