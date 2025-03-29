import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Category = "red" | "orange" | "emerald" | "gray"
type Metric = {
  label: string
  value: number
  percentage: string
  fraction: string
}

// Type for counts of each status
type StatusCounts = {
  draft: number;
  purchased: number;
  shipped: number;
  received: number;
  total: number;
}

type PurchaseStatus = 'draft' | 'purchased' | 'shipped' | 'received';

const getCategory = (value: number): Category => {
  if (value < 0.3) return "red"
  if (value < 0.7) return "orange"
  return "emerald"
}

const categoryConfig = {
  red: {
    activeClass: "bg-red-500 dark:bg-red-500",
    bars: 1,
  },
  orange: {
    activeClass: "bg-orange-500 dark:bg-orange-500",
    bars: 2,
  },
  emerald: {
    activeClass: "bg-emerald-500 dark:bg-emerald-500",
    bars: 3,
  },
  gray: {
    activeClass: "bg-gray-300 dark:bg-gray-800",
    bars: 0,
  },
} as const

function Indicator({ number }: { number: number }) {
  const category = getCategory(number)
  const config = categoryConfig[category]
  const inactiveClass = "bg-gray-300 dark:bg-gray-800"

  return (
    <div className="flex gap-0.5">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`h-3.5 w-1 rounded-sm ${
            index < config.bars ? config.activeClass : inactiveClass
          }`}
        />
      ))}
    </div>
  )
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <div>
      <dt className="text-sm text-gray-500 dark:text-gray-500">
        {metric.label}
      </dt>
      <dd className="mt-1.5 flex items-center gap-2">
        <Indicator number={metric.value} />
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          {metric.percentage}{" "}
          <span className="font-medium text-gray-400 dark:text-gray-600">
            - {metric.fraction}
          </span>
        </p>
      </dd>
    </div>
  )
}

export function PurchaseMetricsCards() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStatusCounts() {
      try {
        const { data, error } = await supabase
          .from('amz_sas_purchase')
          .select('status')
        
        if (error) {
          console.error('Error fetching status counts:', error);
          return;
        }

        // Count items by status
        const counts: StatusCounts = {
          draft: 0,
          purchased: 0,
          shipped: 0,
          received: 0,
          total: data.length
        };

        data.forEach(item => {
          const status = item.status as PurchaseStatus;
          if (status in counts) {
            counts[status]++;
          }
        });

        // Calculate metrics
        const draftToPurchaseRatio = 
          counts.purchased / (counts.draft + counts.purchased) || 0;
        
        const purchasedToReceivedRatio = 
          counts.received / (counts.purchased + counts.received) || 0;
        
        const receivedToShippedRatio = 
          counts.received / (counts.shipped + counts.received) || 0;

        // Format percentage and fractions
        const draftToPurchasePercentage = `${(draftToPurchaseRatio * 100).toFixed(1)}%`;
        const purchasedToReceivedPercentage = `${(purchasedToReceivedRatio * 100).toFixed(1)}%`;
        const receivedToShippedPercentage = `${(receivedToShippedRatio * 100).toFixed(1)}%`;

        // Create metrics array
        const newMetrics: Metric[] = [
          {
            label: "Draft-to-Purchase Ratio",
            value: draftToPurchaseRatio,
            percentage: draftToPurchasePercentage,
            fraction: `${counts.purchased}/${counts.draft + counts.purchased}`
          },
          {
            label: "Purchase-to-Received Ratio",
            value: purchasedToReceivedRatio,
            percentage: purchasedToReceivedPercentage,
            fraction: `${counts.received}/${counts.purchased + counts.received}`
          },
          {
            label: "Received-to-Shipped Ratio",
            value: receivedToShippedRatio,
            percentage: receivedToShippedPercentage,
            fraction: `${counts.received}/${counts.shipped + counts.received}`
          }
        ];

        setMetrics(newMetrics);
      } catch (error) {
        console.error('Error in fetching status counts:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStatusCounts();
  }, []);

  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
        Purchase Overview
      </h1>
      <dl className="mt-6 flex flex-wrap items-center gap-x-12 gap-y-8">
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading metrics...</div>
        ) : metrics.length > 0 ? (
          metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))
        ) : (
          <div className="text-sm text-gray-500">No metrics available</div>
        )}
      </dl>
    </>
  )
} 