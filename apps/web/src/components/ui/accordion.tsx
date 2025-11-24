'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: FAQItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {items.map((item, index) => (
        <div key={index} className="mb-2 border-b border-gray-200">
          <button
            className="w-full flex justify-between items-start p-4 text-left hover:bg-gray-50 transition-colors group"
            onClick={() => toggleItem(index)}
            aria-expanded={openIndex === index}
            aria-controls={`faq-content-${index}`}
          >
            <span className="font-medium text-gray-900 flex-1 pr-2">{item.question}</span>
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              {openIndex === index ? (
                <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
              )}
            </div>
          </button>
          <div
            id={`faq-content-${index}`}
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className="pb-4 pt-2 pl-4 text-xs text-gray-600">{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
