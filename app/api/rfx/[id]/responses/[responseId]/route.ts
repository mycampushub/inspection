import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; responseId: string }> }) {
  try {
    const body = await request.json();

    const { id, responseId } = await params;
    const updatedResponse = dataStore.updateRfxResponse(id, responseId, body);

    if (!updatedResponse) {
      return NextResponse.json({ success: false, error: "Response not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedResponse });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update response" }, { status: 500 });
  }
}
