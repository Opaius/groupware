"use client";

import React, { useState, useRef } from 'react';
import { ArrowLeft, Check, Award } from 'lucide-react';

type PlanTier = 'premium' | 'standard';

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
  const [currentPlan] = useState<PlanTier>('standard');
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const plans: Plan[] = [
    {
      id: 'premium',
      name: 'Premium Plan',
      badge: 'Most popular',
      badgeColor: 'bg-[#B7CEEE]',
      price: 20,
      originalPrice: 25,
      period: 'per month',
      description: 'Tap into our ready-to-trade community of top professionals with our seamless skill-matching solution.',
      features: [
        'Unlimited Exchanges – no limit on collaborations',
        'Digital certificate of acquired skills – For CV/LinkedIn',
        'Paid mentoring',
        'Priority access to new opportunities – get notifications before others',
        'AI Mentor Suggestion – the app recommends suitable mentors to you',
        'Skill Tracker AI – receive monthly feedback on what you\'ve learned',
        'Team collaboration mode – perfect for group projects.'
      ],
      bgColor: 'bg-[#E9F2FF]',
      buttonText: 'Upgrade now'
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      badge: 'Current plan',
      badgeColor: 'bg-[#EAEAEA]',
      price: 0,
      period: 'per month',
      description: 'Start trading and connecting with our community. All the essential tools you need to get started.',
      features: [
        '15 skill exchanges/month',
        'Access to basic profiles- See who is offering or looking for skills',
        'Skill Match Basic- get simple suggestions of suitable people'
      ],
      bgColor: 'bg-[#F6F8FB]',
      buttonText: 'Upgrade to Premium',
      isCurrent: true
    }
  ];

  const handleUpgrade = (planId: PlanTier) => {
    if (planId === 'premium') {
      alert('Upgrading to Premium Plan!');
    } else {
      alert('Upgrading to Premium!');
    }
  };

  return (
    <div className="w-[390px] h-[1007px] bg-white rounded-[40px] overflow-hidden mx-auto shadow-2xl relative">
      {/* Header */}
      <div className="absolute left-[21px] top-[49px] flex items-center gap-2.5">
        <button className="w-[21px] h-[22px] bg-[#24507F] flex items-center justify-center rounded hover:bg-cyan-900 transition-colors">
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="absolute left-[28px] top-[59px] w-[172px] text-center">
        <h1 className="text-[#24507F] text-[17px] font-semibold font-['Poppins'] leading-5">
          Subscription
        </h1>
      </div>

      {/* Current Plan Summary Card */}
      <div className="absolute left-[25px] top-[138px] w-[340px] h-[121px] bg-[#F4F4FC] rounded-[20px] shadow-lg border-[0.5px] border-[#037EE6] p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <Award className="w-5 h-5 text-[#427687] mt-1" />
            <div>
              <p className="text-[#515050] text-xs font-bold font-['PT_Sans_Caption'] leading-5">
                Current  Plan
              </p>
              <h3 className="text-black text-base font-['PT_Sans_Caption'] leading-5">
                Standard
              </h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[#323232] text-[19px] font-['Poppins'] leading-5">
              $0
            </p>
            <p className="text-[#515050] text-[9px] font-['PT_Sans_Caption'] leading-5">
              per month
            </p>
          </div>
        </div>
        <button
          onClick={() => handleUpgrade('premium')}
          className="absolute left-[214px] top-[77px] w-[111px] h-[33px] px-2.5 py-2.5 bg-white rounded-[20px] shadow-lg border border-[#24507F] flex items-center justify-center hover:bg-cyan-50 transition-colors"
        >
          <span className="text-center text-[#24507F] text-[12px] font-bold font-['Poppins'] leading-5">
            Upgrade plan
          </span>
        </button>
      </div>

      {/* Title Section */}
      <div className="text-center absolute left-[74px] top-[295px] w-[233px]">
        <h2 className="text-black text-[27px] font-normal leading-5 mb-2" style={{ fontFamily: 'Hina Mincho, serif' }}>
          Choose your plan!
        </h2>
      </div>
      <div className="text-center absolute left-[42px] top-[327px] w-[310px]">
        <p className="text-black text-xs font-['PT_Sans_Caption'] leading-5">
          Select the perfect plan for your needs
        </p>
      </div>

      {/* Plans Carousel Container */}
      <div className="absolute left-0 top-[360px] w-[375px] h-[622px] overflow-hidden">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-visible h-full"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <style>
            {`
              .overflow-x-auto::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          <div className="flex gap-4 h-full" style={{ width: 'max-content' }}>
            {/* Premium Plan */}
            <div className="relative ml-[30px] mt-[43px]">
              <div
                className={`w-[310px] h-[526px] ${plans[0].bgColor} rounded-[20px] shadow-lg border-[1.5px] border-[#24507F] p-6 relative opacity-[0.86]`}
              >
                {/* Badge */}
                <div className={`absolute top-[-24px] left-[79px] w-[111px] h-[35px] ${plans[0].badgeColor} rounded-[20px] border-[1.5px] border-[#24507F] flex items-center justify-center`}>
                  <p className="text-[#24507F] text-10px font-bold font-['PT_Sans_Caption'] leading-5">
                    {plans[0].badge}
                  </p>
                </div>

                {/* Plan Name */}
                <h3 className="text-black text-[17px] font-normal font-['Poppins'] leading-5 mb-2">
                  {plans[0].name}
                </h3>

                {/* Description */}
                <p className="text-[#545454] text-[11px] font-['Poppins'] leading-5 mb-4">
                  {plans[0].description}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#6F6F6F] text-[25px] line-through font-['Poppins'] leading-5">
                    ${plans[0].originalPrice}
                  </span>
                  <span className="text-[#323232] text-[25px] font-['Poppins'] leading-5">
                    ${plans[0].price}
                  </span>
                </div>
                <p className="text-[#6E6E6E] text-[9px] font-['Poppins'] leading-5 mb-6">
                  {plans[0].period}
                </p>

                {/* Features */}
                <div className="space-y-1 mb-6">
                  {plans[0].features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="mt-0.5 shrink-0">
                        <Check className="w-3 h-3 text-[#24507F]" strokeWidth={3} />
                      </div>
                      <p className="text-[#545454] text-[11px] font-['Poppins']" style={{ lineHeight: index > 3 ? '17px' : '16px' }}>
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  onClick={() => handleUpgrade(plans[0].id)}
                  className="w-[224px] px-2.5 py-2.5 bg-white rounded-[20px] shadow-lg border-[0.5px] border-[#6F6F6F] text-black text-[11px] hover:bg-gray-50 transition-colors mb-2 font-['Poppins'] leading-5 flex items-center justify-center mx-auto"
                >
                  {plans[0].buttonText}
                </button>

                {/* Cancel Info */}
                <p className="text-[#4F4E4E] text-[8px] text-center font-['Poppins'] leading-5">
                  Cancel anytime. No strings attached.
                </p>
              </div>
            </div>

            {/* Standard Plan */}
            <div className="relative mt-[74.5px]">
              <div
                className={`w-[310px] h-[435px] ${plans[1].bgColor} rounded-[20px] shadow-lg border-[1.5px] border-[#24507F] p-6 relative opacity-[0.86]`}
              >
                {/* Badge */}
                <div className={`absolute top-[-24px] left-[83px] w-[111px] h-[35px] ${plans[1].badgeColor} rounded-[20px] border-[1.5px] border-[#24507F] flex items-center justify-center`}>
                  <p className="text-[#24507F] text-10px font-bold font-['PT_Sans_Caption'] leading-5">
                    {plans[1].badge}
                  </p>
                </div>

                {/* Plan Name */}
                <h3 className="text-black text-[17px] font-normal font-['Poppins'] leading-5 mb-2 mt-4">
                  {plans[1].name}
                </h3>

                {/* Description */}
                <p className="text-[#545454] text-[11px] font-['Poppins'] leading-5 mb-4">
                  {plans[1].description}
                </p>

                {/* Price */}
                <div className="mb-1">
                  <span className="text-[#323232] text-[25px] font-['Poppins'] leading-5">
                    ${plans[1].price}
                  </span>
                </div>
                <p className="text-[#6E6E6E] text-[9px] font-['Poppins'] leading-5 mb-6">
                  {plans[1].period}
                </p>

                {/* Features */}
                <div className="space-y-1 mb-6">
                  {plans[1].features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="mt-0.5 shrink-0">
                        <Check className="w-3 h-3 text-[#24507F]" strokeWidth={3} />
                      </div>
                      <p className="text-[#323232] text-[11px] font-['Poppins']" style={{ lineHeight: index === 0 ? '20px' : '16px' }}>
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  onClick={() => handleUpgrade(plans[1].id)}
                  className="w-[224px] px-2.5 py-2.5 bg-white rounded-[20px] shadow-lg border-[0.5px] border-[#6F6F6F] text-black text-[11px] hover:bg-gray-50 transition-colors mb-2 font-['Poppins'] leading-5 flex items-center justify-center mx-auto"
                >
                  {plans[1].buttonText}
                </button>

                {/* Cancel Info */}
                <p className="text-[#4F4E4E] text-[8px] text-center font-['Poppins'] leading-5">
                  Cancel anytime. No strings attached.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="absolute left-[139px] top-[937px] w-[117px]">
        <p className="text-[#4F4E4E] text-10px font-['Poppins'] leading-5">
          Slide to explore plans&gt;
        </p>
      </div>
    </div>
  );
}