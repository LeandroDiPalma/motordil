export interface Bid {
  bidderId: string;
  amount: number;
  timestamp: number;
}

export interface AuctionItem {
  id: string;
  title: string;
  year: number;
  mileage: string;
  location: string;
  comments: number;
  views: number;
  image: string;
  status: "active" | "sold";
  hasReserve: boolean;
  endTime?: string; // ISO string for active auctions
  currentBidAmount: number; // Numeric value for comparison
  currentBidDisplay: string; // Formatted string for display
  bidHistory: Bid[]; // History of bids
  soldPrice?: string; // For sold auctions
  soldDate?: string; // For sold auctions
}

export const MOCK_AUCTIONS: AuctionItem[] = [
  {
    id: "mini-cooper-1",
    title: "Único Dueño Mini Cooper Countryman Cooper S",
    year: 2012,
    mileage: "100.000 Kms",
    location: "Buenos Aires",
    comments: 1234,
    views: 1234,
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=350&h=250&fit=crop&auto=format",
    status: "active",
    hasReserve: false,
    endTime: new Date(
      Date.now() + 60 * 60 * 1000 - 5 * 60 * 1000
    ).toISOString(), // ~55 mins from now
    currentBidAmount: 100000000,
    currentBidDisplay: "100,000,000 ARS",
    bidHistory: [
      {
        bidderId: "user-initial",
        amount: 100000000,
        timestamp: Date.now() - 10000,
      },
    ],
  },
  {
    id: "mini-cooper-2",
    title: "Único Dueño Mini Cooper Countryman Cooper S",
    year: 2012,
    mileage: "100.000 Kms",
    location: "Buenos Aires",
    comments: 1234,
    views: 1234,
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=350&h=250&fit=crop&auto=format",
    status: "active",
    hasReserve: false,
    endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    currentBidAmount: 100000000,
    currentBidDisplay: "100,000,000 ARS",
    bidHistory: [
      {
        bidderId: "user-initial",
        amount: 100000000,
        timestamp: Date.now() - 10000,
      },
    ],
  },
  {
    id: "mini-cooper-3",
    title: "Único Dueño Mini Cooper Countryman Cooper S",
    year: 2012,
    mileage: "100.000 Kms",
    location: "Buenos Aires",
    comments: 1234,
    views: 1234,
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=350&h=250&fit=crop&auto=format",
    status: "sold",
    hasReserve: false,
    soldPrice: "46,500 USD",
    soldDate: "30/6/2025",
    currentBidAmount: 46500, // Final bid amount
    currentBidDisplay: "46,500 USD",
    bidHistory: [
      {
        bidderId: "user-winner",
        amount: 46500,
        timestamp: new Date("2025-06-30").getTime(),
      },
    ],
  },
];

// Helper to format numbers to ARS currency string
export const formatARS = (amount: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Simulate other bidders
export const OTHER_BIDDERS = ["user-A", "user-B", "user-C"];
