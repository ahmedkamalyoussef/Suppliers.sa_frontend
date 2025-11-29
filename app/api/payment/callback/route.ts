import { NextRequest, NextResponse } from "next/server";
import { clickPayService } from "../../../../lib/clickpay/service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract transaction ID from the callback
    const transactionId = body.transaction_id || body.txn_id;

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    // Query the transaction status from ClickPay
    const transactionStatus = await clickPayService.queryTransaction(
      transactionId
    );

    if (!transactionStatus) {
      return NextResponse.json(
        { error: "Failed to query transaction status" },
        { status: 500 }
      );
    }

    // Process the payment result
    if (
      transactionStatus.result === "success" &&
      transactionStatus.transaction_status === "paid"
    ) {
      // Here you would typically:
      // 1. Update your database with the successful payment
      // 2. Activate the user's subscription
      // 3. Send confirmation emails
      // 4. Log the transaction

      

      return NextResponse.json({
        success: true,
        message: "Payment processed successfully",
        transactionId: transactionStatus.transaction_id,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: transactionStatus.response_message || "Payment failed",
      });
    }
  } catch (error: any) {
    console.error("Payment callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
      transaction: transactionStatus,
    });
  } catch (error: any) {
    console.error("Transaction query error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
