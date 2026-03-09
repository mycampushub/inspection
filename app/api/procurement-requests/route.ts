import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const department = searchParams.get("department");
    const search = searchParams.get("search");

    let requests = dataStore.getProcurementRequests();

    // Apply filters
    if (status && status !== "all") {
      requests = requests.filter((r) => r.status === status);
    }
    if (priority && priority !== "all") {
      requests = requests.filter((r) => r.priority === priority);
    }
    if (department) {
      requests = requests.filter((r) => r.department.toLowerCase().includes(department.toLowerCase()));
    }
    if (search) {
      const searchLower = search.toLowerCase();
      requests = requests.filter(
        (r) =>
          r.title.toLowerCase().includes(searchLower) ||
          r.id.toLowerCase().includes(searchLower) ||
          r.requester.toLowerCase().includes(searchLower) ||
          r.department.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch procurement requests" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newRequest = dataStore.createProcurementRequest(body);

    return NextResponse.json({ success: true, data: newRequest }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create procurement request" }, { status: 500 });
  }
}
