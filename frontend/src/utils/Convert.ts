import bs58 from "bs58";

const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const base = ALPHABET.length;

export const base58ToHex = (input: string): string => {
  const bytes = bs58.decode(input);
  return bytes.toString("hex");
};

export const hexToBase58 = (hexStr: string): string => {
  // Remove '0x' prefix if present
  const cleanHex = hexStr.startsWith("0x") ? hexStr.slice(2) : hexStr;
  
  // Add back the IPFS prefix bytes that were removed during base58ToHex
  const ipfsHex = "1220" + cleanHex;
  
  // Convert hex to bytes
  const bytes = Buffer.from(ipfsHex, "hex");
  
  // Convert bytes to base58
  return bs58.encode(bytes);
};
