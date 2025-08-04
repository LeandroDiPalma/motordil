"use client";

import * as React from "react";
import * as DismissableLayerPrimitive from "@radix-ui/react-dismissable-layer";

const DismissableLayer = React.forwardRef<
  React.ElementRef<typeof DismissableLayerPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof DismissableLayerPrimitive.Root>
>(({ className, ...props }, ref) => (
  <DismissableLayerPrimitive.Root ref={ref} className={className} {...props} />
));
DismissableLayer.displayName = DismissableLayerPrimitive.Root.displayName;

export { DismissableLayer };
