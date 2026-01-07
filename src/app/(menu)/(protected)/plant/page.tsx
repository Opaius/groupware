"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Dot,
  Flower,
  Leaf,
  Sprout,
  Sparkles,
  TreeDeciduous,
  Droplet,
} from "lucide-react";

const SeedIcon = ({ className = "w-20 h-20" }) => (
  <img
    src="/Seed.svg"
    alt="Seed"
    className={className}
    style={{ objectFit: "contain" }}
  />
);

const GerminationIcon = ({ className = "w-20 h-20" }) => (
  <img
    src="/Sprout.svg"
    alt="Germination"
    className={className}
    style={{ objectFit: "contain" }}
  />
);

const SproutIcon = ({ className = "w-20 h-20" }) => (
  <img
    src="/Sprout (1).svg"
    alt="Sprout"
    className={className}
    style={{ objectFit: "contain" }}
  />
);

const SaplingIcon = ({ className = "w-20 h-20" }) => (
  <img
    src="/Tree.svg"
    alt="Sapling"
    className={className}
    style={{ objectFit: "contain" }}
  />
);

const FruitingTreeIcon = ({ className = "w-20 h-20" }) => (
  <img
    src="/Tree (1).svg"
    alt="Fruiting Tree"
    className={className}
    style={{ objectFit: "contain" }}
  />
);

