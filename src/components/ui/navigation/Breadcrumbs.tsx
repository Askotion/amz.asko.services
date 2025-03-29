"use client"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { navigation2, NavigationItem } from "./navigation-data"

type BreadcrumbItem = {
  name: string;
  href: string;
  current: boolean;
}

type NavigationChildItem = {
  name: string;
  href: string;
  active: boolean;
}

export function Breadcrumbs() {
  const pathname = usePathname()
  
  // Generate breadcrumbs based on the current pathname
  const breadcrumbs = useMemo(() => {
    if (pathname === "/") {
      return [{ name: "Home", href: "/", current: true }]
    }
    
    // Create path segments (e.g., /sourcing/purchases -> ["sourcing", "purchases"])
    const segments = pathname.split("/").filter(Boolean)
    
    // Always start with Home
    const crumbs: BreadcrumbItem[] = [{ name: "Home", href: "/", current: false }]
    
    if (segments.length > 0) {
      // Find the section (first segment)
      const sectionName = segments[0]
      const sectionItem = navigation2.find(
        (item: NavigationItem) => item.name.toLowerCase() === sectionName.toLowerCase()
      )
      
      if (sectionItem) {
        crumbs.push({
          name: sectionItem.name,
          href: `/${sectionName}`,
          current: segments.length === 1,
        })
        
        // If we have a second segment, find the corresponding page
        if (segments.length > 1) {
          const pageName = segments[1]
          const pageItem = sectionItem.children?.find(
            (child: NavigationChildItem) => child.href.endsWith(`/${pageName}`)
          )
          
          if (pageItem) {
            crumbs.push({
              name: pageItem.name,
              href: pageItem.href,
              current: true,
            })
          }
        }
      }
    }
    
    return crumbs
  }, [pathname])
  
  return (
    <>
      <nav aria-label="Breadcrumb" className="ml-2">
        <ol role="list" className="flex items-center space-x-3 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.href} className="flex">
              {index > 0 && (
                <ChevronRight
                  className="mx-2 size-4 shrink-0 text-gray-600 dark:text-gray-400"
                  aria-hidden="true"
                />
              )}
              <div className="flex items-center">
                <Link
                  href={breadcrumb.href}
                  aria-current={breadcrumb.current ? 'page' : undefined}
                  className={
                    breadcrumb.current
                      ? "text-gray-900 dark:text-gray-50"
                      : "text-gray-500 transition hover:text-gray-700 dark:text-gray-400 hover:dark:text-gray-300"
                  }
                >
                  {breadcrumb.name}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
