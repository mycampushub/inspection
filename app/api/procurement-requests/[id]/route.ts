import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const requestItem = dataStore.getProcurementRequestById(id);

    if (!requestItem) {
      return NextResponse.json({ success: false, error: "Procurement request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: requestItem });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch procurement request" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedRequest = dataStore.updateProcurementRequest(id, body);

    if (!updatedRequest) {
      return NextResponse.json({ success: false, error: "Procurement request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedRequest });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update procurement request" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = dataStore.deleteProcurementRequest(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Procurement request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Procurement request deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete procurement request" }, { status: 500 });
  }
}
