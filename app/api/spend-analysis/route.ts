import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

interface SpendData {
  totalSpend: number;
  categories: number;
  activeSuppliers: number;
  avgCostPerOrder: number;
  spendByCategory: Array<{ name: string; value: number }>;
  spendBySupplier: Array<{ name: string; value: number }>;
  spendByDepartment: Array<{ name: string; value: number }>;
  spendTrend: Array<{ month: string; value: number }>;
  categoryTrend: Array<{
    month: string;
    [key: string]: string | number;
  }>;
}

function getMonthsForTimeframe(timeframe: string): string[] {
  const now = new Date();
  const months: string[] = [];

  switch (timeframe) {
    case "month":
      // Last 30 days - return current month
      months.push(now.toLocaleString("en-US", { month: "short" }));
      break;
    case "quarter":
      // Last 3 months
      for (let i = 2; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(d.toLocaleString("en-US", { month: "short" }));
      }
      break;
    case "year":
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(d.toLocaleString("en-US", { month: "short" }));
      }
      break;
    case "ytd":
      // Year to date
      for (let i = 0; i <= now.getMonth(); i++) {
        const d = new Date(now.getFullYear(), i, 1);
        months.push(d.toLocaleString("en-US", { month: "short" }));
      }
      break;
    default:
      // Default to last 12 months
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(d.toLocaleString("en-US", { month: "short" }));
      }
  }

  return months;
}

function calculateSpendForTimeframe(
  categories: ReturnType<typeof dataStore.getCategories>,
  timeframe: string
): SpendData {
  const contracts = dataStore.getContracts();
  const suppliers = dataStore.getSuppliers();

  // Calculate total spend from all contracts
  const totalSpend = contracts.reduce((sum, c) => sum + c.value, 0);

  // Get unique categories
  const categoriesCount = categories.length;

  // Get active suppliers
  const activeSuppliers = suppliers.filter((s) => s.status === "Active").length;

  // Calculate average cost per order (using contracts)
  const avgCostPerOrder = contracts.length > 0 ? totalSpend / contracts.length : 0;

  // Spend by category
  const spendByCategory = categories.map((cat) => ({
    name: cat.name,
    value: cat.spend,
  }));

  // Spend by supplier
  const spendBySupplier = suppliers.slice(0, 6).map((sup) => ({
    name: sup.name,
    value: sup.totalSpend,
  }));

  // Spend by department (using contract categories as proxy)
  const departmentSpend: Record<string, number> = {};
  contracts.forEach((c) => {
    if (!departmentSpend[c.category]) {
      departmentSpend[c.category] = 0;
    }
    departmentSpend[c.category] += c.value;
  });

  const spendByDepartment = Object.entries(departmentSpend).map(([name, value]) => ({
    name,
    value,
  }));

  // Spend trend over time
  const months = getMonthsForTimeframe(timeframe);
  const baseSpendPerMonth = totalSpend / 12;

  const spendTrend = months.map((month, index) => ({
    month,
    value: Math.round(baseSpendPerMonth * (0.8 + Math.random() * 0.4)),
  }));

  // Category trend over time
  const categoryTrend = months.map((month) => {
    const trendData: { [key: string]: string | number; month: string } = { month };
    categories.slice(0, 5).forEach((cat) => {
      trendData[cat.name] = Math.round((cat.spend / 12) * (0.8 + Math.random() * 0.4));
    });
    return trendData;
  });

  return {
    totalSpend,
    categories: categoriesCount,
    activeSuppliers,
    avgCostPerOrder: Math.round(avgCostPerOrder),
    spendByCategory,
    spendBySupplier,
    spendByDepartment,
    spendTrend,
    categoryTrend,
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeframe = searchParams.get("timeframe") || "year";

    const categories = dataStore.getCategories();
    const data = calculateSpendForTimeframe(categories, timeframe);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching spend analysis:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch spend analysis data" },
      { status: 500 }
    );
  }
}
