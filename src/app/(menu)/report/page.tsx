"use client"
import React, { useState } from 'react';

// --- ICONIȚE (Extrase din codul HTML oferit) ---

const BackIcon = () => (
  <svg width="38" height="32" viewBox="0 0 38 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M27 7.78788L24.4216 6L10 16L24.4216 26L27 24.2121L15.1568 16L27 7.78788Z" fill="#24507F"/>
  </svg>
);

const BugIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_bug)">
      <path d="M12 22.5C16.5765 22.5 19.8815 19.4615 19.98 14.8865C19.9933 14.3032 20 13.6743 20 13C20 11.9885 19.993 11.697 19.98 11.1135C19.882 6.5385 16.577 3.5 12 3.5C7.424 3.5 4.1185 6.5385 4.02 11.1135C4.00656 11.7422 3.99989 12.3711 4 13C4 13.6747 4.00667 14.3035 4.02 14.8865C4.118 19.4615 7.4235 22.5 12 22.5Z" fill="#8FBFFA"/>
      <path d="M12 22.5C16.5765 22.5 19.8815 19.4615 19.98 14.8865C19.9933 14.3032 20 13.6743 20 13C20 11.9885 19.993 11.697 19.98 11.1135C19.882 6.5385 16.577 3.5 12 3.5C7.424 3.5 4.1185 6.5385 4.02 11.1135C4.00656 11.7422 3.99989 12.3711 4 13C4 13.6747 4.00667 14.3035 4.02 14.8865C4.118 19.4615 7.4235 22.5 12 22.5Z" stroke="#2859C5" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8 1.5L9 3.5M16 1.5L15 3.5M12 10.5V22.5" stroke="#2859C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.7475 9C17.5505 9.808 14.9175 10.25 12 10.25C9.08245 10.25 6.44895 9.808 4.25195 9" stroke="#2859C5" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M20 10.5L22.5 9.5M20 16.5L22.5 17.5M20 13.5H22.75M4 10.5L1.5 9.5M4 16.5L1.5 17.5M4 13.5H1.25" stroke="#2859C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_bug">
        <rect width="24" height="24" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const FeatureIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_feature)">
      <g filter="url(#filter0_d_feature)">
        <path d="M12.1991 1.4242e-06C10.1751 -0.00485274 6.49088 1.94315 6.37409 3.675C6.2573 5.40686 6.61002 5.51359 6.77409 5.60834H8.67409C9.10823 4.62804 9.637 4.05498 11.0241 4.06667C12.4112 4.07836 13.9327 5.81346 13.2908 7.35C12.6488 8.88654 12.0556 9.42173 11.2658 11.0833C10.4759 12.7449 10.212 15.2548 11.2491 17.3417L13.5908 17.3833C13.0112 14.4044 16.0791 11.7504 17.2991 9.91667C18.5191 8.08294 18.635 7.38402 18.6491 5.86667C18.6383 4.42679 18.1169 2.9879 16.9824 1.81667C15.8479 0.645439 14.2231 0.00487642 12.1991 1.4242e-06ZM12.3157 19.325C10.7496 19.325 9.4824 20.5922 9.4824 22.1583C9.4824 23.7245 10.7496 25 12.3157 25C13.8819 25 15.1491 23.7245 15.1491 22.1583C15.1491 20.5922 13.8819 19.325 12.3157 19.325Z" fill="#8FBFFA"/>
        <path d="M12.3157 19.8252C13.6056 19.8252 14.6486 20.8683 14.6487 22.1582C14.6487 23.4501 13.6037 24.5 12.3157 24.5C11.0276 24.5 9.98267 23.4501 9.98267 22.1582C9.98274 20.8683 11.0258 19.8252 12.3157 19.8252ZM12.1975 0.499992C14.1135 0.504607 15.5999 1.10851 16.6233 2.16503C17.6636 3.23913 18.1388 4.55235 18.1487 5.87011C18.1416 6.61611 18.1085 7.10758 17.9485 7.62597C17.7864 8.15084 17.4838 8.73672 16.8831 9.63964C16.5947 10.073 16.1928 10.5601 15.7356 11.1221C15.2859 11.6747 14.7927 12.2883 14.3547 12.9424C13.5911 14.083 12.9461 15.4194 13.0247 16.873L11.5735 16.8467C10.7668 14.9777 11.0139 12.777 11.717 11.2978C12.0989 10.4945 12.4317 9.96682 12.76 9.43163C13.0914 8.89143 13.4162 8.34713 13.7522 7.54296C14.1605 6.56561 13.8651 5.56029 13.3176 4.83495C12.7767 4.1184 11.9161 3.57398 11.0286 3.5664C10.2654 3.55997 9.66887 3.7148 9.19556 4.06249C8.82135 4.33741 8.56547 4.70533 8.35962 5.10839H6.95044C6.94713 5.10086 6.94156 5.09236 6.93774 5.08202C6.88153 4.92928 6.81612 4.55708 6.87329 3.70898C6.89143 3.44 7.05756 3.09748 7.41626 2.70898C7.76741 2.32869 8.25935 1.95096 8.82544 1.6162C9.97153 0.938493 11.3089 0.497987 12.1975 0.499992Z" stroke="#2859C5"/>
      </g>
    </g>
    <defs>
      <filter id="filter0_d_feature" x="2.35083" y="-7.62939e-06" width="20.2983" height="33" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="2"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1086_1093"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1086_1093" result="shape"/>
      </filter>
      <clipPath id="clip0_feature">
        <rect width="25" height="25" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const SafetyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_safety)">
      <mask id="mask0_safety" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
        <path d="M0 0H20V20H0V0Z" fill="white"/>
      </mask>
      <g mask="url(#mask0_safety)">
        <path d="M9.73789 0.25C12.7999 0.25 16.4884 0.979 17.3199 1.655C17.6534 1.94891 17.9415 2.29062 18.1749 2.669C19.2554 4.4825 19.2749 8.9225 19.2749 10.579C19.2749 16.897 10.9349 19.706 10.1769 19.706C9.64139 19.706 5.32289 18.3045 2.83289 15.2545C1.56789 13.9015 0.639893 12.1845 0.639893 10.077C0.639893 8.2255 0.664393 2.923 2.15639 1.6545C2.98739 0.979 6.67639 0.25 9.73789 0.25Z" fill="#00034A" stroke="#00034A" strokeWidth="0.5" strokeMiterlimit="10"/>
        <path d="M17.3199 1.655C16.4884 0.9785 12.7999 0.25 9.73789 0.25C6.67589 0.25 2.98739 0.979 2.15639 1.655C0.664393 2.9225 0.639893 8.225 0.639893 10.0765C0.639893 16.3945 8.97989 19.204 9.73789 19.204C10.4959 19.204 18.8359 16.3945 18.8359 10.0765C18.8359 8.2295 18.8119 2.9225 17.3199 1.654V1.655Z" fill="#8FBFFA" stroke="#00034A" strokeWidth="0.5" strokeMiterlimit="10"/>
        <path d="M14.112 6.4755C13.441 6.33562 12.7562 6.27371 12.071 6.291C12.0905 5.60722 12.0284 4.92356 11.886 4.2545C11.7015 3.443 10.467 3.341 9.74798 3.341C9.02848 3.341 7.80398 3.443 7.60448 4.2545C7.46478 4.92397 7.4027 5.60731 7.41948 6.291C6.73596 6.27426 6.05279 6.33633 5.38348 6.476C4.57198 6.6605 4.46948 7.9 4.46948 8.619C4.46948 9.3385 4.57198 10.563 5.38348 10.7575C6.05248 10.8995 6.73598 10.9615 7.41998 10.9425C7.40248 11.6275 7.46498 12.3125 7.60448 12.9835C7.78948 13.795 9.02848 13.897 9.74798 13.897C10.467 13.897 11.692 13.795 11.886 12.9835C12.0285 12.313 12.091 11.6275 12.071 10.942C12.756 10.962 13.441 10.9 14.112 10.7575C14.9235 10.5725 15.026 9.3385 15.026 8.619C15.026 7.9 14.943 6.6605 14.112 6.4755Z" fill="white" stroke="#00034A" strokeWidth="0.5" strokeMiterlimit="10"/>
      </g>
    </g>
    <defs>
      <clipPath id="clip0_safety">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const OtherIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.4998 4.15625C13.6457 4.15625 14.7273 4.80444 15.4675 6.03809L21.6238 16.2988L21.6248 16.3018C22.051 17.0027 22.249 17.7136 22.24 18.3789V18.3857C22.2399 18.882 22.1163 19.3485 21.8679 19.7832C21.3071 20.7645 20.2009 21.375 18.7498 21.375H6.24976C4.79888 21.3749 3.69333 20.7644 3.13257 19.7832C2.88681 19.3531 2.7605 18.8562 2.7605 18.3438C2.7605 17.696 2.95914 16.9926 3.37671 16.2998V16.2988L9.53296 6.02832L9.53198 6.02734C10.2721 4.80434 11.3538 4.15637 12.4998 4.15625ZM12.4998 8.30176C11.3279 8.30193 10.3855 9.24512 10.3855 10.417C10.3856 11.1869 10.8059 11.8626 11.4265 12.2324C10.8803 12.304 10.4279 12.5024 10.0896 12.708C9.75215 12.9131 9.51242 13.1331 9.39038 13.2617L9.33472 13.3242C9.33133 13.328 9.32824 13.3321 9.32495 13.3359C9.31829 13.344 9.31255 13.3508 9.30835 13.3564L9.30933 13.3574C9.08131 13.643 9.10776 14.0177 9.28882 14.2764L9.29761 14.2891L9.30737 14.3018C9.54565 14.5996 9.941 14.6617 10.2449 14.5098L10.2527 14.5059L10.2605 14.501C10.2894 14.4853 10.3823 14.4422 10.4968 14.4033C10.5362 14.3899 10.5732 14.3807 10.6062 14.3721C10.5944 14.4283 10.5779 14.5004 10.5476 14.5898L10.5466 14.5908L10.1199 15.8604C9.83551 16.7016 9.87088 17.5395 10.3015 18.1924V18.1914C10.6627 18.7404 11.2573 19.0334 11.9187 19.0723L11.9333 19.0732H12.1042C12.8846 19.0732 13.5076 18.8017 13.9343 18.5312C14.3054 18.296 14.5462 18.0481 14.6335 17.9453L14.6345 17.9463C14.6368 17.9437 14.6381 17.9402 14.6404 17.9375C14.6482 17.9281 14.6561 17.9214 14.6609 17.915L14.658 17.9131C14.8615 17.6553 14.9064 17.2408 14.6248 16.959L14.6228 16.96C14.4073 16.7257 14.0644 16.6284 13.7419 16.7861L13.741 16.7842C13.6924 16.8063 13.5908 16.8509 13.4763 16.8887C13.4346 16.9024 13.3955 16.9111 13.3611 16.9199C13.3729 16.8637 13.3913 16.7919 13.4216 16.7021V16.7012L13.8494 15.4297V15.4287C14.1301 14.5863 14.1123 13.7432 13.6628 13.083C13.4876 12.8191 13.2579 12.6155 12.9929 12.4707C13.9262 12.2475 14.6148 11.4083 14.615 10.417C14.615 9.25543 13.6613 8.30176 12.4998 8.30176Z" fill="#8FBFFA" stroke="#2859C5"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_upload)">
      <path d="M10.7501 11.1667V6.75207L9.23341 8.16041L8.41675 7.37499L11.3334 4.66666L14.2501 7.37499L13.4334 8.16041L11.9167 6.75207V11.1667H10.7501ZM7.83341 13.3333C7.51258 13.3333 7.23803 13.2273 7.00975 13.0154C6.78147 12.8034 6.66714 12.5483 6.66675 12.25V10.625H7.83341V12.25H14.8334V10.625H16.0001V12.25C16.0001 12.5479 15.8859 12.803 15.6577 13.0154C15.4294 13.2277 15.1546 13.3337 14.8334 13.3333H7.83341Z" fill="#2859C5"/>
    </g>
    <defs>
      <clipPath id="clip0_upload">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

