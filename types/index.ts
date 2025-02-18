export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  features: string[];
  color: string;
  popular?: boolean;
}

export interface PaymentData {
  transactionReference: string;
  customerMsisdn: string;
  amount: string;
  thirdPartyReference: string;
  serviceProviderCode: string;
}

export interface PaymentResponse {
  success: boolean;
  data?: {
    output_ConversationID: string;
    output_TransactionID: string;
    output_ResponseCode: string;
    output_ResponseDesc: string;
  };
  error?: string;
  conversationId?: string;
  transactionId?: string;
  responseCode?: string;
  responseDesc?: string;
}
