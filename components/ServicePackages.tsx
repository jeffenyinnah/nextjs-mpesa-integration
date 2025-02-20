"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentConfirmationModal } from "./PaymentConfirmationModal";
import { initiateMpesaPayment } from "@/lib/paymentService";

// Types and Interfaces
interface ServicePackage {
  id: string;
  name: string;
  price: number;
  features: string[];
  color: string;
  popular?: boolean;
}

interface PaymentStatus {
  type: "success" | "error";
  message: string;
  details?: any;
}

interface PaymentStatusMessageProps {
  status: PaymentStatus | null;
}

const packages: ServicePackage[] = [
  {
    id: "basic-pkg",
    name: "Basic Package",
    price: 7000,
    features: [
      "Up to 5 users",
      "Basic support",
      "2GB storage",
      "Email support",
      "Basic analytics",
      "Monthly reports",
    ],
    color: "blue",
  },
  {
    id: "pro-pkg",
    name: "Professional Package",
    price: 12000,
    features: [
      "Up to 20 users",
      "Priority support",
      "10GB storage",
      "24/7 phone support",
      "Advanced analytics",
      "Custom reports",
      "API access",
      "Team collaboration",
    ],
    color: "purple",
    popular: true,
  },
  {
    id: "enterprise-pkg",
    name: "Enterprise Package",
    price: 20000,
    features: [
      "Unlimited users",
      "Dedicated support",
      "Unlimited storage",
      "Custom integration",
      "AI-powered analytics",
      "White-label option",
      "API access",
      "Advanced security",
      "Custom development",
      "Training sessions",
    ],
    color: "indigo",
  },
];

// Payment Status Message Component
const PaymentStatusMessage: React.FC<PaymentStatusMessageProps> = ({
  status,
}) => {
  if (!status) return null;

  const bgColor = status.type === "success" ? "bg-green-100" : "bg-red-100";
  const textColor =
    status.type === "success" ? "text-green-800" : "text-red-800";
  const borderColor =
    status.type === "success" ? "border-green-400" : "border-red-400";

  return (
    <div
      className={`max-w-md mx-auto mb-8 p-4 rounded-lg border ${bgColor} ${borderColor} ${textColor}`}
    >
      <p className="text-center font-medium">{status.message}</p>
    </div>
  );
};

// Main Component
const ServicePackages: React.FC = () => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null
  );
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(
    null
  );
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");

  const validatePhoneNumber = (number: string): boolean => {
    const regex = /^(?:258)?[8-9][0-9]{8}$/;
    const isValid = regex.test(number);
    setPhoneError(
      isValid
        ? ""
        : "Please enter a valid Mozambican phone number (e.g., 258841234567 or 841234567)"
    );
    return isValid;
  };

  const handlePaymentClick = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setPhoneError("");
    setPhoneNumber("");
    setPaymentStatus(null);
  };

  const handlePayment = async () => {
    if (!selectedPackage || !validatePhoneNumber(phoneNumber)) {
      return;
    }

    setLoading((prev) => ({ ...prev, [selectedPackage.id]: true }));

    try {
      const formattedPhone = phoneNumber.startsWith("258")
        ? phoneNumber
        : `258${phoneNumber}`;

      const paymentData = {
        amount: selectedPackage.price.toString(),
        phoneNumber: formattedPhone,
        transactionRef: `TXN${Date.now()}`,
        thirdPartyRef: `REF${Date.now()}`,
      };

      console.log("Initiating payment with data:", paymentData);

      const result = await initiateMpesaPayment(paymentData);

      console.log("Payment result:", result);

      // Check for success using multiple indicators
      const isSuccess =
        result.statusCode === 200 ||
        result.response?.output_ResponseCode === "INS-0" ||
        result.response?.output_ResponseCode === "0";

      if (isSuccess) {
        setPaymentStatus({
          type: "success",
          message:
            "Payment initiated successfully! Please check your phone for the M-Pesa prompt.",
          details: result.response,
        });
        setSelectedPackage(null); // Close modal on success
      } else {
        const errorMessage =
          result.error?.output_ResponseDesc ||
          result.error?.message ||
          result.response?.output_ResponseDesc ||
          "Payment failed. Please try again.";

        setPaymentStatus({
          type: "error",
          message: errorMessage,
          details: result.error || result.response,
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Payment failed. Please try again.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [selectedPackage.id]: false }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Package
        </h1>
        <p className="text-xl text-gray-600">
          Select the perfect package for your business needs
        </p>
      </div>

      <PaymentStatusMessage status={paymentStatus} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative ${
              pkg.popular ? "border-purple-500 border-2" : ""
            }`}
          >
            {pkg.popular && (
              <div className="absolute top-0 right-0 -mt-4 mr-4">
                <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
              <p className="text-4xl font-bold mt-4">
                {pkg.price.toLocaleString()} MT
                <span className="text-base font-normal text-gray-600">
                  /month
                </span>
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                onClick={() => handlePaymentClick(pkg)}
                disabled={loading[pkg.id]}
              >
                {loading[pkg.id] ? "Processing..." : "Subscribe with M-Pesa"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPackage && (
        <PaymentConfirmationModal
          isOpen={!!selectedPackage}
          onClose={() => {
            setSelectedPackage(null);
            setPaymentStatus(null);
          }}
          onConfirm={handlePayment}
          package={selectedPackage}
          phoneNumber={phoneNumber}
          onPhoneNumberChange={(value: string) => {
            setPhoneNumber(value);
            validatePhoneNumber(value);
          }}
          phoneError={phoneError}
          isLoading={loading[selectedPackage.id]}
        />
      )}
    </div>
  );
};

export default ServicePackages;
