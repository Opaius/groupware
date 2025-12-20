import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center max-w-md w-full space-y-8">
        {/* 404 Number with Animation */}
        <div className="relative">
          <div className="text-9xl font-bold text-blue-900/10">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl font-bold text-blue-900">404</div>
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-gray-600 text-lg">
            Oops! The page you're looking for seems to have wandered off into
            the digital wilderness.
          </p>
        </div>

        {/* Illustration/Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 " />
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-700 mb-4">
            Don't worry, even the best explorers get lost sometimes. Here are a
            few things you can try:
          </p>
          <ul className="space-y-2 text-gray-600 text-left">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Double-check the URL for typos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Use the search bar to find what you need</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Return to the homepage and navigate from there</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/"
            className="flex-1 bg-primary hover:g-secondary text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link
            href="/chats"
            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-5 h-5" />
            Browse Chats
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-sm text-gray-500 pt-8">
          If you believe this is an error, please contact support
        </p>
      </div>
    </div>
  );
}
