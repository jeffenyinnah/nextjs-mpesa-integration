import axios from "axios";

const MPESA_API_HOST = "api.sandbox.vm.co.mz"; // Use api.vm.co.mz for production
const MPESA_BEARER_TOKEN = process.env.MPESA_BEARER_TOKEN || "";
const MPESA_SERVICE_PROVIDER_CODE = "171717";

export interface MpesaResponse {
  output_ResponseCode: string;
  output_ResponseDesc: string;
  output_TransactionID: string;
  output_ConversationID: string;
  output_ThirdPartyReference: string;
}

export const createMpesaPayment = async (
  amount: string,
  phoneNumber: string,
  transactionRef: string,
  thirdPartyRef: string
) => {
  const endpoint = `https://${MPESA_API_HOST}:18352/ipg/v1x/c2bPayment/singleStage/`;

  const headers = {
    "Content-Type": "application/json",
    Origin: "developer.mpesa.vm.co.mz",
    Authorization: `Bearer ${MPESA_BEARER_TOKEN}`,
  };

  // Ensure phone number starts with 258
  const formattedPhoneNumber = phoneNumber.startsWith("258")
    ? phoneNumber
    : `258${phoneNumber}`;

  const payload = {
    input_TransactionReference: transactionRef,
    input_CustomerMSISDN: formattedPhoneNumber,
    input_Amount: amount,
    input_ThirdPartyReference: thirdPartyRef,
    input_ServiceProviderCode: MPESA_SERVICE_PROVIDER_CODE,
  };

  try {
    console.log("Making M-Pesa API request...");
    console.log("Endpoint:", endpoint);
    console.log("Headers:", headers);
    console.log("Payload:", payload);

    const response = await axios.post<MpesaResponse>(endpoint, payload, {
      headers,
      timeout: 30000, // 30 second timeout
    });

    console.log("M-Pesa API response:", response.data);

    return {
      statusCode: response.status,
      response: response.data,
      headers: response.headers,
    };
  } catch (error: any) {
    console.error("M-Pesa API error:", error.response?.data || error.message);
    return {
      statusCode: error.response?.status || 500,
      error: error.response?.data || error.message,
      response: null,
    };
  }
};
