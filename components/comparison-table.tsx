"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Vehicle, AttributeType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface ComparisonTableProps {
  vehicles: (Vehicle | null)[];
  hideSimilarities: boolean;
}

export function ComparisonTable({
  vehicles,
  hideSimilarities,
}: ComparisonTableProps) {
  const nonNullVehicles = vehicles.filter((v): v is Vehicle => v !== null);

  if (nonNullVehicles.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Selecciona al menos un vehículo para comparar.
      </div>
    );
  }

  const getAttributeValue = (
    vehicle: Vehicle,
    categoryTitle: string,
    label: string
  ) => {
    const category = vehicle.categories.find(
      (cat) => cat.title === categoryTitle
    );
    const attribute = category?.attributes.find((attr) => attr.label === label);
    return attribute ? attribute.value : null;
  };

  const getAttributeTypeAndRule = (
    vehicle: Vehicle,
    categoryTitle: string,
    label: string
  ) => {
    const category = vehicle.categories.find(
      (cat) => cat.title === categoryTitle
    );
    const attribute = category?.attributes.find((attr) => attr.label === label);
    return {
      type: attribute?.type || "string",
      highlightRule: attribute?.highlightRule,
      unit: attribute?.unit,
    };
  };

  const isBestValue = (
    categoryTitle: string,
    label: string,
    currentValue: string | number | boolean | null,
    vehicleId: string
  ) => {
    if (currentValue === null) return false;

    const { type, highlightRule } = getAttributeTypeAndRule(
      nonNullVehicles.find((v) => v.id === vehicleId)!,
      categoryTitle,
      label
    );

    if (!highlightRule || type === "string" || type === "dimension") {
      return false;
    }

    const allValues = nonNullVehicles
      .map((v) => getAttributeValue(v, categoryTitle, label))
      .filter(
        (val) =>
          val !== null && (typeof val === "number" || typeof val === "boolean")
      );

    if (allValues.length === 0) return false;

    if (type === "number") {
      const numericValues = allValues.filter(
        (v) => typeof v === "number"
      ) as number[];
      if (numericValues.length === 0) return false;

      if (highlightRule === "max") {
        const maxVal = Math.max(...numericValues);
        return currentValue === maxVal;
      } else if (highlightRule === "min") {
        const minVal = Math.min(...numericValues);
        return currentValue === minVal;
      }
    } else if (type === "boolean" && highlightRule === "boolean") {
      return currentValue === true;
    }

    return false;
  };

  const renderValue = (
    value: string | number | boolean | null,
    type: AttributeType,
    unit?: string
  ) => {
    if (value === null) return "N/A";
    if (type === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-green-500" />
      ) : (
        <X className="h-5 w-5 text-red-500" />
      );
    }
    return `${value}${unit ? ` ${unit}` : ""}`;
  };

  const shouldHideAttribute = (categoryTitle: string, label: string) => {
    if (!hideSimilarities) return false;

    const allValues = nonNullVehicles.map((v) =>
      getAttributeValue(v, categoryTitle, label)
    );
    const nonNullValues = allValues.filter((val) => val !== null);
    return (
      nonNullValues.length > 1 &&
      nonNullValues.every((val, i, arr) => val === arr[0])
    );
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nonNullVehicles.map((vehicle) => {
          const allCategories = vehicle.categories.map((cat) => cat.title);

          return (
            <div
              key={vehicle.id}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border"
            >

              <Accordion
                type="multiple"
                defaultValue={allCategories}
                className="w-full"
              >
                {allCategories.map((categoryTitle) => {
                  const attributesInThisCategory =
                    vehicle.categories.find(
                      (cat) => cat.title === categoryTitle
                    )?.attributes || [];

                  const visibleAttributes = attributesInThisCategory.filter(
                    (attribute) =>
                      !shouldHideAttribute(categoryTitle, attribute.label)
                  );

                  if (visibleAttributes.length === 0) return null;

                  return (
                    <AccordionItem
                      key={categoryTitle}
                      value={categoryTitle}
                      className="border-b last:border-b-0 border-border"
                    >
                      <AccordionTrigger className="px-4 py-3 text-left font-semibold hover:bg-gray-50 dark:hover:bg-gray-800">
                        {categoryTitle}
                      </AccordionTrigger>
                      <AccordionContent className="p-0">
                        {categoryTitle === "Equipamiento destacado" ? (
                          <div className="grid gap-4 p-4">
                            {visibleAttributes.map((attribute, attrIndex) => {
                              const value = getAttributeValue(
                                vehicle,
                                categoryTitle,
                                attribute.label
                              );
                              const { type } = getAttributeTypeAndRule(
                                vehicle,
                                categoryTitle,
                                attribute.label
                              );
                              const isPositive = value === true;

                              return (
                                <motion.div
                                  key={attribute.label}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.2,
                                    delay: attrIndex * 0.05,
                                  }}
                                  className={cn(
                                    "flex flex-col items-center justify-center text-center h-24 border rounded-md", // Fixed height and border
                                    attrIndex % 2 === 1
                                      ? "bg-gray-50 dark:bg-gray-800"
                                      : "bg-white dark:bg-gray-900", // Alternating background
                                    isBestValue(
                                      categoryTitle,
                                      attribute.label,
                                      value,
                                      vehicle.id
                                    ) && "bg-green-50/50 dark:bg-green-950/50" // Highlight best value
                                  )}
                                >
                                  {type === "boolean" ? (
                                    isPositive ? (
                                      <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    ) : (
                                      <X className="h-6 w-6 text-red-600 dark:text-red-400" />
                                    )
                                  ) : (
                                    <span className="text-lg font-semibold">
                                      {renderValue(value, type)}
                                    </span>
                                  )}
                                  <span className="text-xs text-muted-foreground mt-1">
                                    {attribute.label}
                                  </span>
                                </motion.div>
                              );
                            })}
                          </div>
                        ) : (
                          visibleAttributes.map((attribute, attrIndex) => {
                            const value = getAttributeValue(
                              vehicle,
                              categoryTitle,
                              attribute.label
                            );
                            const { type, unit } = getAttributeTypeAndRule(
                              vehicle,
                              categoryTitle,
                              attribute.label
                            );

                            return (
                              <motion.div
                                key={attribute.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.2,
                                  delay: attrIndex * 0.05,
                                }}
                                className={cn(
                                  "flex flex-col px-4 py-3 border-b last:border-b-0",
                                  attrIndex % 2 === 1
                                    ? "bg-gray-50 dark:bg-gray-800"
                                    : "bg-white dark:bg-gray-900", // Alternating background
                                  isBestValue(
                                    categoryTitle,
                                    attribute.label,
                                    value,
                                    vehicle.id
                                  ) && "bg-green-50/50 dark:bg-green-950/50" // Highlight best value
                                )}
                              >
                                <span className="text-sm text-muted-foreground font-medium mb-1">
                                  {attribute.label}
                                </span>
                                <span
                                  className={cn(
                                    "text-sm font-medium",
                                    isBestValue(
                                      categoryTitle,
                                      attribute.label,
                                      value,
                                      vehicle.id
                                    ) &&
                                      "text-green-600 dark:text-green-400 font-semibold"
                                  )}
                                >
                                  {renderValue(value, type, unit)}
                                </span>
                              </motion.div>
                            );
                          })
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          );
        })}
      </div>
    </div>
  );
}
