"use client"
import { PurchaseMetricsCards } from "@/components/ui/sourcing/PurchaseMetricsCards"
import React from "react"
import { siteConfig } from "../siteConfig"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className="bg-white dark:bg-gray-925">
        <div className="p-4 sm:p-6">
          <PurchaseMetricsCards />
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800"></div>
        <>{children}</>
      </div>
    </>
  )
} 