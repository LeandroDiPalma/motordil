"use client";
import { useState, useEffect } from "react";
import { MOCK_VEHICLES } from "@/lib/data";
import type { Vehicle } from "@/lib/types";
import { VehicleSelector } from "./vehicle-selector";
import { ComparisonTable } from "./comparison-table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function VehicleComparator() {
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [hideSimilarities, setHideSimilarities] = useState(false);

  const currentSelectedVehicleIds = Array(3)
    .fill(null)
    .map((_, index) => selectedVehicleIds[index] || null) as (string | null)[];

  const selectedVehicles = currentSelectedVehicleIds
    .map((id) => (id ? MOCK_VEHICLES.find((v) => v.id === id) : null))
    .filter((v): v is Vehicle | null => true);

  const handleSelectVehicle = (vehicleId: string, index: number) => {
    setSelectedVehicleIds((prev) => {
      const newIds = [...prev];
      newIds[index] = vehicleId;
      const uniqueIds = Array.from(new Set(newIds.filter(Boolean))) as string[];
      return uniqueIds
        .concat(Array(3 - uniqueIds.length).fill(null))
        .slice(0, 3) as string[];
    });
  };

  const handleRemoveVehicle = (index: number) => {
    setSelectedVehicleIds((prev) => {
      const newIds = [...prev];
      newIds.splice(index, 1);
      return newIds
        .concat(Array(3 - newIds.length).fill(null))
        .slice(0, 3) as string[];
    });
  };

  const getAvailableVehicleIds = (currentIndex: number) => {
    return MOCK_VEHICLES.filter(
      (v) =>
        !currentSelectedVehicleIds.includes(v.id) ||
        v.id === currentSelectedVehicleIds[currentIndex]
    ).map((v) => v.id);
  };

  useEffect(() => {
    if (selectedVehicleIds.length === 0) {
      setSelectedVehicleIds([
        MOCK_VEHICLES[0].id,
        MOCK_VEHICLES[1].id,
        MOCK_VEHICLES[2].id,
      ]);
    }
  }, [selectedVehicleIds.length]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <main className="container mx-auto p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center md:text-left">
          Compará tus anuncios guardados
        </h1>
        <p className="text-muted-foreground mb-6 text-center md:text-left">
          Selecciona directamente desde tu listado de anuncios guardados.
        </p>

        <div className="flex items-center justify-center md:justify-start gap-2 mb-8">
          <Label htmlFor="hide-similarities">Ocultar similitudes</Label>
          <Switch
            id="hide-similarities"
            checked={hideSimilarities}
            onCheckedChange={setHideSimilarities}
          />
        </div>

        <div className="hidden md:grid grid-cols-3 gap-4 mb-8">
          {[0, 1, 2].map((index) => (
            <VehicleSelector
              key={index}
              index={index}
              selectedVehicleId={currentSelectedVehicleIds[index]}
              onSelectVehicle={(id) => handleSelectVehicle(id, index)}
              onRemoveVehicle={() => handleRemoveVehicle(index)}
              availableVehicleIds={getAvailableVehicleIds(index)}
            />
          ))}
        </div>

        <div className="md:hidden flex flex-col gap-4 mb-8">
          {currentSelectedVehicleIds.map((id, index) => (
            <VehicleSelector
              key={`mobile-display-${index}`}
              index={index}
              selectedVehicleId={id}
              onSelectVehicle={(newId) => handleSelectVehicle(newId, index)}
              onRemoveVehicle={() => handleRemoveVehicle(index)}
              availableVehicleIds={getAvailableVehicleIds(index)}
              isMobileDisplay={true}
            />
          ))}
          {currentSelectedVehicleIds.filter(Boolean).length < 3 && (
            <Button
              variant="outline"
              className="w-full py-6 text-lg bg-transparent"
            >
              Agregar vehículo para comparar
            </Button>
          )}
        </div>

        <div className="rounded-lg shadow-md overflow-hidden">
          <ComparisonTable
            vehicles={selectedVehicles}
            hideSimilarities={hideSimilarities}
          />
        </div>
      </main>
    </div>
  );
}
