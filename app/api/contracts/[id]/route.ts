import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const contract = dataStore.getContractById(id);

    if (!contract) {
      return NextResponse.json({ success: false, error: "Contract not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: contract });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch contract" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();

    const { id } = await params;
    const updatedContract = dataStore.updateContract(id, body);

    if (!updatedContract) {
      return NextResponse.json({ success: false, error: "Contract not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedContract });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update contract" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = dataStore.deleteContract(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Contract not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Contract deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete contract" }, { status: 500 });
  }
}
