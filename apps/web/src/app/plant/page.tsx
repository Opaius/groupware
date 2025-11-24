'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Dot, Flower, Leaf, Sprout, TreeDeciduous } from 'lucide-react';

export default function RulesPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 3; // Updated to 3 pages

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return (
          <>
            <h2 className="text-2xl font-bold text-center mb-12">General Rules</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-green-100 rounded-full">
                  <Sprout color="#36784a" />
                </div>
                <p className="text-gray-700">
                  Progress is earned through authentic interactions and exchanges.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-green-100 rounded-full">
                  <Leaf color="#36784a" />
                </div>
                <p className="text-gray-700">
                  Inactive users may lose small progress over time.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-pink-100 rounded-full">
                  <Flower color="#cb80bd" />
                </div>
                <p className="text-gray-700">
                  Positive engagement (helpful feedback, collaboration, mentoring) accelerates growth.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-orange-100 rounded-full">
                  <TreeDeciduous color="#90511d" />
                </div>
                <p className="text-gray-700">
                  Skill exchange validation requires both users to confirm completion.
                </p>
              </div>
            </div>
          </>
        );
      case 1:
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-white rounded-full p-6 mb-6">
              <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center">
                <span className="text-6xl">🌱</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Level 1</h2>
            <p className="text-gray-600 text-center">Your seed is growing!</p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold">Seed Level 1</h3>
                <span className="text-2xl">🌰</span>
              </div>
              
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700 mb-2 font-medium">Meaning</p>
                <p className="text-gray-600">You've planted your first seed - your growth journey begins.</p>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 font-medium mb-3">How to Level Up</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Add your first 3 skills to your profile.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Complete your basic bio and profile photo.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Engage in your first skill exchange request and complete it.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reward</p>
                  <p className="font-medium">Unlock Germination</p>
                </div>
                <span className="text-2xl">🌱</span>
              </div>
            </div>

            {/* Second Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold">Germination Level 2</h3>
                <span className="text-2xl">🌱</span>
              </div>
              
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700 mb-2 font-medium">Requirements</p>
                <p className="text-gray-600">Complete 5 skill exchanges and earn positive feedback.</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reward</p>
                  <p className="font-medium">Unlock Sprout Stage</p>
                </div>
                <span className="text-2xl">🌿</span>
              </div>
            </div>

            {/* Third Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold">Sprout Level 3</h3>
                <span className="text-2xl">🌿</span>
              </div>
              
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700 mb-2 font-medium">Requirements</p>
                <p className="text-gray-600">Mentor other users and complete 10+ skill exchanges.</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reward</p>
                  <p className="font-medium">Unlock Sapling Stage</p>
                </div>
                <span className="text-2xl">🪴</span>
              </div>
            </div>

            {/* Fourth Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold">Sapling Level 4</h3>
                <span className="text-2xl">🪴</span>
              </div>
              
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700 mb-2 font-medium">Requirements</p>
                <p className="text-gray-600">Lead a group project and complete 25+ skill exchanges.</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reward</p>
                  <p className="font-medium">Unlock Tree Stage</p>
                </div>
                <span className="text-2xl">🌳</span>
              </div>
            </div>

            {/* Fifth Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold">Tree Level 5</h3>
                <span className="text-2xl">🌳</span>
              </div>
              
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700 mb-2 font-medium">Requirements</p>
                <p className="text-gray-600">Establish yourself as a community leader with 50+ successful exchanges.</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reward</p>
                  <p className="font-medium">Unlock Forest Guardian</p>
                </div>
                <span className="text-2xl">🌲🌲</span>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col">
      <main className="flex-1 p-6 flex items-center justify-center min-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="bg-blue-50 p-6 rounded-2xl w-full max-w-lg relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ 
                type: 'spring',
                stiffness: 300,
                damping: 30
              }}
              className="w-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <nav className="flex items-center justify-between p-4 border-t border-gray-100">
        <button 
          onClick={handlePrevPage} 
          disabled={currentPage === 0}
          className={`p-2 ${currentPage === 0 ? 'opacity-30' : 'opacity-100'}`}
        >
          <ChevronLeft className="w-6 h-6 text-blue-900" />
        </button>
        
        <div className="flex items-center gap-1">
          {[...Array(totalPages)].map((_, i) => (
            <Dot 
              key={i} 
              className={`w-8 h-8 ${i === currentPage ? 'text-blue-900' : 'text-gray-300'}`} 
            />
          ))}
        </div>
        
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages - 1}
          className={`p-2 ${currentPage === totalPages - 1 ? 'opacity-30' : 'opacity-100'}`}
        >
          <ChevronRight className="w-6 h-6 text-blue-900" />
        </button>
      </nav>
    </div>
  );
}