import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rfx = dataStore.getRfxEventById(id);

    if (!rfx) {
      return NextResponse.json({ success: false, error: "Rfx event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: rfx });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch Rfx event" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();

    const { id } = await params;
    const updatedRfx = dataStore.updateRfxEvent(id, body);

    if (!updatedRfx) {
      return NextResponse.json({ success: false, error: "Rfx event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedRfx });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update Rfx event" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = dataStore.deleteRfxEvent(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Rfx event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Rfx event deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete Rfx event" }, { status: 500 });
  }
}
