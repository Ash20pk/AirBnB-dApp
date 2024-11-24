import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { AirbnbContract } from "../sway-api";
import { base58ToHex } from "../utils/Convert";
import toast from "react-hot-toast";

interface PropertyFormProps {
  contract: AirbnbContract | undefined;
  onPropertyListed: () => Promise<void>;
}

export const PropertyForm = ({ contract, onPropertyListed }: PropertyFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState({
    pincode: "",
    image1: null as File | null,
    image2: null as File | null,
  });


  const convertToB256 = async (data: string) => {
    const hexString = "0x" + base58ToHex(data).slice(4);
    return hexString;
  };

  const uploadToIPFS = async (file: File) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    const formData = new FormData();
    formData.append("file", file);
    const metadata = JSON.stringify({
      name: "Property Image",
    });
    formData.append("pinataMetadata", metadata);
    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    const res = await axios.post(url, formData, {
      headers: {
        "pinata_api_key": import.meta.env.VITE_PINATA_API_KEY,
        "pinata_secret_api_key": import.meta.env.VITE_PINATA_SECRET_API_KEY,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.IpfsHash;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === "file") {
      const files = e.target.files;
      if (files && files.length > 0) {
        setPropertyDetails((prevDetails) => ({
          ...prevDetails,
          [e.target.name]: files[0],
        }));
      }
    } else {
      setPropertyDetails({
        ...propertyDetails,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (propertyDetails.image1 && propertyDetails.image2) {
        const image1Cid = await uploadToIPFS(propertyDetails.image1);
        const image2Cid = await uploadToIPFS(propertyDetails.image2);
        const image1Hex = await convertToB256(image1Cid);
        const image2Hex = await convertToB256(image2Cid);

        if (contract) {
          const tx = await contract.functions
            .list_property(propertyDetails.pincode, image1Hex, image2Hex)
            .call();

            console.log(tx);

          await onPropertyListed();

          // Reset form
          setPropertyDetails({
            pincode: "",
            image1: null,
            image2: null,
          });
        }
      } else {
        toast.error("Please select both images.");
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Error submitting the property.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">List Your Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pincode
          </label>
          <input
            type="text"
            name="pincode"
            value={propertyDetails.pincode}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image 1
          </label>
          <input
            type="file"
            name="image1"
            onChange={handleInputChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image 2
          </label>
          <input
            type="file"
            name="image2"
            onChange={handleInputChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Listing..." : "List Property"}
        </button>
      </form>
    </div>
  );
};
