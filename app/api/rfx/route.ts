import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let rfxEvents = dataStore.getRfxEvents();

    // Apply filters
    if (status && status !== "all") {
      rfxEvents = rfxEvents.filter((r) => r.status === status);
    }
    if (type && type !== "all") {
      rfxEvents = rfxEvents.filter((r) => r.type === type);
    }
    if (category) {
      rfxEvents = rfxEvents.filter((r) => r.category === category);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      rfxEvents = rfxEvents.filter(
        (r) =>
          r.title.toLowerCase().includes(searchLower) ||
          r.id.toLowerCase().includes(searchLower) ||
          r.description?.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ success: true, data: rfxEvents });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch Rfx events" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newRfx = dataStore.createRfxEvent(body);

    return NextResponse.json({ success: true, data: newRfx }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create Rfx event" }, { status: 500 });
  }
}
