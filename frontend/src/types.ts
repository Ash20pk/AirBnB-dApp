export interface PropertyInfo {
  id: number;
  owner: string;
  pincode: string;
  listed: boolean;
  image1?: string;
  image2?: string;
}

export interface PropertyImage {
  image1: string;
  image2: string;
}

export interface BookingInfo {
  id: number;
  propertyId: number;
  bookedBy: string;
  bookingFrom: number;
  bookingTo: number;
  status: string;
}
