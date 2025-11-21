import { NextRequest, NextResponse } from "next/server";
import { clickPayService } from "../../../../lib/clickpay/service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get("transaction_id");

  if (!transactionId) {
    return NextResponse.json(
      { error: "Transaction ID is required" },
      { status: 400 }
    );
  }

  try {
    const transactionStatus = await clickPayService.queryTransaction(
      transactionId
    );

    if (!transactionStatus) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      transaction: {
        id: transactionStatus.transaction_id,
        status: transactionStatus.transaction_status,
        amount: transactionStatus.cart_amount,
        currency: transactionStatus.cart_currency,
        description: transactionStatus.cart_description,
        customer: transactionStatus.customer_details,
        paymentResult: transactionStatus.payment_result,
      },
    });
  } catch (error: any) {
    console.error("Transaction status query error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
