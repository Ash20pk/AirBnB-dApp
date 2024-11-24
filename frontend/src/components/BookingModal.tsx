import { useState } from "react";
import { PropertyInfo } from "../types";
import { AirbnbContract } from "../sway-api";

interface BookingModalProps {
  property: PropertyInfo;
  onClose: () => void;
  contract: AirbnbContract | undefined;
  onBookingComplete: () => Promise<void>;
}

export const BookingModal = ({
  property,
  onClose,
  contract,
  onBookingComplete,
}: BookingModalProps) => {
  const [bookingDates, setBookingDates] = useState({ from: "", to: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleBookProperty = async () => {
    if (!contract) return;
    setIsLoading(true);

    try {
      await contract.functions
        .book(
          property.id,
          BigInt(new Date(bookingDates.from).getTime()),
          BigInt(new Date(bookingDates.to).getTime())
        )
        .call();
      await onBookingComplete();
      onClose();
    } catch (error) {
      console.error("Error booking property:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Book Property #{property.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              From Date
            </label>
            <input
              type="date"
              value={bookingDates.from}
              onChange={(e) =>
                setBookingDates({ ...bookingDates, from: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              To Date
            </label>
            <input
              type="date"
              value={bookingDates.to}
              onChange={(e) =>
                setBookingDates({ ...bookingDates, to: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min={bookingDates.from || new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleBookProperty}
              disabled={isLoading || !bookingDates.from || !bookingDates.to}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Booking..." : "Book Now"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
