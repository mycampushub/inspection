import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const supplierId = searchParams.get("supplierId");
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    let evaluations = dataStore.getPerformanceEvaluations();

    // Apply filters
    if (supplierId) {
      evaluations = dataStore.getEvaluationsBySupplier(supplierId);
    }
    if (category) {
      evaluations = evaluations.filter((e) => e.category === category);
    }
    if (status && status !== "all") {
      evaluations = evaluations.filter((e) => e.status === status);
    }

    return NextResponse.json({ success: true, data: evaluations });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch evaluations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newEvaluation = dataStore.createPerformanceEvaluation(body);

    return NextResponse.json({ success: true, data: newEvaluation }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create evaluation" }, { status: 500 });
  }
}
