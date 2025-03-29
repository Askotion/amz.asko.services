export const siteConfig = {
  name: "Planner",
  url: "https://planner.tremor.so",
  description: "The simplest dashboard template.",
  baseLinks: {
    quotes: {
      overview: "/quotes/overview",
      monitoring: "/quotes/monitoring",
      audits: "/quotes/audits",
    },
    sourcing: {
      purchases: "/sourcing/purchases",
    },
  },
}

export type siteConfig = typeof siteConfig
