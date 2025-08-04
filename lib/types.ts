export type AttributeType = "number" | "boolean" | "string" | "dimension";

export interface Attribute {
  label: string;
  value: string | number | boolean;
  type?: AttributeType;
  unit?: string;
  highlightRule?: "max" | "min" | "boolean";
}

export interface VehicleCategory {
  title: string;
  attributes: Attribute[];
}

export interface Vehicle {
  id: string;
  name: string;
  year: number;
  mileage: string;
  priceARS: string;
  priceUSD: string;
  image: string;
  location: string;
  details: string[];
  categories: VehicleCategory[];
}
