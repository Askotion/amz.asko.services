import { BookText, House, PackageSearch } from "lucide-react"
import * as React from "react"

export const navigation = [
  {
    name: "Home",
    href: "/",
    icon: House,
    notifications: false,
    active: false,
  },
  {
    name: "Inbox",
    href: "#",
    icon: PackageSearch,
    notifications: 2,
    active: false,
  },
] as const

export const navigation2 = [
  {
    name: "Inventory",
    href: "#",
    icon: PackageSearch,
    children: [
      {
        name: "FBA Lager",
        href: "/inventory/fba",
        active: false,
      },
      {
        name: "FBM Lager",
        href: "/inventory/fbm",
        active: false,
      },
    ],
  },
  {
    name: "Sourcing",
    href: "#",
    icon: BookText,
    children: [
      {
        name: "Overview",
        href: "/sourcing/overview",
        active: false,
      },
      {
        name: "Purchases",
        href: "/sourcing/purchases",
        active: false,
      },
    ],
  },
  {
    name: "Offers",
    href: "#",
    icon: PackageSearch,
    children: [
      {
        name: "Angebote + erstellen",
        href: "/offers/create",
        active: false,
      },
      {
        name: "FBA Sendung",
        href: "/offers/fba-shipment",
        active: false,
      },
    ],
  },
  {
    name: "Remission",
    href: "#",
    icon: PackageSearch,
    children: [
      {
        name: "Overview",
        href: "/remission/overview",
        active: false,
      },
      {
        name: "LPN",
        href: "/remission/lpn",
        active: false,
      },
    ],
  },
  {
    name: "Addons",
    href: "#",
    icon: PackageSearch,
    children: [
      {
        name: "Support Bots",
        href: "/addons/support-bots",
        active: false,
      },
      {
        name: "Repricer",
        href: "/addons/repricer",
        active: false,
      },
      {
        name: "Invoice Fetcher",
        href: "/addons/invoice-fetcher",
        active: false,
      },
    ],
  },
] as const

export type NavigationItem = {
  name: string;
  href: string;
  icon?: React.ElementType;
  children?: {
    name: string;
    href: string;
    active: boolean;
  }[];
  notifications?: number | boolean;
  active: boolean;
} 