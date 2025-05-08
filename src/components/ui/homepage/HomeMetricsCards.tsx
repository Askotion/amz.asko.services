"use client"

import { useEffect, useState } from "react"

type MetricData = {
  label: string
  value: string
  date: string
  orders: string
  refunds: number
  adv_cost: string
  est_payout: string
  gross_profit: string
  net_profit: string
  sales_percentage?: string
  net_profit_percentage?: string
  color: string
}

export function HomeMetricsCards() {
  const [metrics] = useState<MetricData[]>([
    {
      label: "Today",
      value: "€ 81.88",
      date: "23 April 2025",
      orders: "4 / 4",
      refunds: 0,
      adv_cost: "€ 0.00",
      est_payout: "€ 59.48",
      gross_profit: "€ 13.57",
      net_profit: "€ 13.57",
      color: "bg-blue-500/20"
    },
    {
      label: "Yesterday",
      value: "€ 332.70",
      date: "22 April 2025",
      orders: "3 / 4",
      refunds: 0,
      adv_cost: "€ 0.00",
      est_payout: "€ 303.33",
      gross_profit: "€ 56.53",
      net_profit: "€ 56.53",
      color: "bg-teal-500/20"
    },
    {
      label: "Month to date",
      value: "€ 22,065.91",
      date: "1-23 April 2025",
      orders: "443 / 496",
      refunds: 24,
      adv_cost: "€ 0.00",
      est_payout: "€ 17,319.42",
      gross_profit: "€ 2,226.67",
      net_profit: "€ 2,187.67",
      sales_percentage: "+173.7%",
      net_profit_percentage: "+153.7%",
      color: "bg-cyan-500/20"
    },
    {
      label: "Last month",
      value: "€ 12,900.94",
      date: "1-31 March 2025",
      orders: "300 / 318",
      refunds: 10,
      adv_cost: "€ 0.00",
      est_payout: "€ 9,708.71",
      gross_profit: "€ 1,055.86",
      net_profit: "€ 1,055.86",
      sales_percentage: "+134.0%",
      net_profit_percentage: "+30.3%",
      color: "bg-emerald-500/20"
    }
  ])

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.label} className={`${metric.color} rounded-lg`}>
          <div className="p-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{metric.label}</p>
                {metric.sales_percentage && (
                  <p className="text-xs font-medium text-emerald-600">{metric.sales_percentage}</p>
                )}
              </div>
              <p className="text-xs text-gray-500">{metric.date}</p>
            </div>
            
            <div className="mt-4">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">Sales</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</p>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Orders / Units</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-900 dark:text-white">{metric.orders}</p>
                  {metric.refunds > 0 && (
                    <p className="text-sm text-blue-500">{metric.refunds}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Adv. cost</p>
                <p className="text-sm text-gray-900 dark:text-white">{metric.adv_cost}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Est. payout</p>
                <p className="text-sm text-gray-900 dark:text-white">{metric.est_payout}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Gross profit</p>
                <p className="text-sm text-gray-900 dark:text-white">{metric.gross_profit}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Net profit</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-900 dark:text-white">{metric.net_profit}</p>
                  {metric.net_profit_percentage && (
                    <p className="text-xs font-medium text-emerald-600">{metric.net_profit_percentage}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center border-t border-gray-200 p-2 dark:border-gray-800">
            <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400">
              More
            </button>
          </div>
        </div>
      ))}
    </div>
  )
} 