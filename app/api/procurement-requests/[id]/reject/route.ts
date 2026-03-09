import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { rejectedBy, comments } = body;

    if (!rejectedBy) {
      return NextResponse.json({ success: false, error: "rejectedBy is required" }, { status: 400 });
    }

    const rejectedRequest = dataStore.rejectProcurementRequest(id, rejectedBy, comments);

    if (!rejectedRequest) {
      return NextResponse.json({ success: false, error: "Procurement request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rejectedRequest });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to reject procurement request" }, { status: 500 });
  }
}
