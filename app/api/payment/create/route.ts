import { NextRequest, NextResponse } from "next/server";
import { clickPayService } from "../../../../lib/clickpay/service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await clickPayService.createPayment(body);

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, message: result.message },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
