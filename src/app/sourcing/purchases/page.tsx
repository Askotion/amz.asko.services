"use client"

import React, { useEffect, useState, useRef } from "react"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableFoot, 
  TableHead, 
  TableHeaderCell, 
  TableRow 
} from "@/components/Table"
import { supabase } from "@/lib/supabase"
import { cx } from "@/lib/utils"
import { SlidersHorizontal, Trash, ShoppingBag } from "lucide-react"
import { 
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
  Table as TableInstance,
  Row,
  Cell
} from "@tanstack/react-table"

// Define a type for our purchase data
type Purchase = {
  id: string
  created_at: string
  asin: string
  quantity: number
  cost_price: number
  sale_price: number
  vat_on_cost: boolean
  estimated_sales: string | null
  status: 'draft' | 'purchased' | 'shipped' | 'received'
  picture?: string
}

// Define column meta type
type ColumnMeta = {
  align?: string
}

// Create a checkbox component for row selection
function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: {
  indeterminate?: boolean
  className?: string
  [x: string]: any
}) {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate, rest.checked])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={cx(
        "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600",
        className
      )}
      {...rest}
    />
  )
}

export default function Purchases() {
  // State for purchases data and loading state
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [rowSelection, setRowSelection] = useState({})

  // Fetch data from Supabase on component mount
  useEffect(() => {
    async function fetchPurchases() {
      try {
        setIsLoading(true)
        console.log('Fetching purchases from Supabase...')
        const { data, error } = await supabase
          .from('amz_sas_purchase')
          .select('*')
          .order('created_at', { ascending: false })

        console.log('Supabase response:', { data, error })

        if (error) {
          console.error('Error fetching purchases:', error)
          return
        }

        // If no data, add some test data
        if (data && data.length === 0) {
          console.log('No purchases found, adding test data...')
          await addTestData()
          // Fetch again after adding test data
          const { data: newData } = await supabase
            .from('amz_sas_purchase')
            .select('*')
            .order('created_at', { ascending: false })
          setPurchases(newData || [])
        } else {
          setPurchases(data || [])
        }
      } catch (error) {
        console.error('Error in fetching purchases:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPurchases()
  }, [])

  // Function to add test data
  async function addTestData() {
    const testData = [
      {
        asin: 'B08N5KWB9H',
        quantity: 10,
        cost_price: 15.99,
        sale_price: 29.99,
        vat_on_cost: true,
        estimated_sales: '~300/month',
        status: 'draft'
      },
      {
        asin: 'B09B1XKGLZ',
        quantity: 5,
        cost_price: 25.50,
        sale_price: 49.99,
        vat_on_cost: false,
        estimated_sales: '~150/month',
        status: 'purchased'
      },
      {
        asin: 'B07ZPML7NP',
        quantity: 20,
        cost_price: 8.75,
        sale_price: 19.99,
        vat_on_cost: true,
        estimated_sales: '~500/month',
        status: 'shipped'
      }
    ]

    try {
      const { data, error } = await supabase
        .from('amz_sas_purchase')
        .insert(testData)
        .select()

      if (error) {
        console.error('Error adding test data:', error)
      } else {
        console.log('Test data added successfully:', data)
      }
    } catch (error) {
      console.error('Error in adding test data:', error)
    }
  }

  // Define table columns
  const columnHelper = createColumnHelper<Purchase>()
  
  const columns = [
    {
      id: 'select',
      header: ({ table }: { table: TableInstance<Purchase> }) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
          className="-translate-y-[1px]"
        />
      ),
      cell: ({ row }: { row: Row<Purchase> }) => (
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
          className="-translate-y-[1px]"
        />
      ),
      enableSorting: false,
      meta: {
        align: 'text-left',
      } as ColumnMeta,
    },
    {
      header: 'Created',
      accessorKey: 'created_at',
      cell: (info: Cell<Purchase, unknown>) => {
        const date = new Date(info.getValue() as string);
        return (
          <div className="flex flex-col">
            <div>{date.toLocaleDateString()}</div>
            <div className="text-xs text-gray-500">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        );
      },
      enableSorting: true,
      meta: {
        align: 'text-left',
      } as ColumnMeta,
    },
    {
      header: 'Picture',
      id: 'picture',
      accessorKey: 'asin',
      cell: (info: Cell<Purchase, unknown>) => {
        const asin = info.getValue() as string;
        const amazonImageUrl = `https://m.media-amazon.com/images/P/${asin}.jpg`;
        
        return (
          <div className="h-20 w-20 bg-white border border-gray-200 shadow-sm rounded flex items-center justify-center mx-auto overflow-hidden">
            <img 
              src={amazonImageUrl} 
              alt={`Product ${asin}`}
              className="max-h-[70px] max-w-[70px] object-contain"
              onError={(e) => {
                // If Amazon image fails to load, show default placeholder
                (e.target as HTMLImageElement).onerror = null; 
                (e.target as HTMLImageElement).src = '';
                (e.target as HTMLImageElement).parentElement!.className = "h-20 w-20 bg-white border border-gray-200 shadow-sm rounded flex items-center justify-center mx-auto";
                (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-xs text-gray-500">No img</span>';
              }}
            />
          </div>
        );
      },
      enableSorting: false,
      meta: {
        align: 'text-center',
      } as ColumnMeta,
    },
    {
      header: 'Quantity',
      accessorKey: 'quantity',
      cell: (info: Cell<Purchase, unknown>) => info.getValue(),
      enableSorting: true,
      meta: {
        align: 'text-center',
      } as ColumnMeta,
    },
    {
      header: 'Calculation',
      cell: (info: Cell<Purchase, unknown>) => {
        const purchase = info.row.original;
        const costWithVat = purchase.vat_on_cost ? 
          purchase.cost_price * 1.19 : 
          purchase.cost_price;
        
        const totalCost = costWithVat * purchase.quantity;
        const totalRevenue = purchase.sale_price * purchase.quantity;
        const profit = totalRevenue - totalCost;
        const margin = (profit / totalRevenue) * 100;
        const roi = (profit / totalCost) * 100;
        // Max EK is the maximum purchase price that would still break even
        const maxEk = purchase.sale_price / (purchase.vat_on_cost ? 1.19 : 1);
        
        return (
          <div className="flex flex-col text-sm">
            <div className="flex items-center">
              <span className="w-14 font-medium text-gray-500">Marge:</span>
              <span>{margin.toFixed(1)}%</span>
            </div>
            <div className="flex items-center mt-1">
              <span className="w-14 font-medium text-gray-500">ROI:</span>
              <span>{roi.toFixed(1)}%</span>
            </div>
            <div className="flex items-center mt-1">
              <span className="w-14 font-medium text-gray-500">Profit:</span>
              <span>{profit.toFixed(2).replace('.', ',')} €</span>
            </div>
            <div className="flex items-center mt-1">
              <span className="w-14 font-medium text-gray-500">Max EK:</span>
              <span>{maxEk.toFixed(2).replace('.', ',')} €</span>
            </div>
          </div>
        );
      },
      enableSorting: false,
      meta: {
        align: 'text-left',
      } as ColumnMeta,
    },
    {
      header: 'Pricing',
      cell: (info: Cell<Purchase, unknown>) => {
        const purchase = info.row.original;
        const costPrice = purchase.cost_price;
        const salePrice = purchase.sale_price;
        
        // Format with German/European style: comma for decimals
        const formattedCost = `${costPrice.toFixed(2).replace('.', ',')} €`;
        const formattedSale = `${salePrice.toFixed(2).replace('.', ',')} €`;
        
        return (
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="w-6 text-xs font-medium text-gray-500">EK:</span>
              <span>{formattedCost}</span>
            </div>
            <div className="flex items-center mt-1">
              <span className="w-6 text-xs font-medium text-gray-500">VK:</span>
              <span>{formattedSale}</span>
            </div>
          </div>
        );
      },
      enableSorting: true,
      meta: {
        align: 'text-left',
      } as ColumnMeta,
    },
    {
      header: 'Sales',
      accessorKey: 'estimated_sales',
      enableSorting: true,
      meta: {
        align: 'text-left',
      } as ColumnMeta,
    },
    {
      header: 'ASIN',
      id: 'asin',
      accessorKey: 'asin',
      enableSorting: true,
      meta: {
        align: 'text-left',
      } as ColumnMeta,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (info: Cell<Purchase, unknown>) => (
        <span className={cx(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
          {
            "bg-gray-900/10 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400": 
              info.getValue() === 'draft',
            "bg-blue-900/10 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400": 
              info.getValue() === 'purchased',
            "bg-emerald-900/10 text-emerald-500 dark:bg-emerald-900/20 dark:text-emerald-400": 
              info.getValue() === 'shipped',
            "bg-amber-900/10 text-amber-500 dark:bg-amber-900/20 dark:text-amber-400": 
              info.getValue() === 'received',
          }
        )}>
          <span
            className={cx(
              "size-1.5 shrink-0 rounded-full",
              {
                "bg-gray-500 dark:bg-gray-400": info.getValue() === 'draft',
                "bg-blue-500 dark:bg-blue-400": info.getValue() === 'purchased',
                "bg-emerald-500 dark:bg-emerald-400": info.getValue() === 'shipped',
                "bg-amber-500 dark:bg-amber-400": info.getValue() === 'received',
              }
            )}
            aria-hidden="true"
          />
          {info.getValue() === 'draft' ? 'Drafted' : 
           info.getValue() === 'purchased' ? 'Purchased' :
           info.getValue() === 'shipped' ? 'Shipped' : 
           info.getValue() === 'received' ? 'Received' : 
           info.getValue() as string}
        </span>
      ),
      enableSorting: true,
      meta: {
        align: 'text-left',
      } as ColumnMeta,
    },
  ] as ColumnDef<Purchase>[]

  // Initialize table
  const table = useReactTable({
    data: purchases,
    columns,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      rowSelection,
    },
  })

  // Handle delete selected purchases
  const handleDeleteSelected = () => {
    // In a real implementation, you would call supabase.from('amz_sas_purchase').delete().in('id', selectedIds)
    console.log('Deleting selected purchases:', Object.keys(rowSelection).map(index => purchases[parseInt(index)].id))
  }

  // Handle capture purchase
  const handleCapturePurchase = () => {
    // In a real implementation, you would update the status of selected purchases to 'purchased'
    console.log('Capturing selected purchases:', Object.keys(rowSelection).map(index => purchases[parseInt(index)].id))
  }

  return (
    <section aria-label="Purchases">
      <div className="flex flex-col justify-between gap-2 px-4 py-6 sm:flex-row sm:items-center sm:p-6">
        <Input
          type="search"
          placeholder="Search purchases..."
          className="sm:w-64 [&>input]:py-1.5"
        />
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Button
            variant="secondary"
            className="w-full gap-2 py-1.5 text-base sm:w-fit sm:text-sm"
          >
            <SlidersHorizontal
              className="-ml-0.5 size-4 shrink-0 text-gray-400 dark:text-gray-600"
              aria-hidden="true"
            />
            Filters
          </Button>
        </div>
      </div>

      <div className="relative mb-20">
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-tremor-border dark:border-dark-tremor-border"
              >
                {headerGroup.headers.map((header) => (
                  <TableHeaderCell
                    key={header.id}
                    className={cx((header.column.columnDef.meta as ColumnMeta)?.align)}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHeaderCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading purchases...
                </TableCell>
              </TableRow>
            ) : purchases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No purchases found
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => row.toggleSelected(!row.getIsSelected())}
                  className="select-none hover:bg-tremor-background-muted hover:dark:bg-dark-tremor-background-muted"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={cx(
                        row.getIsSelected()
                          ? 'bg-tremor-background-muted dark:bg-dark-tremor-background-muted'
                          : '',
                        (cell.column.columnDef.meta as ColumnMeta)?.align,
                        'relative',
                      )}
                    >
                      {index === 0 && row.getIsSelected() && (
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-tremor-brand dark:bg-dark-tremor-brand" />
                      )}
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFoot>
            <TableRow>
              <TableHeaderCell colSpan={1}>
                <IndeterminateCheckbox
                  {...{
                    checked: table.getIsAllPageRowsSelected(),
                    indeterminate: table.getIsSomePageRowsSelected(),
                    onChange: table.getToggleAllPageRowsSelectedHandler(),
                  }}
                  className="-translate-y-[1px]"
                />
              </TableHeaderCell>
              <TableHeaderCell colSpan={6} className="font-normal tabular-nums">
                {Object.keys(rowSelection).length} of{' '}
                {table.getRowModel().rows.length} Row(s) selected
              </TableHeaderCell>
            </TableRow>
          </TableFoot>
        </Table>
        
        {/* Action toolbar that appears when rows are selected */}
        <div
          className={cx(
            'absolute inset-x-0 -bottom-14 mx-auto flex w-fit items-center space-x-3 rounded-tremor-full border border-dark-tremor-border bg-dark-tremor-background px-4 py-2 text-tremor-default font-medium shadow-dark-tremor-dropdown ring-1 ring-dark-tremor-ring',
            Object.keys(rowSelection).length > 0 ? '' : 'hidden',
          )}
        >
          <p className="select-none tabular-nums text-tremor-content-subtle">
            {Object.keys(rowSelection).length} selected
          </p>
          <span
            className="h-4 w-px bg-dark-tremor-content-subtle"
            aria-hidden={true}
          />
          <span className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCapturePurchase}
              className="inline-flex items-center gap-2 text-tremor-default text-dark-tremor-content-emphasis hover:text-dark-tremor-content-strong"
            >
              Capture purchase
              <span className="flex size-6 select-none items-center justify-center rounded-tremor-small bg-dark-tremor-background-subtle text-tremor-content-subtle ring-1 ring-inset ring-tremor-content-emphasis">
                <ShoppingBag className="size-3" />
              </span>
            </button>
          </span>
          <span
            className="h-4 w-px bg-dark-tremor-content-subtle"
            aria-hidden={true}
          />
          <span className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleDeleteSelected}
              className="inline-flex items-center gap-2 text-tremor-default text-dark-tremor-content-emphasis hover:text-dark-tremor-content-strong"
            >
              Delete selected
              <span className="flex size-6 select-none items-center justify-center rounded-tremor-small bg-dark-tremor-background-subtle text-tremor-content-subtle ring-1 ring-inset ring-tremor-content-emphasis">
                <Trash className="size-3" />
              </span>
            </button>
          </span>
        </div>
      </div>
    </section>
  )
} 