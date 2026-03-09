import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const supplierId = searchParams.get("supplierId");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    let contracts = dataStore.getContracts();

    // Apply filters
    if (supplierId) {
      contracts = dataStore.getContractsBySupplier(supplierId);
    }
    if (category && category !== "all") {
      contracts = dataStore.getContractsByCategory(category);
    }
    if (status && status !== "all") {
      contracts = dataStore.getContractsByStatus(status);
    }
    if (type && type !== "all") {
      contracts = dataStore.getContractsByType(type);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      contracts = contracts.filter(
        (c) =>
          c.title.toLowerCase().includes(searchLower) ||
          c.id.toLowerCase().includes(searchLower) ||
          c.supplierName.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ success: true, data: contracts });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch contracts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newContract = dataStore.createContract(body);

    return NextResponse.json({ success: true, data: newContract }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create contract" }, { status: 500 });
  }
}
