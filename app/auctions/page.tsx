"use client";
import { AuctionCard } from "@/components/auction-card";
import { Header } from "@/components/header";
import { MOCK_AUCTIONS, formatARS, OTHER_BIDDERS } from "@/lib/auction-data";
import type { AuctionItem, Bid } from "@/lib/auction-data";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CURRENT_USER_ID = "leandro-di-palma";

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<AuctionItem[]>(MOCK_AUCTIONS);
  const { toast } = useToast();
  const prevAuctionsRef = useRef<AuctionItem[]>([]);

  const updateAuctionBid = (
    auctionId: string,
    newBidAmount: number,
    bidderId: string
  ) => {
    setAuctions((prevAuctions) =>
      prevAuctions.map((auction) => {
        if (auction.id === auctionId && auction.status === "active") {
          if (newBidAmount > auction.currentBidAmount) {
            const newBid: Bid = {
              bidderId,
              amount: newBidAmount,
              timestamp: Date.now(),
            };
            return {
              ...auction,
              currentBidAmount: newBidAmount,
              currentBidDisplay: formatARS(newBidAmount),
              bidHistory: [newBid, ...auction.bidHistory].sort(
                (a, b) => b.timestamp - a.timestamp
              ),
            };
          }
        }
        return auction;
      })
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAuctions((prevAuctions) => {
        const newAuctions = prevAuctions.map((auction) => {
          if (
            auction.status === "active" &&
            new Date(auction.endTime || 0).getTime() > Date.now()
          ) {
            const randomBidder =
              OTHER_BIDDERS[Math.floor(Math.random() * OTHER_BIDDERS.length)];
            const minIncrease = auction.currentBidAmount * 0.01;
            const maxIncrease = auction.currentBidAmount * 0.05;
            const simulatedIncrease =
              Math.floor(Math.random() * (maxIncrease - minIncrease + 1)) +
              minIncrease;
            const newSimulatedBid = Math.round(
              auction.currentBidAmount + simulatedIncrease
            );

            if (
              auction.bidHistory[0]?.bidderId !== CURRENT_USER_ID ||
              Math.random() < 0.3
            ) {
              const newBid: Bid = {
                bidderId: randomBidder,
                amount: newSimulatedBid,
                timestamp: Date.now(),
              };
              return {
                ...auction,
                currentBidAmount: newSimulatedBid,
                currentBidDisplay: formatARS(newSimulatedBid),
                bidHistory: [newBid, ...auction.bidHistory].sort(
                  (a, b) => b.timestamp - a.timestamp
                ),
              };
            }
          }
          return auction;
        });
        return newAuctions;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const toastsToShow: {
      title: string;
      description: string;
      variant: "destructive";
    }[] = [];

    auctions.forEach((currentAuction) => {
      const prevAuction = prevAuctionsRef.current.find(
        (a) => a.id === currentAuction.id
      );

      if (prevAuction && currentAuction.status === "active") {
        const wasHighestBidder =
          prevAuction.bidHistory[0]?.bidderId === CURRENT_USER_ID;
        const isNoLongerHighestBidder =
          currentAuction.bidHistory[0]?.bidderId !== CURRENT_USER_ID;
        const bidIncreased =
          currentAuction.currentBidAmount > prevAuction.currentBidAmount;

        if (wasHighestBidder && isNoLongerHighestBidder && bidIncreased) {
          toastsToShow.push({
            title: "¡Has sido superado!",
            description: `Tu oferta en "${
              currentAuction.title
            }" ha sido superada. La nueva oferta es ${formatARS(
              currentAuction.currentBidAmount
            )}.`,
            variant: "destructive",
          });
        }
      }
    });

    if (toastsToShow.length > 0) {
      setTimeout(() => {
        toastsToShow.forEach((t) => toast(t));
      }, 0);
    }

    prevAuctionsRef.current = auctions;
  }, [auctions, toast]);

  const handlePlaceUserBid = (auctionId: string, bidAmount: number) => {
    const auction = auctions.find((a) => a.id === auctionId);
    if (!auction) return;

    if (bidAmount > auction.currentBidAmount) {
      updateAuctionBid(auctionId, bidAmount, CURRENT_USER_ID);
      toast({
        title: "¡Puja exitosa!",
        description: `Has pujado ${formatARS(bidAmount)} en "${
          auction.title
        }".`,
      });
    } else {
      toast({
        title: "Puja demasiado baja",
        description: `Tu puja debe ser mayor que la oferta actual de ${auction.currentBidDisplay}.`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Header />
      <main className={cn("container mx-auto p-4 md:p-6")}>
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
          Subastas Activas y Finalizadas
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction, index) => (
            <motion.div
              key={auction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <AuctionCard
                auction={auction}
                onPlaceBid={handlePlaceUserBid}
                isHighestBidder={
                  auction.bidHistory[0]?.bidderId === CURRENT_USER_ID
                }
                currentUserId={CURRENT_USER_ID}
              />
            </motion.div>
          ))}
        </div>
      </main>
    </>
  );
}
