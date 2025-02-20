import React from "react";
import { Modal } from "./modal";
import { Button } from "@/components/ui/button";
import { PhoneNumberInput } from "./PhoneNumberInput";
import { ServicePackage } from "@/types";

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  package: ServicePackage;
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  phoneError?: string;
  isLoading: boolean;
}

export const PaymentConfirmationModal: React.FC<
  PaymentConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  package: pkg,
  phoneNumber,
  onPhoneNumberChange,
  phoneError,
  isLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Payment">
      <div className="space-y-4">
        <div className="text-lg font-medium">Package: {pkg.name}</div>
        <div className="text-2xl font-bold">
          Amount: {pkg.price.toLocaleString()} MT
        </div>
        <PhoneNumberInput
          value={phoneNumber}
          onChange={onPhoneNumberChange}
          error={phoneError}
        />
        <div className="flex space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading || !!phoneError}>
            {isLoading ? "Processing..." : "Confirm Payment"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
