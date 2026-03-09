import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const evaluation = dataStore.getPerformanceEvaluationById(id);

    if (!evaluation) {
      return NextResponse.json({ success: false, error: "Evaluation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: evaluation });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch evaluation" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();

    const { id } = await params;
    const updatedEvaluation = dataStore.updatePerformanceEvaluation(id, body);

    if (!updatedEvaluation) {
      return NextResponse.json({ success: false, error: "Evaluation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedEvaluation });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update evaluation" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = dataStore.deletePerformanceEvaluation(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Evaluation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Evaluation deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete evaluation" }, { status: 500 });
  }
}
