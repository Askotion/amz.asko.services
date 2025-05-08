import { HomeMetricsCards } from "@/components/ui/homepage/HomeMetricsCards"
import React from "react"

export default function HomePage() {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Welcome to Innovex Systems</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">Your premium dashboard for managing your Amazon business.</p>
      <div className="mt-6">
        <HomeMetricsCards />
      </div>
    </div>
  )
} 