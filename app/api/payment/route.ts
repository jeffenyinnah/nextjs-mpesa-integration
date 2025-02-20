import { NextResponse } from "next/server";
import { createMpesaPayment } from "@/lib/mpesaService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, phoneNumber, transactionRef, thirdPartyRef } = body;

    // Enhanced validation
    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }
    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }
    if (!transactionRef) {
      return NextResponse.json(
        { error: "Transaction reference is required" },
        { status: 400 }
      );
    }
    if (!thirdPartyRef) {
      return NextResponse.json(
        { error: "Third party reference is required" },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^258[8-9][0-9]{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        {
          error:
            "Invalid phone number format. Must be a valid Mozambican number starting with 258",
        },
        { status: 400 }
      );
    }

    // Validate amount format
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a positive number" },
        { status: 400 }
      );
    }

    console.log("Processing payment request:", {
      amount,
      phoneNumber,
      transactionRef,
      thirdPartyRef,
    });

    const result = await createMpesaPayment(
      amount,
      phoneNumber,
      transactionRef,
      thirdPartyRef
    );

    console.log("Payment result:", result);

    if (result.statusCode === 200) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(
        {
          statusCode: result.statusCode,
          error: result.error,
          response: result.response,
        },
        { status: result.statusCode || 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in payment route:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
