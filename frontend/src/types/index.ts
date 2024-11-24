export interface PropertyInfo {
  id: number;
  owner: string;
  pincode: string;
  listed: boolean;
  available: boolean;
  image1?: string;
  image2?: string;
}

export interface BookingInfo {
  id: number;
  bookedBy: string;
  bookingFrom: number;
  bookingTo: number;
  status: "Booked" | "Cancelled";
  property_id: number;
}
