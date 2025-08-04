"use client";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MOCK_VEHICLES } from "@/lib/data";
import { cn } from "@/lib/utils";

interface VehicleSelectorProps {
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
  onRemoveVehicle: () => void;
  availableVehicleIds: string[];
  index: number;
  isMobileDisplay?: boolean;
}

export function VehicleSelector({
  selectedVehicleId,
  onSelectVehicle,
  onRemoveVehicle,
  availableVehicleIds,
  index,
  isMobileDisplay = false,
}: VehicleSelectorProps) {
  const selectedVehicle = selectedVehicleId
    ? MOCK_VEHICLES.find((v) => v.id === selectedVehicleId)
    : null;

  const handleValueChange = (value: string) => {
    onSelectVehicle(value);
  };

  const getTransmission = (vehicle: typeof selectedVehicle) => {
    if (!vehicle) return "N/A";
    const mechanicalCategory = vehicle.categories.find(
      (cat) => cat.title === "Prestaciones y mecánica"
    );
    const transmissionAttribute = mechanicalCategory?.attributes.find(
      (attr) => attr.label === "Transmisión"
    );
    return transmissionAttribute?.value || "N/A";
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-4 p-4 sm:p-6 rounded-lg shadow-md bg-white dark:bg-gray-900",
        !selectedVehicle && "min-h-[200px] justify-center"
      )}
    >
      <AnimatePresence mode="wait">
        {selectedVehicle ? (
          <motion.div
            key={selectedVehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-4 w-full h-full"
          >
            <Select
              onValueChange={handleValueChange}
              value={selectedVehicleId || ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <Image
                      src={selectedVehicle.image || "/placeholder.svg"}
                      alt={selectedVehicle.name}
                      width={40}
                      height={30}
                      className="rounded object-cover"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {selectedVehicle.year} {selectedVehicle.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedVehicle.mileage} • {selectedVehicle.priceUSD}
                      </p>
                    </div>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {availableVehicleIds.map((id) => {
                  const vehicle = MOCK_VEHICLES.find((v) => v.id === id);
                  if (!vehicle) return null;
                  return (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={vehicle.image || "/placeholder.svg"}
                          alt={vehicle.name}
                          width={40}
                          height={30}
                          className="rounded object-cover"
                          loading="lazy"
                        />
                        <div>
                          <p className="font-medium text-sm">
                            {vehicle.year} {vehicle.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {vehicle.mileage} • {vehicle.priceUSD}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Image
              src={selectedVehicle.image || "/placeholder.svg"}
              alt={`${selectedVehicle.year} ${selectedVehicle.name}`}
              width={300}
              height={225}
              className="rounded-lg object-cover aspect-[4/3] mt-4"
              loading="lazy"
            />

            <p className="font-bold text-2xl mt-4">
              {selectedVehicle.priceARS}
            </p>

            <div className="text-muted-foreground text-sm text-center mt-2">
              <p>{selectedVehicle.year}</p>
              <p>{selectedVehicle.mileage}</p>
              <p>{getTransmission(selectedVehicle)}</p>
              <p>{selectedVehicle.location}</p>
            </div>

            <div className="flex flex-col items-start gap-2 text-sm mt-4 w-full flex-grow">
              {selectedVehicle.details.map((detail, i) => {
                const isPositive =
                  !detail.startsWith("No ") && !detail.startsWith("Sin ");
                return (
                  <span
                    key={i}
                    className={cn(
                      "flex items-center gap-1",
                      isPositive ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {isPositive ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    {detail}
                  </span>
                );
              })}
            </div>

            <div className="flex gap-2 w-full mt-4">
              <Button variant="outline" className="flex-1 bg-transparent">
                Ver anuncio
              </Button>
              <Button className="flex-1">Contactar vendedor</Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center h-full w-full"
          >
            <Select onValueChange={handleValueChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue
                  placeholder={`Seleccionar vehículo ${index + 1}`}
                />
              </SelectTrigger>
              <SelectContent>
                {availableVehicleIds.map((id) => {
                  const vehicle = MOCK_VEHICLES.find((v) => v.id === id);
                  if (!vehicle) return null;
                  return (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={vehicle.image || "/placeholder.svg"}
                          alt={vehicle.name}
                          width={40}
                          height={30}
                          className="rounded object-cover"
                          loading="lazy"
                        />
                        <div>
                          <p className="font-medium text-sm">
                            {vehicle.year} {vehicle.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {vehicle.mileage} • {vehicle.priceUSD}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
