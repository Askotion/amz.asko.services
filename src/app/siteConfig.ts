export const siteConfig = {
  name: "Planner",
  url: "https://planner.tremor.so",
  description: "The simplest dashboard template.",
  baseLinks: {
    home: {
      overview: "/home",
    },
    sourcing: {
      overview: "/sourcing/overview",
      purchases: "/sourcing/purchases",
    },
  },
}

export type siteConfig = typeof siteConfig
