import { useState } from "react";
import { useContract } from "../context/ContractContext";
import toast from "react-hot-toast";

interface BookingFormProps {
  propertyId: number;
  onBookingComplete?: () => void;
}

export const BookingForm = ({ propertyId, onBookingComplete }: BookingFormProps) => {
  const { contract } = useContract();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingDates, setBookingDates] = useState({
    from: "",
    to: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    try {
      setIsLoading(true);

      // Convert dates to block numbers (using timestamp for simplicity)
      const fromTimestamp = Math.floor(new Date(bookingDates.from).getTime() / 1000);
      const toTimestamp = Math.floor(new Date(bookingDates.to).getTime() / 1000);

      // Call the contract's book function
      const { transactionId } = await contract.functions
        .book(propertyId, fromTimestamp, toTimestamp)
        .call();

      toast.success("Booking successful!");
      onBookingComplete?.();
      
      // Reset the form
      setBookingDates({
        from: "",
        to: "",
      });
    } catch (error) {
      console.error("Error booking property:", error);
      toast.error("Failed to book property. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="from-date"
            className="block text-sm font-medium text-gray-700"
          >
            From Date
          </label>
          <input
            type="date"
            id="from-date"
            value={bookingDates.from}
            onChange={(e) =>
              setBookingDates((prev) => ({ ...prev, from: e.target.value }))
            }
            min={new Date().toISOString().split("T")[0]}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="to-date"
            className="block text-sm font-medium text-gray-700"
          >
            To Date
          </label>
          <input
            type="date"
            id="to-date"
            value={bookingDates.to}
            onChange={(e) =>
              setBookingDates((prev) => ({ ...prev, to: e.target.value }))
            }
            min={bookingDates.from || new Date().toISOString().split("T")[0]}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Booking..." : "Book Now"}
      </button>
    </form>
  );
};
