"use client";

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteAccountPage() {
  const [confirmationText, setConfirmationText] = useState('');
  const router = useRouter();

  const handleDelete = () => {
    if (confirmationText === 'SkillTrade') {
      console.log('Account deletion confirmed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F6FF]">
      

      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 ml-2">Delete account</h1>
        </div>
      </header>

      <main className="p-4 space-y-6 pt-6">
        
        <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-700">This action cannot be undone</p>
              <p className="text-sm text-red-600 mt-1">
                We're sad to see you go! Deleting your account is permanent and cannot be undone.
              </p>
            </div>
          </div>
        </div>

       
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-3">
          <h2 className="text-lg font-medium">What will be deleted:</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
            <li>Your profile and personal information</li>
            <li>All skill exchange history and ratings</li>
            <li>Messages and conversations</li>
            <li>Active subscriptions (will be cancelled)</li>
            <li>Scheduled exchanges and pending requests</li>
          </ul>
        </div>

      
        <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Need a break instead? You can temporarily deactivate your account from <span className="font-medium">Privacy Settings</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-3">
          <div className="relative">
            <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-3">
              Type 'SkillTrade' to confirm
            </label>
            <div className="relative">
              <input
                type="text"
                id="confirmation"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Type here..."
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm transition-all duration-200 hover:border-blue-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </main>

      <div className="p-4">
        <div className="flex flex-col space-y-3 max-w-md mx-auto">
          <button
            onClick={handleDelete}
            disabled={confirmationText !== 'SkillTrade'}
            className={`w-full py-3 px-4 rounded-md font-medium text-white ${
              confirmationText === 'SkillTrade' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-red-300 cursor-not-allowed'
            }`}
          >
            Delete my account
          </button>
          <button
            onClick={() => router.back()}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}