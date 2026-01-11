"use client";

import { useState } from "react";
import { ChevronLeft, Mail, Instagram, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Label } from "@/components/ui/label";
import { BackButton } from "@/components/back-button";

export default function ContactSupportPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    // Handle form submission
  };

  return (
    <div className="w-full sm:max-w-[450px] md:max-w-[500px] lg:max-w-[550px]">
      {/* Header cu fundal bleu */}
      <div className="pt-6 px-6 pb-4 bg-[#DCE9FB] ">
        <div className="flex items-center gap-2">
          <BackButton />
          <span className="text-primary">Contact us</span>
        </div>
        <p className="mt-2 text-[0.9rem] text-[#6f6f6f] leading-relaxed">
          Have a question or feedback? Send us a message and our support team
          will get back to you soon.
        </p>
      </div>

      {/* Card Principal cu albastru deschis */}
      <div className="bg-[#DCE9FB]  px-6 py-6 shadow-lg">
        {/* Contact Information Card */}
        <div className="bg-[#c8e2fd] rounded-[20px] p-6 mb-6">
          <h3 className="text-[1rem] font-semibold text-[#1d324e] mb-3">
            Contact Information
          </h3>
          <p className="text-[0.85rem] text-[#545454] mb-4">
            Reach us anytime — we'll respond within 48 hours.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-[#1d324e]" />
              <span className="text-[0.9rem] text-[#6e6e6e]">
                support@skilltrade.app
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Instagram size={20} className="text-[#1d324e]" />
              <span className="text-[0.9rem] text-[#6e6e6e]">
                @joinskilltrade
              </span>
            </div>

            <Button
              variant="outline"
              className="w-full mt-2 h-[45px] bg-white border border-[#6085b9] text-[#037ee6] hover:bg-[#f0f7ff] rounded-lg"
            >
              Report a Problem
            </Button>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-[20px] p-6 mb-4">
          <p className="text-[0.85rem] text-[#545454] mb-6">
            You can fill out the form below for a faster response from our
            support team.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-[0.9rem] font-medium text-black mb-2 block">
                Full name
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Type your full name"
                className="h-[50px]"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="text-[0.9rem] font-medium text-black mb-2 block">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="h-[50px]"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="text-[0.9rem] font-medium text-black mb-2 block">
                Subject
              </label>
              <RadioGroup
                value={subject}
                onValueChange={setSubject}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="general" id="general" />
                  <Label htmlFor="general" className="text-[0.9rem] text-black">
                    General Inquiry
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="account" id="account" />
                  <Label htmlFor="account" className="text-[0.9rem] text-black">
                    Account issue
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="feature" id="feature" />
                  <Label htmlFor="feature" className="text-[0.9rem] text-black">
                    Feature request
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="text-[0.9rem] text-black">
                    Other
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Message */}
            <div>
              <label className="text-[0.9rem] font-medium text-black mb-2 block">
                Message
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here…"
                className=" w-full resize-none"
              />
            </div>

            {/* Attach Screenshot */}
            <div>
              <label className="text-[0.9rem] font-medium text-black mb-2 block">
                Attach Screenshot (optional)
              </label>
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept="image/*"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-[45px] bg-[#dee0e3] text-black border-0 rounded-lg hover:bg-[#c9cdd1]"
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                className="flex-1 h-[45px] bg-[#bce0e8] text-black border-0 rounded-lg hover:bg-[#a7d4dd]"
              >
                Send Message
              </Button>
            </div>
          </form>
        </div>

        {/* Safety Footer */}
        <div className="bg-[#fffcfc] rounded-[16px] p-4 flex items-start gap-3">
          <Phone className="text-[#496995] mt-1 flex-shrink-0" size={20} />
          <p className="text-[0.8rem] text-[#496995] leading-relaxed">
            🔒 Safety Reminder: Never share your password or personal data in
            chat. Your privacy and safety come first.
          </p>
        </div>
      </div>
    </div>
  );
}
