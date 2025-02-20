// mpesa-node-api.d.ts
declare module "mpesa-node-api" {
  interface MpesaConfig {
    baseUrl: string;
    apiKey: string;
    publicKey: string;
    origin: string;
    serviceProviderCode: string;
  }

  interface MpesaResponse {
    output_ConversationID: string;
    output_ResponseCode: string;
    output_ResponseDesc: string;
    output_ThirdPartyReference: string;
    output_TransactionID: string;
  }

  interface MpesaError {
    response?: {
      data: any;
    };
    message: string;
  }

  const mpesa: {
    initializeApi(config: MpesaConfig): void;
    initiate_c2b(
      amount: number,
      msisdn: string,
      transactionRef: string,
      thirdPartyRef: string
    ): Promise<MpesaResponse>;
    initiate_b2c(
      amount: number,
      msisdn: string,
      transactionRef: string,
      thirdPartyRef: string
    ): Promise<MpesaResponse>;
  };

  export default mpesa;
}
