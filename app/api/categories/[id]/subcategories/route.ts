import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();

    const { id } = await params;
    const newSubcategory = dataStore.addSubcategory(parseInt(id), body);

    if (!newSubcategory) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: newSubcategory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create subcategory" }, { status: 500 });
  }
}
