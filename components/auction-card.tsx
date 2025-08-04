"use client";
import Image from "next/image";
import { MessageCircle, Eye, Clock, Gavel, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import type { AuctionItem } from "@/lib/auction-data";
import { useCountdown } from "@/hooks/use-countdown";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";

interface AuctionCardProps {
  auction: AuctionItem;
  onPlaceBid: (auctionId: string, bidAmount: number) => void;
  isHighestBidder: boolean;
  currentUserId: string;
}

export function AuctionCard({
  auction,
  onPlaceBid,
  isHighestBidder,
  currentUserId,
}: AuctionCardProps) {
  const countdown = useCountdown(auction.endTime || "");
  const { toast } = useToast();
  const [bidInput, setBidInput] = useState<string>("");
  const [showBidHistory, setShowBidHistory] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBidSubmit = () => {
    const bidAmount = Number.parseFloat(
      bidInput.replace(/\./g, "").replace(",", ".")
    );
    if (isNaN(bidAmount)) {
      toast({
        title: "Error de puja",
        description: "Por favor, ingresa un monto válido.",
        variant: "destructive",
      });
      return;
    }
    if (bidAmount <= auction.currentBidAmount) {
      toast({
        title: "Puja demasiado baja",
        description: `Tu puja debe ser mayor que la oferta actual de ${auction.currentBidDisplay}.`,
        variant: "destructive",
      });
      return;
    }
    onPlaceBid(auction.id, bidAmount);
    setBidInput("");
  };

  const renderCountdown = () => {
    if (!countdown || countdown.isFinished) {
      return <span className="text-red-500 font-semibold">Finalizado</span>;
    }
    if (countdown.days > 0) {
      return (
        <span className="text-orange-500 font-semibold flex items-center gap-1">
          <Clock className="h-4 w-4" /> Quedan {countdown.days} días
        </span>
      );
    } else {
      const hours = String(countdown.hours).padStart(2, "0");
      const minutes = String(countdown.minutes).padStart(2, "0");
      const seconds = String(countdown.seconds).padStart(2, "0");
      return (
        <span className="text-red-500 font-semibold flex items-center gap-1">
          <Clock className="h-4 w-4" /> {hours}:{minutes}:{seconds} restantes
        </span>
      );
    }
  };

  const getProgressBarWidth = () => {
    if (!mounted || !auction.endTime || !countdown || countdown.isFinished)
      return "0%";
    const auctionStartTime =
      auction.bidHistory.length > 0
        ? auction.bidHistory[auction.bidHistory.length - 1].timestamp
        : Date.now();
    const auctionEndTime = new Date(auction.endTime).getTime();
    const totalDuration = auctionEndTime - auctionStartTime;
    const elapsed = Date.now() - auctionStartTime;
    const progress = (elapsed / totalDuration) * 100;
    return `${Math.min(100, Math.max(0, progress))}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden flex flex-col"
    >
      {auction.status === "active" && countdown && !countdown.isFinished && (
        <div className="relative h-2 bg-gray-200 dark:bg-gray-800">
          <motion.div
            className="absolute top-0 left-0 h-full bg-red-500"
            initial={{ width: "0%" }}
            animate={{ width: getProgressBarWidth() }}
            transition={{ duration: 1, type: "tween", ease: "linear" }}
          />
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          {auction.status === "active" ? (
            <div className="flex items-center gap-1">{renderCountdown()}</div>
          ) : (
            <span className="text-gray-500">
              Finalizó el {auction.soldDate}
            </span>
          )}
          <span className="text-gray-500">
            {auction.status === "active" &&
            countdown &&
            countdown.days === 0 &&
            countdown.hours === 0
              ? "1 hora restante"
              : auction.status === "active" && countdown && countdown.days > 0
              ? `${countdown.days} días left`
              : ""}
          </span>
        </div>

        <div className="relative mb-4">
          <Image
            src={auction.image || "/placeholder.svg"}
            alt={auction.title}
            width={350}
            height={250}
            className="w-full h-auto rounded-lg object-cover aspect-[4/3]"
            loading="lazy"
          />
          {!auction.hasReserve && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded-md">
              Sin reserva
            </span>
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-share h-4 w-4"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" x2="12" y1="2" y2="15" />
              </svg>
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-bell h-4 w-4"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </Button>
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-1">{auction.title}</h3>
        <p className="text-muted-foreground text-sm mb-4">
          {auction.year} • {auction.mileage} • {auction.location}
        </p>

        <div className="flex items-center gap-4 text-sm text-blue-600 dark:text-blue-400 mb-4">
          <Popover open={showBidHistory} onOpenChange={setShowBidHistory}>
            <PopoverTrigger asChild>
              <Button variant="link" className="p-0 h-auto text-sm">
                <MessageCircle className="h-4 w-4 mr-1" /> {auction.comments}{" "}
                comentarios
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <h4 className="font-semibold mb-2">Historial de Pujas</h4>
              <ScrollArea className="h-40 w-full rounded-md border p-2">
                {auction.bidHistory.length > 0 ? (
                  auction.bidHistory
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((bid, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-sm mb-1"
                      >
                        <span className="font-medium">
                          {bid.bidderId === currentUserId
                            ? "Tú"
                            : `Usuario ${bid.bidderId.slice(-4)}`}
                        </span>
                        <span>
                          {new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          }).format(bid.amount)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(bid.timestamp), "HH:mm:ss", {
                            locale: es,
                          })}
                        </span>
                      </div>
                    ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No hay pujas aún.
                  </p>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" /> {auction.views} vistas
          </span>
        </div>

        {auction.status === "active" && (
          <>
            <div className="bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200 font-bold text-center py-3 rounded-md mb-2 relative">
              Oferta actual: {auction.currentBidDisplay}
              {isHighestBidder && (
                <span className="absolute top-1 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <User className="h-3 w-3" /> Eres el máximo pujante
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <Label htmlFor={`bid-input-${auction.id}`} className="sr-only">
                Tu puja
              </Label>
              <Input
                id={`bid-input-${auction.id}`}
                type="number"
                placeholder={`Ingresa tu puja (mínimo ${new Intl.NumberFormat(
                  "es-AR",
                  { style: "currency", currency: "ARS" }
                ).format(auction.currentBidAmount + 1)})`}
                value={bidInput}
                onChange={(e) => setBidInput(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1 bg-transparent">
                Ver anuncio
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                onClick={handleBidSubmit}
              >
                <Gavel className="h-4 w-4 mr-2" /> Ofertá
              </Button>
            </div>
          </>
        )}

        {auction.status === "sold" && (
          <div className="bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200 font-bold text-center py-3 rounded-md flex items-center justify-center gap-2">
            <Gavel className="h-4 w-4" /> Vendido por {auction.soldPrice}
          </div>
        )}
      </div>
    </motion.div>
  );
}
