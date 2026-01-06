"use client";
import { BackButton } from "@/components/back-button";
import React, { useState } from "react";

interface PaymentFormData {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
}

const PaymentPage: React.FC = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatCardNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(" ") : numbers;
  };

  const formatExpiryDate = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + "/" + numbers.slice(2, 4);
    }
    return numbers;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      handleInputChange("cardNumber", formatted);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace(/\//g, "").length <= 4) {
      handleInputChange("expiryDate", formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, "");
    if (numbers.length <= 3) {
      handleInputChange("cvv", numbers);
    }
  };

  const handlePayment = () => {
    console.log("Processing payment with data:", formData);
    alert("Payment processed! (Demo only)");
  };

  const handleApplePay = () => {
    console.log("Processing Apple Pay");
    alert("Apple Pay processing! (Demo only)");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <BackButton />
          <h1 className="text-[#24507F] text-lg font-semibold font-['Poppins']">
            Payment
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Page Title */}
        <div className="text-center mb-6">
          <h2 className="text-black text-lg font-['PT_Sans_Caption'] mb-1">
            Complete Payment
          </h2>
          <p className="text-[#515050] text-sm font-['PT_Sans_Caption']">
            Enter your card details to subscribe
          </p>
        </div>

        {/* Selected Plan Card */}
        <div className="mb-8">
          <div className="bg-[#E1E2F0] rounded-2xl shadow-md border border-[#037EE6] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Diamond Icon */}
                <div className="relative w-5 h-4">
                  <svg
                    width="19"
                    height="17"
                    viewBox="0 0 19 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.34689 0C3.2226 6.19679e-05 3.10079 0.032427 2.99509 0.0934702C2.8894 0.154513 2.80399 0.241825 2.74843 0.345625L0.0707919 5.34563C0.0131641 5.45313 -0.0100351 5.57386 0.00397515 5.69337C0.0179854 5.81287 0.0686106 5.92606 0.149782 6.01938L8.85212 16.0194C8.91488 16.0915 8.99408 16.1496 9.08394 16.1895C9.1738 16.2295 9.27206 16.2502 9.37158 16.2502C9.47109 16.2502 9.56936 16.2295 9.65922 16.1895C9.74908 16.1496 9.82827 16.0915 9.89104 16.0194L18.5934 6.01938C18.6745 5.92606 18.7252 5.81287 18.7392 5.69337C18.7532 5.57386 18.73 5.45313 18.6724 5.34563L15.9947 0.345625C15.9392 0.241825 15.8538 0.154513 15.7481 0.0934702C15.6424 0.032427 15.5206 6.19679e-05 15.3963 0H3.34689Z"
                      fill="url(#paint0_linear_751_697)"
                      fillOpacity="0.7"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_751_697"
                        x1="-1.90397"
                        y1="-15.3019"
                        x2="11.4133"
                        y2="18.2254"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop
                          offset="0.533"
                          stopColor="#FF6CE8"
                          stopOpacity="0"
                        />
                        <stop offset="1" stopColor="#FF6CE8" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div>
                  <p className="text-[#515050] text-xs font-bold font-['PT_Sans_Caption']">
                    Selected Plan
                  </p>
                  <h3 className="text-black text-base font-['PT_Sans_Caption']">
                    Premium
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-[#323232] text-xl font-['Poppins']">
                    $20
                  </span>
                  <div className="h-5 w-px bg-[#323232]"></div>
                </div>
                <p className="text-[#515050] text-xs font-['PT_Sans_Caption']">
                  per month
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Details Form */}
        <div className="bg-[#E1E2F0] rounded-2xl border border-[#6F6F6F] p-6 mb-6">
          {/* Card Number */}
          <div className="mb-6">
            <label className="block text-black text-sm font-['PT_Sans_Caption'] mb-2">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="w-full h-10 bg-white rounded-lg shadow-sm border border-[#6F6F6F] px-4 text-center text-sm font-['PT_Sans_Caption'] placeholder:text-[#989898] focus:outline-none focus:ring-2 focus:ring-[#24507F]"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {/* Visa Icon */}
                <svg
                  width="24"
                  height="16"
                  viewBox="0 0 24 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_visa)">
                    <path
                      d="M21.75 0.25H2.25C1.14543 0.25 0.25 1.14543 0.25 2.25V13.75C0.25 14.8546 1.14543 15.75 2.25 15.75H21.75C22.8546 15.75 23.75 14.8546 23.75 13.75V2.25C23.75 1.14543 22.8546 0.25 21.75 0.25Z"
                      fill="white"
                      stroke="black"
                      strokeOpacity="0.2"
                      strokeWidth="0.5"
                    />
                    <path
                      d="M2.78773 5.91444C2.26459 5.62751 1.66754 5.39674 1 5.23659L1.028 5.11188H3.76498C4.13596 5.12489 4.43699 5.23651 4.53495 5.63071L5.12977 8.46659L5.31198 9.32073L6.97797 5.11188H8.77679L6.10288 11.2775H4.30397L2.78773 5.91444ZM10.1 11.2841H8.39883L9.46285 5.11188H11.1639L10.1 11.2841ZM16.2668 5.26277L16.0354 6.59559L15.8816 6.53004C15.5737 6.40525 15.1674 6.28054 14.6144 6.29371C13.9427 6.29371 13.6415 6.56277 13.6345 6.82546C13.6345 7.11441 13.9989 7.30484 14.5939 7.58725C15.574 8.02719 16.0286 8.56557 16.0218 9.26819C16.0081 10.5486 14.846 11.3761 13.0611 11.3761C12.2979 11.3694 11.5628 11.2181 11.1638 11.0476L11.4019 9.66205L11.6259 9.76066C12.1789 9.99071 12.5428 10.089 13.222 10.089C13.7118 10.089 14.2369 9.89838 14.2436 9.48488C14.2436 9.21565 14.0199 9.01851 13.3617 8.71646C12.7178 8.42087 11.8568 7.92848 11.8708 7.04198C11.8781 5.84042 13.0611 5 14.741 5C15.399 5 15.9312 5.13789 16.2668 5.26277ZM18.5278 9.09749H19.9417C19.8718 8.78889 19.5496 7.31147 19.5496 7.31147L19.4307 6.77964C19.3467 7.00943 19.1999 7.38373 19.2069 7.37056C19.2069 7.37056 18.6678 8.7429 18.5278 9.09749ZM20.6276 5.11188L22 11.284H20.4249C20.4249 11.284 20.2708 10.5748 20.2219 10.3581H18.0378C17.9746 10.5222 17.6808 11.284 17.6808 11.284H15.8958L18.4226 5.62399C18.5977 5.22342 18.906 5.11188 19.3118 5.11188H20.6276Z"
                      fill="#171E6C"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_visa">
                      <rect width="24" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                {/* Mastercard Icon */}
                <svg
                  width="24"
                  height="16"
                  viewBox="0 0 24 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_mastercard)">
                    <path
                      d="M22 0H2C0.89543 0 0 0.89543 0 2V14C0 15.1046 0.89543 16 2 16H22C23.1046 16 24 15.1046 24 14V2C24 0.89543 23.1046 0 22 0Z"
                      fill="#252525"
                    />
                    <path
                      d="M9 13C11.7614 13 14 10.7614 14 8C14 5.23858 11.7614 3 9 3C6.23858 3 4 5.23858 4 8C4 10.7614 6.23858 13 9 13Z"
                      fill="#EB001B"
                    />
                    <path
                      d="M15 13C17.7614 13 20 10.7614 20 8C20 5.23858 17.7614 3 15 3C12.2386 3 10 5.23858 10 8C10 10.7614 12.2386 13 15 13Z"
                      fill="#F79E1B"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 3.99963C13.2144 4.91184 14 6.36418 14 8C14 9.63582 13.2144 11.0882 12 12.0004C10.7856 11.0882 10 9.63582 10 8C10 6.36418 10.7856 4.91184 12 3.99963Z"
                      fill="#FF5F00"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_mastercard">
                      <rect width="24" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Cardholder Name */}
          <div className="mb-6">
            <label className="block text-black text-sm font-['PT_Sans_Caption'] mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={formData.cardholderName}
              onChange={(e) =>
                handleInputChange("cardholderName", e.target.value)
              }
              placeholder="John Doe"
              className="w-full h-10 bg-white rounded-lg shadow-sm border border-[#6F6F6F] px-4 text-center text-sm font-['PT_Sans_Caption'] placeholder:text-[#989898] focus:outline-none focus:ring-2 focus:ring-[#24507F]"
            />
          </div>

          {/* Expiry Date and CVV */}
          <div className="grid grid-cols-2 gap-4">
            {/* Expiry Date */}
            <div>
              <label className="block text-black text-sm font-['PT_Sans_Caption'] mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={formData.expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/YY"
                className="w-full h-10 bg-white rounded-lg shadow-sm border border-[#6F6F6F] px-4 text-center text-sm font-['PT_Sans_Caption'] placeholder:text-[#989898] focus:outline-none focus:ring-2 focus:ring-[#24507F]"
              />
            </div>

            {/* CVV */}
            <div>
              <label className="block text-black text-sm font-['PT_Sans_Caption'] mb-2">
                CVV
              </label>
              <input
                type="text"
                value={formData.cvv}
                onChange={handleCvvChange}
                placeholder="123"
                className="w-full h-10 bg-white rounded-lg shadow-sm border border-[#6F6F6F] px-4 text-center text-sm font-['PT_Sans_Caption'] placeholder:text-[#989898] focus:outline-none focus:ring-2 focus:ring-[#24507F]"
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-[#6F6F6F] text-xs font-['PT_Sans_Caption']">
              All payments are securely processed and encrypted.
            </p>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          className="w-full py-3 bg-[#8EAFDE] rounded-lg border border-[#1E124E] text-[#1D324E] text-sm font-['Inter'] mb-4 hover:bg-[#7A9FCE] transition-colors flex items-center justify-center"
        >
          Pay $20
        </button>

        {/* Apple Pay Button */}
        <button
          onClick={handleApplePay}
          className="w-full py-3 bg-white rounded-lg border border-[#545454] text-[#1D324E] text-sm font-['Inter'] mb-6 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg
            width="11"
            height="12"
            viewBox="0 0 11 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.20407 0.2412C8.20407 0.8556 7.90684 1.47 7.48667 1.9128C7.04084 2.4036 6.26941 2.7684 5.65604 2.7684C5.58579 2.7684 5.51554 2.76 5.4723 2.7528C5.45633 2.68124 5.44774 2.60854 5.44663 2.5356C5.44663 1.9128 5.80601 1.2984 6.19105 0.9096C6.68147 0.4044 7.49478 0.0228 8.1784 0C8.19596 0.0696 8.20407 0.156 8.20407 0.2412ZM10.615 4.1112L10.6487 4.0914C9.73747 2.9316 8.35403 2.9004 7.96899 2.9004C7.37994 2.9004 6.85237 3.0864 6.40924 3.2424C6.08837 3.3552 5.81141 3.4524 5.58714 3.4524C5.33923 3.4524 5.05551 3.3504 4.7387 3.2376C4.3388 3.0936 3.88756 2.9316 3.38903 2.9316C1.70769 2.9316 0 4.17 0 6.5022C0 7.9566 0.630926 9.4896 1.41182 10.476C2.08597 11.316 2.67232 12 3.51265 12C3.9112 12 4.2037 11.8902 4.51105 11.7744C4.85151 11.646 5.21088 11.5104 5.75399 11.5104C6.30386 11.5104 6.63215 11.6376 6.94829 11.76C7.24349 11.874 7.5272 11.9844 7.97034 11.9844C8.88903 11.9844 9.49294 11.2464 10.0712 10.5072C10.7197 9.6672 10.9919 8.8428 11 8.8044C10.9473 8.7888 9.18626 8.1582 9.18626 6.3774C9.18626 4.9434 10.3866 4.2444 10.615 4.1112Z"
              fill="#373737"
            />
          </svg>
          Pay with Apple Pay
        </button>

        {/* Terms and Conditions */}
        <div className="text-center">
          <p className="text-[#6F6F6F] text-xs font-['PT_Sans_Caption']">
            By confirming payment, you agree to our{" "}
            <span className="text-[#24507F] underline">
              Terms of Service and Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
