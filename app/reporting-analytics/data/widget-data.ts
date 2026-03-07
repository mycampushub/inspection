export interface WidgetSize {
  w: number
  h: number
}

export interface WidgetConfig {
  [key: string]: any
}

export interface LayoutItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  type: string
  title: string
  config: WidgetConfig
}

export interface DashboardLayout {
  [key: string]: LayoutItem[]
}

export interface WidgetType {
  type: string
  title: string
  description: string
  category: string
  defaultSize?: WidgetSize
  minSize?: WidgetSize
  defaultConfig?: WidgetConfig
}

export const widgetTypes: WidgetType[] = [
  {
    type: "kpi",
    title: "KPI Card",
    description: "Display a key performance indicator with trend",
    category: "kpi",
    defaultSize: { w: 3, h: 2 },
    minSize: { w: 2, h: 2 },
    defaultConfig: {
      title: "Total Spend",
      value: "$21,260,445",
      change: "+12%",
      trend: "up",
      format: "currency",
      icon: "dollar-sign",
    },
  },
  {
    type: "bar-chart",
    title: "Bar Chart",
    description: "Display data as a bar chart",
    category: "chart",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 3, h: 3 },
    defaultConfig: {
      title: "Spend by Category",
      data: "spendByCategory",
    },
  },
  {
    type: "line-chart",
    title: "Line Chart",
    description: "Display data as a line chart",
    category: "chart",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 3, h: 3 },
    defaultConfig: {
      title: "Spend Trend",
      data: "spendTrend",
    },
  },
  {
    type: "pie-chart",
    title: "Pie Chart",
    description: "Display data as a pie chart",
    category: "chart",
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
    defaultConfig: {
      title: "Spend Distribution",
      data: "spendByCategory",
    },
  },
  {
    type: "table",
    title: "Data Table",
    description: "Display data in a table format",
    category: "table",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 3, h: 3 },
    defaultConfig: {
      title: "Upcoming Contracts",
      data: "upcomingContracts",
    },
  },
  {
    type: "map",
    title: "Supplier Map",
    description: "Display supplier locations on a map",
    category: "map",
    defaultSize: { w: 6, h: 5 },
    minSize: { w: 4, h: 4 },
    defaultConfig: {
      title: "Supplier Locations",
      data: "supplierLocations",
    },
  },
  {
    type: "heat-map",
    title: "Heat Map",
    description: "Display data intensity as a heat map",
    category: "chart",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 3, h: 3 },
    defaultConfig: {
      title: "Spend Heat Map",
      data: "spendHeatMap",
    },
  },
  {
    type: "scatter-chart",
    title: "Scatter Plot",
    description: "Display relationship between two variables",
    category: "chart",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 3, h: 3 },
    defaultConfig: {
      title: "Price vs Quality",
      data: "priceQuality",
    },
  },
  {
    type: "radar-chart",
    title: "Radar Chart",
    description: "Display multivariate data on a radar chart",
    category: "chart",
    defaultSize: { w: 4, h: 4 },
    minSize: { w: 3, h: 3 },
    defaultConfig: {
      title: "Supplier Performance",
      data: "supplierPerformance",
    },
  },
]

// Sample default layout
export const defaultLayouts: DashboardLayout = {
  default: [
    {
      i: "widget-1",
      x: 0,
      y: 0,
      w: 3,
      h: 2,
      minW: 2,
      minH: 2,
      type: "kpi",
      title: "Total Spend",
      config: {
        title: "Total Spend",
        value: "$21,260,445",
        change: "+12%",
        trend: "up",
        format: "currency",
        icon: "dollar-sign",
      },
    },
    {
      i: "widget-2",
      x: 3,
      y: 0,
      w: 3,
      h: 2,
      minW: 2,
      minH: 2,
      type: "kpi",
      title: "Active Contracts",
      config: {
        title: "Active Contracts",
        value: "165",
        change: "+10",
        trend: "up",
        format: "number",
        icon: "file-text",
      },
    },
    {
      i: "widget-3",
      x: 6,
      y: 0,
      w: 3,
      h: 2,
      minW: 2,
      minH: 2,
      type: "kpi",
      title: "Active Suppliers",
      config: {
        title: "Active Suppliers",
        value: "2,009",
        change: "+289",
        trend: "up",
        format: "number",
        icon: "users",
      },
    },
    {
      i: "widget-4",
      x: 0,
      y: 2,
      w: 6,
      h: 4,
      minW: 3,
      minH: 3,
      type: "bar-chart",
      title: "Spend by Category",
      config: {
        title: "Spend by Category",
        data: "spendByCategory",
      },
    },
    {
      i: "widget-5",
      x: 6,
      y: 2,
      w: 6,
      h: 4,
      minW: 3,
      minH: 3,
      type: "line-chart",
      title: "Spend Trend",
      config: {
        title: "Spend Trend",
        data: "spendTrend",
      },
    },
    {
      i: "widget-6",
      x: 0,
      y: 6,
      w: 6,
      h: 4,
      minW: 3,
      minH: 3,
      type: "table",
      title: "Upcoming Contracts",
      config: {
        title: "Upcoming Contracts",
        data: "upcomingContracts",
      },
    },
    {
      i: "widget-7",
      x: 6,
      y: 6,
      w: 6,
      h: 4,
      minW: 3,
      minH: 3,
      type: "radar-chart",
      title: "Supplier Performance",
      config: {
        title: "Supplier Performance",
        data: "supplierPerformance",
      },
    },
  ],
}
