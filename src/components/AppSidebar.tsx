import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  BarChart3,
  Box,
  Building2,
  FileText,
  Home,
  LineChart,
  MessageSquareText,
  PieChart,
  Search,
  ShoppingCart,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Input } from "./ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "./ui/sidebar"

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Procurement Requests",
    href: "/procurement-requests",
    icon: ShoppingCart,
  },
  {
    title: "Spend Analysis",
    href: "/spend-analysis",
    icon: BarChart3,
  },
  {
    title: "Category Management",
    href: "/category-management",
    icon: Box,
  },
  {
    title: "Sourcing & Contracts",
    href: "/sourcing-contracts",
    icon: FileText,
    subItems: [
      {
        title: "RFx Management",
        href: "/sourcing-contracts/rfx",
      },
      {
        title: "Contract Repository",
        href: "/sourcing-contracts/contracts",
      },
    ],
  },
  {
    title: "Supplier Management",
    href: "/supplier-management",
    icon: Building2,
    subItems: [
      {
        title: "Supplier Directory",
        href: "/supplier-management/directory",
      },
      {
        title: "Performance Monitoring",
        href: "/supplier-management/performance",
      },
    ],
  },
  {
    title: "Reports & Analytics",
    href: "/reporting-analytics",
    icon: LineChart,
  },
  {
    title: "AI Assistant",
    href: "/ai-assistant",
    icon: MessageSquareText,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <PieChart className="h-6 w-6" />
          <span className="text-lg font-semibold">ProcureIQ</span>
        </div>
        <div className="mt-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={
                  location.pathname === item.href ||
                  (item.subItems && item.subItems.some((subItem) => location.pathname === subItem.href))
                }
                tooltip={item.title}
              >
                <Link to={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {item.subItems && (
                <SidebarMenuSub>
                  {item.subItems.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild isActive={location.pathname === subItem.href}>
                        <Link to={subItem.href}>{subItem.title}</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-muted-foreground">Procurement Manager</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
