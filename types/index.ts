export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  features: string[];
  color: string;
  popular?: boolean;
}

export interface MpesaApiResponse {
  output_ConversationID: string;
  output_TransactionID: string;
  output_ResponseCode: string;
  output_ResponseDesc: string;
}

export interface PaymentResponse {
  status: "success" | "error";
  responseData?: MpesaApiResponse;
  message: string;
}

export interface PaymentData {
  input_TransactionReference: string;
  input_CustomerMSISDN: string;
  input_Amount: string;
  input_ThirdPartyReference: string;
  input_ServiceProviderCode: string;
}
