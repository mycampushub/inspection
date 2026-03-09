import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { approvedBy, comments } = body;

    if (!approvedBy) {
      return NextResponse.json({ success: false, error: "approvedBy is required" }, { status: 400 });
    }

    const approvedRequest = dataStore.approveProcurementRequest(id, approvedBy, comments);

    if (!approvedRequest) {
      return NextResponse.json({ success: false, error: "Procurement request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: approvedRequest });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to approve procurement request" }, { status: 500 });
  }
}
