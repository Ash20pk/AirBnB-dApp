import { useEffect, useState } from "react";
import { useContract } from "../context/ContractContext";
import { BookingInfo as BookingInfoType } from "../types";
import { CalendarIcon, UserIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface BookingInfoProps {
  propertyId: number;
}

export const BookingInfo = ({ propertyId }: BookingInfoProps) => {
  const { contract } = useContract();
  const [bookingInfo, setBookingInfo] = useState<BookingInfoType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookingInfo();
  }, [contract, propertyId]);

  const fetchBookingInfo = async () => {
    if (!contract) return;

    try {
      setIsLoading(true);
      const { value: totalBookings } = await contract.functions.total_booking().get();
      
      // Iterate through bookings to find the latest one for this property
      let latestBooking: BookingInfoType | null = null;
      for (let i = totalBookings; i > 0; i--) {
        const { value: booking } = await contract.functions.booking_info(i).get();
        if (booking && booking.property_id === propertyId) {
          latestBooking = {
            id: i,
            bookedBy: booking.bookedBy.Address?.bits.toString() || "",
            bookingFrom: Number(booking.bookingFrom),
            bookingTo: Number(booking.bookingTo),
            status: booking.status === "Booked" ? "Booked" : "Cancelled",
            property_id: Number(booking.property_id),
          };
          break;
        }
      }
      setBookingInfo(latestBooking);
    } catch (error) {
      console.error("Error fetching booking info:", error);
      toast.error("Failed to fetch booking information");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!bookingInfo) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 mt-6">
      <h3 className="text-lg font-semibold mb-4">Current Booking</h3>
      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <UserIcon className="h-5 w-5 mr-2" />
          <span className="text-sm">
            Booked by: {bookingInfo.bookedBy.substring(0, 8)}...
            {bookingInfo.bookedBy.substring(bookingInfo.bookedBy.length - 6)}
          </span>
        </div>
        <div className="flex items-center text-gray-600">
          <CalendarIcon className="h-5 w-5 mr-2" />
          <span className="text-sm">
            From: {new Date(bookingInfo.bookingFrom * 1000).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center text-gray-600">
          <CalendarIcon className="h-5 w-5 mr-2" />
          <span className="text-sm">
            To: {new Date(bookingInfo.bookingTo * 1000).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              bookingInfo.status === "Booked"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {bookingInfo.status}
          </span>
        </div>
      </div>
    </div>
  );
};
