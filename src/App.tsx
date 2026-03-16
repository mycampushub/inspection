import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { AppSidebar } from "./components/AppSidebar"
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar"

import Dashboard from "./pages/Dashboard"
import ProcurementRequests from "./pages/ProcurementRequests"
import SpendAnalysis from "./pages/SpendAnalysis"
import CategoryManagement from "./pages/CategoryManagement"
import SourcingContracts from "./pages/SourcingContracts"
import RfxManagement from "./pages/RfxManagement"
import ContractRepository from "./pages/ContractRepository"
import SupplierDirectory from "./pages/SupplierDirectory"
import SupplierPerformance from "./pages/SupplierPerformance"
import ReportsAnalytics from "./pages/ReportsAnalytics"
import AIAssistant from "./pages/AIAssistant"

function AppLayout() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <SidebarInset>
            <main className="flex-1">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}

const router = createBrowserRouter(
  [
    {
      element: <AppLayout />,
      children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/procurement-requests",
        element: <ProcurementRequests />,
      },
      {
        path: "/spend-analysis",
        element: <SpendAnalysis />,
      },
      {
        path: "/category-management",
        element: <CategoryManagement />,
      },
      {
        path: "/sourcing-contracts",
        element: <SourcingContracts />,
      },
      {
        path: "/sourcing-contracts/rfx",
        element: <RfxManagement />,
      },
      {
        path: "/sourcing-contracts/contracts",
        element: <ContractRepository />,
      },
      {
        path: "/supplier-management",
        element: <SupplierDirectory />,
      },
      {
        path: "/supplier-management/directory",
        element: <SupplierDirectory />,
      },
      {
        path: "/supplier-management/performance",
        element: <SupplierPerformance />,
      },
      {
        path: "/reporting-analytics",
        element: <ReportsAnalytics />,
      },
      {
        path: "/ai-assistant",
        element: <AIAssistant />,
      },
    ],
  },
], { basename: "/procurement-management" } as any)

function App() {
  return <RouterProvider router={router} />
}

export default App