export default function RulesPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [growthStage, setGrowthStage] = useState(0);
  const totalPages = 3;
  const growthStages = [
    {
      emoji: <SeedIcon />,
      name: "Seed",
      description: "You've planted the first seed. Growth begins here.",
      level: 1,
      progress: 20,
    },
    {
      emoji: <GerminationIcon />,
      name: "Germination",
      description: "From seed to sprout, your journey unfolds.",
      level: 2,
      progress: 40,
    },
    {
      emoji: <SproutIcon />,
      name: "Sprout",
      description: "Every small step adds up to big growth.",
      level: 3,
      progress: 60,
    },
    {
      emoji: <SaplingIcon />,
      name: "Sapling",
      description: "Rooted in purpose, growing with confidence.",
      level: 4,
      progress: 80,
    },
    {
      emoji: <FruitingTreeIcon />,
      name: "Fruiting",
      description:
        "Your growth is paying off! Share your success with the world.",
      level: 5,
      progress: 100,
    },
  ];

  const handlePlantTap = () => {
    setGrowthStage((prev) => (prev + 1) % growthStages.length);
  };

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
            <h2 className="text-2xl font-bold text-center mb-12">
              General Rules
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-green-100 rounded-full">
                  <Sprout color="#36784a" />
                </div>
                <p className="text-gray-700">
                  Progress is earned through authentic interactions and
                  exchanges.
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
                  Positive engagement (helpful feedback, collaboration,
                  mentoring) accelerates growth.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-orange-100 rounded-full">
                  <TreeDeciduous color="#90511d" />
                </div>
                <p className="text-gray-700">
                  Skill exchange validation requires both users to confirm
                  completion.
                </p>
              </div>
            </div>
          </>
        );
      case 1:
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="flex items-center justify-center text-yellow-500 mb-4">
              <Sparkles className="w-4 h-4 mr-1.5" />
              <span className="font-bold">
                Level {growthStages[growthStage].level}
              </span>
            </div>

            {/* Plant Illustration */}
            <motion.div
              className="bg-blue-50 p-6 cursor-pointer mx-auto rounded-lg mb-4"
              onClick={handlePlantTap}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={growthStage}
                    className="text-6xl"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      rotate: [0, 5, -5, 0],
                    }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{
                      scale: { type: "spring", stiffness: 500, damping: 15 },
                      opacity: { duration: 0.3 },
                      rotate: { duration: 0.4 },
                    }}
                  >
                    {typeof growthStages[growthStage].emoji === "string" ? (
                      <span>{growthStages[growthStage].emoji}</span>
                    ) : (
                      growthStages[growthStage].emoji
                    )}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.h2
              key={`title-${growthStage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-center mb-1"
            >
              {growthStages[growthStage].name}
            </motion.h2>
            <motion.p
              key={`desc-${growthStage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-center mb-6"
            >
              {growthStages[growthStage].description}
            </motion.p>

            {/* Progress Bar Container */}
            <div className="w-80 mx-auto bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center">
              <div className="w-full">
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-200 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${growthStages[growthStage].progress}%`,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <div className="absolute -right-2 -top-0.5">
                      <Sprout
                        className="w-4 h-4 text-green-500"
                        fill="#11c939ff"
                      />
                    </div>
                  </motion.div>
                </div>
                <motion.span
                  className="text-xs text-gray-500 mt-1.5 block text-center"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                >
                  Your progress: {growthStages[growthStage].progress}%
                </motion.span>
              </div>
            </div>
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
                <p className="text-gray-600">
                  You&apos;ve planted your first seed - your growth journey
                  begins.
                </p>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 font-medium mb-3">
                  How to Level Up
                </p>
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
                    <span>
                      Engage in your first skill exchange request and complete
                      it.
                    </span>
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
                <p className="text-gray-700 mb-2 font-medium">Meaning</p>
                <p className="text-gray-600">
                  From seed to sprout - your journey unfolds.
                </p>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 font-medium mb-3">
                  How to Level Up
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>
                      Exchange: receive and offer at least one skill trade to
                      another user.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>
                      Write a short reflection or feedback on your experience.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Receive at least one endorsement or rating.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reward</p>
                  <p className="font-medium">
                    Unlock Seedling and profile growth insights.
                  </p>
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
                <p className="text-gray-700 mb-2 font-medium">Meaning</p>
                <p className="text-gray-600">
                  Every small step adds up to big growth.
                </p>
              </div>
              <div className="mb-6">
                <p className="text-gray-700 font-medium mb-3">
                  How to Level Up
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Share newly learned skills on your profile.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Collaborate with 3 or more users.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Give 3 helpful reviews to others.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reward</p>
                  <p className="font-medium">
                    Unlock Sapling and 15% more visibility.
                  </p>
                </div>
                <span className="text-2xl">🌳</span>
              </div>
            </div>

            {/* Fourth Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold">Sapling Level 4</h3>
                <span className="text-2xl">🌳</span>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700 mb-2 font-medium">Meaning</p>
                <p className="text-gray-600">
                  Rooted in purpose, growing with confidence.
                </p>
              </div>
              <div className="mb-6">
                <p className="text-gray-700 font-medium mb-3">
                  How to Level Up
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Host a skill exchange session or workshop.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Earn 5 positive feedbacks from peers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>
                      Maintain a consistent activity streak for 7 days.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reward</p>
                  <p className="font-medium">
                    Unlock Fruiting and featured placement in search results.
                  </p>
                </div>
                <span className="text-2xl">🌸</span>
              </div>
            </div>

            {/* Fifth Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl font-bold">Fruiting Level 5</h3>
                <span className="text-2xl">🌸</span>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700 mb-2 font-medium">Meaning</p>
                <p className="text-gray-600">
                  Your growth is paying off - share your success with the world!
                </p>
              </div>
              <div className="mb-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Continue sharing and teaching your skills.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Help new members grow by mentoring.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Maintain 100% profile completion.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reward</p>
                  <p className="font-medium">Unlock Fruiting Tree Badge.</p>
                </div>
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
                type: "spring",
                stiffness: 300,
                damping: 30,
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
          className={`p-2 ${currentPage === 0 ? "opacity-30" : "opacity-100"}`}
        >
          <ChevronLeft className="w-6 h-6 text-blue-900" />
        </button>

        <div className="flex items-center gap-1">
          {[...Array(totalPages)].map((_, i) => (
            <Dot
              key={i}
              className={`w-8 h-8 ${i === currentPage ? "text-blue-900" : "text-gray-300"}`}
            />
          ))}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className={`p-2 ${currentPage === totalPages - 1 ? "opacity-30" : "opacity-100"}`}
        >
          <ChevronRight className="w-6 h-6 text-blue-900" />
        </button>
      </nav>
    </div>
  );
}
