import axios from "axios";

const MPESA_API_HOST = "api.sandbox.vm.co.mz"; // Use api.vm.co.mz for production
const MPESA_BEARER_TOKEN =
  "TORHMJIkXBxMYrwrbKSCTCYE0Fh1MPSNwOYwHlQnLmBBcIWbpkHXDFy8VJKvzHKQGpMnln0bulzwjz4X1p46zNBdcdv2R0zjhb+Qv5FFPGT+YnzwI5+tps7v/2vGftv/Qu3j8x9kg3wdKXcJHhRm/qni0n6OvfzT7vc1aIPA3MPWMFQCSWwHkRfTM97I7q3opMKW7PxHyh5PSaDjIXt+T2EpY+5I0AfcxDpTlqsYQHA0+nmxMLUubyWvkxoF1SxW/3Zw4KbQDOw86iB6iyZf5Mwir2hKxKFPAg0ngFb66UhG/JfQzzt5NODz+vrwJFsY55Fcg0XdbXBxP1yVCT6xXGcG3Txab7oFQyPcp6eRDGocY8e8o49b4KMj8rnkMFazs/emRakFx/2N0jGb+YhwFlIWMBhRE2vAkyoQ5dPbYSODRB7PGtsh96a+trAs86vah3xUB8IMRTOKgHKpcGnIXHug4J6QtQ3RKuDwXQ+me4ZP0XVzjA4jMzAt3YLhsPlNTZ/5s5qdQwDL+pizL8ZzNJUe1PDexB9X53YbZ7S0u/6/j3WVF653s8T6kpm8ypst93u4gdEMECWMtKvX7B4IzDJTGJScskrfSZqYSCNo3aj4WrK1tHfUXY8N98nFk5FYvhu2ye7/7TzfD/97+Ae34tfP2PSQo7lazoSUSzUo6ms=";
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
