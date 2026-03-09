import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; subcategoryId: string }> }) {
  try {
    const { id, subcategoryId } = await params;
    const body = await request.json();

    const updatedSubcategory = dataStore.updateSubcategory(parseInt(id), parseInt(subcategoryId), body);

    if (!updatedSubcategory) {
      return NextResponse.json({ success: false, error: "Subcategory not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedSubcategory });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update subcategory" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; subcategoryId: string }> }) {
  try {
    const { id, subcategoryId } = await params;
    const deleted = dataStore.deleteSubcategory(parseInt(id), parseInt(subcategoryId));

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Subcategory not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Subcategory deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete subcategory" }, { status: 500 });
  }
}
