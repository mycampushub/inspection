import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();

    const { id } = await params;
    const newResponse = dataStore.addRfxResponse(id, body);

    if (!newResponse) {
      return NextResponse.json({ success: false, error: "Rfx event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: newResponse }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create response" }, { status: 500 });
  }
}
