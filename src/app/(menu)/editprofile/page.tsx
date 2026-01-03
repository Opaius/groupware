"use client";

import React, { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type EditProfileFormState = {
  fullName: string;
  phoneNumber: string;
  location: string;
  bio: string;
};

export default function EditProfileForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<EditProfileFormState>({
    fullName: "",
    phoneNumber: "",
    location: "",
    bio: "",
  });

  const [profileImage, setProfileImage] = useState<string>(
    "https://placehold.co/118x111",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result;
      if (typeof result === "string") {
        setProfileImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    console.log('Saving profile data:', formData);
    alert('Profile saved successfully!');
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      location: "",
      bio: "",
    });
    setProfileImage('https://placehold.co/118x111');
  };

  return (
    <div className="w-[390px] h-[844px] bg-white rounded-[40px] relative overflow-hidden mx-auto shadow-2xl">
      {/* Header Background */}
      <div className="absolute -left-5 -top-5 w-[441px] h-[274px] bg-[#BDC7DB]" />
      
      {/* Back Button */}
      <button
        className="absolute left-6 top-16 z-10"
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5 text-[#24507F]" strokeWidth={2.5} />
      </button>
      
      {/* Profile Image */}
      <div className="absolute left-[139px] top-16 z-10">
        <div 
          onClick={handleImageClick}
          className="w-[118px] h-[111px] rounded-full border-4 border-[#496995] shadow-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        >
          <img 
            src={profileImage} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <p className="text-[#545454] text-xs text-center">Tap to change photo</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="absolute top-[258px] w-full h-[586px] bg-[#F4F4FC] rounded-t-[30px]">
        <div className="px-4 pt-10">
          <h1 className="text-black text-xl font-semibold text-center mb-2">
            Edit profile
          </h1>
          <p className="text-[#6F6F6F] text-[13px] font-semibold text-center mb-6">
            Update your personal information and profile details
          </p>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-black text-[13px] mb-1 ml-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Type your name...."
                className="w-full h-[33px] bg-white rounded-[5px] border border-[#6E6E6E] shadow-md px-3 text-sm text-black placeholder-[#6F6F6F] focus:outline-none focus:ring-2 focus:ring-[#496995]"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-black text-[13px] mb-1 ml-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number..."
                className="w-full h-[33px] bg-white rounded-[5px] border border-[#6F6F6F] shadow-md px-3 text-sm text-black placeholder-[#6F6F6F] focus:outline-none focus:ring-2 focus:ring-[#496995]"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-black text-[13px] mb-1 ml-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Change your location"
                className="w-full h-[33px] bg-white rounded-[5px] border border-[#6F6F6F] shadow-md px-3 text-sm text-black placeholder-[#6F6F6F] focus:outline-none focus:ring-2 focus:ring-[#496995]"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-black text-[13px] mb-1 ml-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Type..."
                rows={3}
                className="w-full h-[56px] bg-white rounded-[5px] border border-[#6F6F6F] shadow-md px-3 py-2 text-sm text-black placeholder-[#6F6F6F] resize-none focus:outline-none focus:ring-2 focus:ring-[#496995]"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 space-y-4">
            <button
              onClick={handleSave}
              className="w-full h-[52px] bg-[#BDC7DB] rounded-md border border-[#D9D9D9] shadow-md text-[#545454] text-sm font-normal hover:bg-[#a8b4cc] transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="w-full h-[52px] bg-[#ECECEC] rounded-md border border-[#C7C5C5] shadow-md text-[#6F6F6F] text-[13px] font-normal hover:bg-[#e0e0e0] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
}