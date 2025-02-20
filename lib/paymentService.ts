export interface PaymentResponse {
  statusCode: number;
  response?: any;
  error?: any;
}

export const initiateMpesaPayment = async (paymentData: {
  amount: string;
  phoneNumber: string;
  transactionRef: string;
  thirdPartyRef: string;
}): Promise<PaymentResponse> => {
  try {
    const response = await fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Payment failed. Please try again.");
    }

    return data;
  } catch (error) {
    console.error("Payment service error:", error);
    throw error;
  }
};
