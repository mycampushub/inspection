import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supplier = dataStore.getSupplierById(id);

    if (!supplier) {
      return NextResponse.json({ success: false, error: "Supplier not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: supplier });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch supplier" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();

    const { id } = await params;
    const updatedSupplier = dataStore.updateSupplier(id, body);

    if (!updatedSupplier) {
      return NextResponse.json({ success: false, error: "Supplier not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedSupplier });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update supplier" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = dataStore.deleteSupplier(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Supplier not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Supplier deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete supplier" }, { status: 500 });
  }
}
