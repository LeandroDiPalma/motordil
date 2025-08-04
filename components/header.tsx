"use client"
import Link from "next/link"
import React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm py-4 px-4 md:px-6 flex items-center justify-between sticky top-0 z-10">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <Image src="/placeholder.svg?height=32&width=32" alt="Motordil Logo" width={32} height={32} />
        <span className="font-bold text-xl">Motordil</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link
          href="/"
          className={cn(
            "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
            pathname === "/" && "font-semibold text-gray-900 dark:text-gray-50",
          )}
          prefetch={false}
        >
          Comparador
        </Link>
        <Link
          href="/auctions"
          className={cn(
            "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
            pathname === "/auctions" && "font-semibold text-gray-900 dark:text-gray-50",
          )}
          prefetch={false}
        >
          Subastas
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <Button variant="outline" className="hidden md:inline-flex bg-transparent">
          {pathname === "/" ? "Comparar" : "Mi Cuenta"}
        </Button>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open mobile menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Navegación</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 py-4">
              <Link
                href="/"
                className={cn(
                  "text-lg font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  pathname === "/" && "font-semibold text-gray-900 dark:text-gray-50",
                )}
                onClick={() => setIsMobileMenuOpen(false)}
                prefetch={false}
              >
                Comparador
              </Link>
              <Link
                href="/auctions"
                className={cn(
                  "text-lg font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  pathname === "/auctions" && "font-semibold text-gray-900 dark:text-gray-50",
                )}
                onClick={() => setIsMobileMenuOpen(false)}
                prefetch={false}
              >
                Subastas
              </Link>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                Mi Cuenta
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
