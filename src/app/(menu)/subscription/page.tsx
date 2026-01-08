"use client";

import React from "react";
import { ArrowLeft, Check, Award } from "lucide-react";

type PlanTier = "premium" | "standard";

type Plan = {
  id: PlanTier;
  name: string;
  badge?: string;
  badgeColor?: string;
  price: number;
  originalPrice?: number;
  period: string;
  description: string;
  features: string[];
  bgColor: string;
  buttonText: string;
  isCurrent?: boolean;
};

export default function SubscriptionPlans() {
  const plans: Plan[] = [
    {
      id: "premium",
      name: "Premium Plan",
      badge: "Most popular",
      badgeColor: "bg-[#B7CEEE]",
      price: 20,
      originalPrice: 25,
      period: "per month",
      description:
        "Tap into our ready-to-trade community of top professionals with our seamless skill-matching solution.",
      features: [
        "Unlimited Exchanges – no limit on collaborations",
        "Digital certificate of acquired skills – For CV/LinkedIn",
        "Paid mentoring",
        "Priority access to new opportunities – get notifications before others",
        "AI Mentor Suggestion – the app recommends suitable mentors to you",
        "Skill Tracker AI – receive monthly feedback on what you've learned",
        "Team collaboration mode – perfect for group projects.",
      ],
      bgColor: "bg-[#E9F2FF]",
      buttonText: "Upgrade now",
    },
    {
      id: "standard",
      name: "Standard Plan",
      badge: "Current plan",
      badgeColor: "bg-[#EAEAEA]",
      price: 0,
      period: "per month",
      description:
        "Start trading and connecting with our community. All the essential tools you need to get started.",
      features: [
        "15 skill exchanges/month",
        "Access to basic profiles- See who is offering or looking for skills",
        "Skill Match Basic- get simple suggestions of suitable people",
      ],
      bgColor: "bg-[#F6F8FB]",
      buttonText: "Upgrade to Premium",
      isCurrent: true,
    },
  ];

  const handleUpgrade = (planId: PlanTier) => {
    if (planId === "premium") {
      alert("Upgrading to Premium Plan!");
    } else {
      alert("Upgrading to Premium!");
    }
  };

  return (
    <div className="min-h-svh bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 bg-[#24507F] flex items-center justify-center rounded-lg hover:bg-cyan-900 transition-colors">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-[#24507F] text-lg font-semibold font-['Poppins']">
            Subscription
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Current Plan Summary Card */}
        <div className="mb-8">
          <div className="bg-[#F4F4FC] rounded-2xl shadow-lg border border-[#037EE6] p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <Award className="w-6 h-6 text-[#427687] mt-1 shrink-0" />
                <div>
                  <p className="text-[#515050] text-sm font-bold font-['PT_Sans_Caption']">
                    Current Plan
                  </p>
                  <h3 className="text-black text-lg font-['PT_Sans_Caption']">
                    Standard
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#323232] text-xl font-['Poppins']">$0</p>
                <p className="text-[#515050] text-xs font-['PT_Sans_Caption']">
                  per month
                </p>
              </div>
            </div>
            <button
              onClick={() => handleUpgrade("premium")}
              className="w-full py-3 bg-white rounded-2xl shadow-lg border border-[#24507F] flex items-center justify-center hover:bg-cyan-50 transition-colors"
            >
              <span className="text-center text-[#24507F] text-sm font-bold font-['Poppins']">
                Upgrade plan
              </span>
            </button>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <h2
            className="text-black text-2xl font-normal mb-2"
            style={{ fontFamily: "Hina Mincho, serif" }}
          >
            Choose your plan!
          </h2>
          <p className="text-gray-600 text-sm font-['PT_Sans_Caption']">
            Select the perfect plan for your needs
          </p>
        </div>

        {/* Plans Container */}
        <div className="space-y-8 pb-8">
          {plans.map((plan) => (
            <div key={plan.id} className="relative">
              {/* Plan Card */}
              <div
                className={`${plan.bgColor} rounded-2xl shadow-lg border-2 border-[#24507F] p-6 relative opacity-90`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${plan.badgeColor} rounded-2xl border-2 border-[#24507F] px-4 py-2 flex items-center justify-center`}
                  >
                    <p className="text-[#24507F] text-xs font-bold font-['PT_Sans_Caption'] whitespace-nowrap">
                      {plan.badge}
                    </p>
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-black text-lg font-normal font-['Poppins'] mb-3 mt-2">
                  {plan.name}
                </h3>

                {/* Description */}
                <p className="text-[#545454] text-sm font-['Poppins'] mb-5">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-2">
                  {plan.originalPrice && (
                    <span className="text-[#6F6F6F] text-xl line-through font-['Poppins'] mr-2">
                      ${plan.originalPrice}
                    </span>
                  )}
                  <span className="text-[#323232] text-2xl font-['Poppins']">
                    ${plan.price}
                  </span>
                </div>
                <p className="text-[#6E6E6E] text-xs font-['Poppins'] mb-6">
                  {plan.period}
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        <Check
                          className="w-4 h-4 text-[#24507F]"
                          strokeWidth={3}
                        />
                      </div>
                      <p className="text-[#545454] text-sm font-['Poppins'] leading-relaxed">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  className="w-full py-3 bg-white rounded-2xl shadow-lg border border-[#6F6F6F] text-black text-sm hover:bg-gray-50 transition-colors mb-3 font-['Poppins'] flex items-center justify-center"
                >
                  {plan.buttonText}
                </button>

                {/* Cancel Info */}
                <p className="text-[#4F4E4E] text-xs text-center font-['Poppins']">
                  Cancel anytime. No strings attached.
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Hint - Only show on mobile */}
        <div className="text-center py-4 border-t border-gray-100 md:hidden">
          <p className="text-[#4F4E4E] text-xs font-['Poppins']">
            Scroll to explore plans ↓
          </p>
        </div>
      </div>
    </div>
  );
}
