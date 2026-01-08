"use client";
import { useState, useMemo } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Search } from "lucide-react";
import Link from "next/link";
import { BackButton } from "@/components/back-button";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqItems = useMemo(
    () => [
      {
        question: "What is SkillTrade and how does it work?",
        answer:
          "SkillTrade connects people who want to learn or teach different skills through verified profiles and smart matching.",
      },
      {
        question: "How do I start sharing my skills?",
        answer:
          "Create a profile, upload your certifications and list the skills you want to teach.",
      },
      {
        question: "How does the matching system work?",
        answer:
          "An AI-based system matches learners with teachers based on skill interests and availability.",
      },
      {
        question: "Is SkillTrade free to use?",
        answer:
          "Yes, SkillTrade is free for basic use. Optional premium plans offer extra features and benefits.",
      },
      {
        question: "How does the plant growth feature work?",
        answer:
          "It visualizes your learning progress. Your plant grows as you complete more sessions.",
      },
      {
        question: "Can I use SkillTrade to build my portfolio?",
        answer:
          "Yes, your verified skills, ratings and completed sessions from your public portofolio.",
      },
    ],
    [],
  );

  const filteredFaqItems = useMemo(() => {
    if (!searchQuery) return faqItems;
    const query = searchQuery.toLowerCase();
    return faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query),
    );
  }, [faqItems, searchQuery]);

  const faqCategories = useMemo(() => {
    return [
      {
        title: "Getting started",
        items: filteredFaqItems,
      },
      {
        title: "Safety & Trust",
        items: [
          {
            question: "What should I do if I feel unsafe?",
            answer:
              'Report the user immediately through the in-app "Report" option and block them.',
          },
          {
            question: "Is it safe to meet up?",
            answer:
              "Yes, but always meet in public places and communicate firstly through the app.",
          },
          {
            question: "What if I a trade goes wrong?",
            answer:
              "Leave a review and report the issue. Our team will review and take action if needed.",
          },
        ].filter(
          (item) =>
            searchQuery === "" ||
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      },
      {
        title: "Exchanges & Sessions",
        items: [
          {
            question: "How long should each session be?",
            answer:
              "Sessions should last between 30 and 90 minutes, depending on your agreement.",
          },
          {
            question: "What if I need to cancel a session?",
            answer:
              "You can cancel directly in the chat calendar and the other person will be notified.",
          },
          {
            question: "How do ratings work?",
            answer:
              "After each session, both users rate each other from 1 to 5 stars and can leave a short review.",
          },
        ].filter(
          (item) =>
            searchQuery === "" ||
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      },
      {
        title: "Account & Subscription",
        items: [
          {
            question: "How do I upgrade my subscription?",
            answer:
              "Go to Settings - Subscription and choose the plan that fits your needs.",
          },
          {
            question: "How do I delete my account?",
            answer:
              "You can delete it anytime under Settings - DANGER ZONE - Delete Account.",
          },
        ].filter(
          (item) =>
            searchQuery === "" ||
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      },
    ].filter((category) => category.items.length > 0);
  }, [filteredFaqItems, searchQuery]);

  return (
    <div className="min-h-svh bg-[#F0F6FF]">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center">
          <BackButton />
          <h1 className="text-lg font-semibold text-gray-900 ml-2">
            Help Center
          </h1>
        </div>
      </header>

      <div className="p-4">
        {/*search bar*/}
        <div className="relative mb-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm transition-all duration-200 hover:border-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {faqCategories.map((category, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm overflow-hidden mb-5"
          >
            <div className="bg-[#D0E0FF] pl-8 pr-3 py-2 md:pl-8 md:py-3">
              <h2 className="text-base font-semibold text-gray-800">
                {category.title}
              </h2>
            </div>
            <div className="p-3 md:p-4">
              <Accordion items={category.items} />
            </div>
            <div className="bg-[#D0E0FF] h-8 w-full"></div>
          </div>
        ))}

        {faqCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              No results found for "{searchQuery}"
            </div>
            <div className="text-gray-400 mt-2">
              Try different search terms or check back later.
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow-sm p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Still need help?
          </h2>
          <div className="text-gray-600 mb-4 text-sm">
            Our support team is here to help you with any questions or issues
            24/7.
          </div>
          <Link
            href="/contact-support"
            className="bg-blue-950 hover:bg-blue-900 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Contact Support Team
          </Link>
        </div>
      </div>
    </div>
  );
}
