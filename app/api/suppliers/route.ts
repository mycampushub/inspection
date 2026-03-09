import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const tier = searchParams.get("tier");
    const search = searchParams.get("search");

    let suppliers = dataStore.getSuppliers();

    // Apply filters
    if (category && category !== "all") {
      suppliers = dataStore.getSuppliersByCategory(category);
    }
    if (type && type !== "all") {
      suppliers = dataStore.getSuppliersByType(type);
    }
    if (status && status !== "all") {
      suppliers = dataStore.getSuppliersByStatus(status);
    }
    if (tier && tier !== "all") {
      suppliers = dataStore.getSuppliersByTier(tier);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      suppliers = suppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.id.toLowerCase().includes(searchLower) ||
          s.contactPerson.toLowerCase().includes(searchLower) ||
          s.email.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ success: true, data: suppliers });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch suppliers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newSupplier = dataStore.createSupplier(body);

    return NextResponse.json({ success: true, data: newSupplier }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create supplier" }, { status: 500 });
  }
}