// --- COMPONENTA PRINCIPALĂ ---

type CategoryType = 'Bug Report' | 'Feature Request' | 'Safety Issue' | 'Other';

export default function ReportProblemPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [description, setDescription] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Container Principal "Phone Frame" */}
      <div className="w-96 h-[844px] bg-white rounded-[40px] relative overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center mt-[53px] px-[21px] mb-[50px]">
          <div className="cursor-pointer">
            <BackIcon />
          </div>
          <div className="text-cyan-800 text-base font-semibold font-['Poppins'] leading-5 flex-1 text-center -ml-8">
            Report a Problem
          </div>
        </div>

        {/* Content Scrollable */}
        <div className="px-[21px] flex flex-col gap-4">
          
          {/* Section: Category */}
          <div className="w-80 h-60 bg-slate-200 rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] relative mx-auto shrink-0">
            <div className="absolute left-[10px] top-[14px] text-cyan-800 text-xs font-normal font-['Poppins'] leading-5">
              Category
            </div>
            
            {/* Grid Butoane */}
            <div className="absolute top-[45px] w-full px-[10px] grid grid-cols-2 gap-x-[15px] gap-y-[11px]">
              
              {/* Bug Report */}
              <button 
                onClick={() => setSelectedCategory('Bug Report')}
                className={`w-36 h-20 bg-white rounded-sm outline-1 outline-offset-[-0.50px] outline-neutral-400 flex flex-col items-center justify-center relative transition-colors ${selectedCategory === 'Bug Report' ? 'bg-blue-50 ring-2 ring-blue-300' : ''}`}
              >
                <div className="mb-1"><BugIcon /></div>
                <div className="text-black text-xs font-semibold font-['Inter'] leading-5">Bug Report</div>
              </button>

              {/* Feature Request */}
              <button 
                onClick={() => setSelectedCategory('Feature Request')}
                className={`w-36 h-20 bg-white rounded-sm outline-1 outline-offset-[-0.50px] outline-neutral-400 flex flex-col items-center justify-center relative transition-colors ${selectedCategory === 'Feature Request' ? 'bg-blue-50 ring-2 ring-blue-300' : ''}`}
              >
                <div className="mb-1"><FeatureIcon /></div>
                <div className="text-black text-base font-semibold font-['Inter'] leading-5 text-[14px]">Feature Request</div>
              </button>

              {/* Safety Issue */}
              <button 
                onClick={() => setSelectedCategory('Safety Issue')}
                className={`w-36 h-20 bg-white rounded-sm outline-1 outline-offset-[-0.60px] outline-neutral-400 flex flex-col items-center justify-center relative transition-colors ${selectedCategory === 'Safety Issue' ? 'bg-blue-50 ring-2 ring-blue-300' : ''}`}
              >
                <div className="mb-1"><SafetyIcon /></div>
                <div className="text-black text-base font-semibold font-['Inter'] leading-5 text-[14px]">Safety Issue</div>
              </button>

              {/* Other */}
              <button 
                onClick={() => setSelectedCategory('Other')}
                className={`w-36 h-20 bg-white rounded-sm outline-1 outline-offset-[-0.50px] outline-neutral-400 flex flex-col items-center justify-center relative transition-colors ${selectedCategory === 'Other' ? 'bg-blue-50 ring-2 ring-blue-300' : ''}`}
              >
                <div className="mb-1"><OtherIcon /></div>
                <div className="text-black text-base font-semibold font-['Inter'] leading-5 text-[14px]">Other</div>
              </button>

            </div>
          </div>

          {/* Section: Subject */}
          <div className="w-80 h-20 bg-slate-200 rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] relative mx-auto shrink-0 p-4">
             <div className="text-cyan-800 text-xs font-normal font-['Poppins'] leading-5 mb-1 ml-1">Subject</div>
             <input 
               type="text" 
               placeholder="Brief summary of the issue"
               className="w-full h-6 bg-white rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-[0.50px] border-neutral-500 px-2 text-2xs font-normal font-['Poppins'] leading-5 placeholder-neutral-500 focus:outline-none focus:border-blue-500"
             />
          </div>

          {/* Section: Description */}
          <div className="w-80 h-28 bg-slate-200 rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] relative mx-auto shrink-0 p-4">
            <div className="text-cyan-800 text-xs font-normal font-['Poppins'] leading-5 mb-1 ml-1">Description</div>
            <textarea 
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               placeholder="Please provide detailed information about the problem..."
               className="w-full h-14 bg-white rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-[0.50px] border-neutral-500 p-2 text-2xs font-normal font-['Poppins'] leading-5 placeholder-neutral-500 resize-none focus:outline-none focus:border-blue-500"
             />
             <div className="text-right text-neutral-500 text-[8px] font-normal font-['Poppins'] leading-5 mt-1 mr-1">
               {description.length} characters
             </div>
          </div>

          {/* Section: Attachments */}
          <div className="w-80 h-24 bg-slate-200 rounded-[20px] relative mx-auto shrink-0 p-4">
            <div className="text-cyan-800 text-xs font-normal font-['Poppins'] leading-5 mb-1 ml-2">Attachments</div>
            <div className="w-full h-9 bg-white rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-[0.50px] border-neutral-500 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50">
               <UploadIcon />
               <span className="text-neutral-500 text-2xs font-normal font-['Poppins'] leading-5">Drop files to attach</span>
            </div>
          </div>

          {/* Submit Button */}
          <button className="w-64 p-2.5 bg-blue-200 rounded-sm shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex justify-center items-center gap-2.5 mx-auto mt-4 hover:bg-blue-300 transition-colors">
            <div className="text-center justify-start text-neutral-600 text-xs font-bold font-['Inter'] leading-5">Submit Report</div>
          </button>

        </div>
      </div>
    </div>
  );
}

