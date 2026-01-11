"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  useMutation,
  usePaginatedQuery,
  useAction,
  useQuery,
} from "convex/react";
import { api } from "~/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Handshake,
  User,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  Star,
  BookOpen,
  Brain,
  Sparkles,
  Search,
  FilterX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { getInitials, getRandomColorBasedOnName } from "@/lib/utils";

type SkillTag = {
  id: string;
  name: string;
};

type DiscoverUser = {
  id: string;
  name: string;
  email: string;
  image: string;
  featuredImage: string;
  bio: string;
  skills: SkillTag[];
  lookingToLearn: SkillTag[];
};

type AIEnrichedUser = DiscoverUser & {
  matchScore?: number;
  matchReasons?: string[];
  isGoodMatch?: boolean;
  aiClassification?: {
    categories: string[];
    skillType: "current" | "wanted" | "both";
    matchedSkills: string[];
    explanation: string;
    queryIntent: string;
  };
};

export default function DiscoverPage() {
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;
  const router = useRouter();

  // Check onboarding status
  const onboardingStatus = useQuery(api.onboarding.getOnboardingStatus, {});

  // State for expanded sections per user
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [isSwiping, setIsSwiping] = useState(false);

  // AI Search state
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiQuery, setAIQuery] = useState("");
  const [isAISearching, setIsAISearching] = useState(false);
  const [aiFilter, setAiFilter] = useState<{
    classification: {
      categories: string[];
      skillType: "current" | "wanted" | "both";
      matchedSkills: string[];
      explanation: string;
      queryIntent: string;
    };
    filteredUsers: AIEnrichedUser[];
  } | null>(null);

  // Redirect if onboarding not completed
  useEffect(() => {
    if (onboardingStatus === undefined) {
      return; // Still loading
    }

    if (!onboardingStatus?.hasSeenOnboarding) {
      router.push("/onboarding-flow");
    }
  }, [onboardingStatus, router]);

  // Show loading while checking onboarding
  if (onboardingStatus === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // Don't render anything if redirecting (will redirect in useEffect)
  if (!onboardingStatus?.hasSeenOnboarding) {
    return null;
  }

  // Helper function to generate concise AI filter display text
  const getAIFilterDisplayText = (
    classification: {
      categories: string[];
      skillType: "current" | "wanted" | "both";
      matchedSkills: string[];
      explanation: string;
      queryIntent: string;
    },
    count: number,
    short: boolean = false,
  ) => {
    const hasSkills = classification.matchedSkills.length > 0;
    const hasCategories = classification.categories.length > 0;

    if (short) {
      // Short version for header - just show count and skill type
      const skillTypeText =
        classification.skillType === "current"
          ? "mentors"
          : classification.skillType === "wanted"
            ? "learners"
            : "people";
      return `${count} ${skillTypeText} match${count === 1 ? "" : "es"}`;
    }

    // Detailed version - simpler text since badges show skills
    if (hasSkills) {
      const skillTypeText =
        classification.skillType === "current"
          ? "mentors with"
          : classification.skillType === "wanted"
            ? "learners wanting"
            : "people interested in";
      return `${count} ${count === 1 ? "match" : "matches"} for ${skillTypeText}`;
    } else if (hasCategories) {
      return `${count} ${count === 1 ? "match" : "matches"} in categories`;
    } else {
      const shortened =
        classification.queryIntent.length > 40
          ? classification.queryIntent.substring(0, 40) + "..."
          : classification.queryIntent;
      return `${count} ${count === 1 ? "match" : "matches"} found: ${shortened}`;
    }
  };

  // Fetch discoverable users with pagination
  const {
    results: usersData,
    status: queryStatus,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.discover.getDiscoverableUsers,
    {},
    { initialNumItems: 10 }, // Load more initially for better UX
  );

  // AI search action
  const searchWithAI = useAction(api.discover.searchUsersWithAI);

  // Swipe mutation
  const createSwipe = useMutation(api.discover.createSwipe);

  // Toggle expanded state for a user
  const toggleExpand = useCallback((userId: string) => {
    setExpandedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  }, []);

  // Extract users from results - handle both array and paginated result
  const rawUsers: DiscoverUser[] = Array.isArray(usersData)
    ? usersData
    : (usersData as unknown as { page?: DiscoverUser[] })?.page || [];

  // Apply AI filter if active
  const users: AIEnrichedUser[] = aiFilter
    ? aiFilter.filteredUsers
    : rawUsers.map((user) => ({ ...user }));

  // Handle AI search
  const handleAISearch = async () => {
    if (!aiQuery.trim()) return;

    setIsAISearching(true);
    try {
      const results = await searchWithAI({
        query: aiQuery.trim(),
        paginationOpts: { numItems: 50, cursor: null },
      });

      // Map the AI results to match our user structure
      const filteredUsers = results.page.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        featuredImage: user.featuredImage,
        bio: user.bio,
        skills: user.skills,
        lookingToLearn: user.lookingToLearn,
        matchScore: user.matchScore,
        matchReasons: user.matchReasons,
        isGoodMatch: user.isGoodMatch,
        aiClassification: results.classification,
      }));

      const classification = results.classification;

      setAiFilter({
        classification,
        filteredUsers,
      });
      setShowAIModal(false);
    } catch (error) {
      console.error("AI search failed:", error);
      toast.error("AI search failed. Please try again.");
    } finally {
      setIsAISearching(false);
    }
  };

  // Handle swipe actions
  const handleSwipeAction = async (
    action: "reject" | "like" | "message",
    targetUser: AIEnrichedUser,
  ) => {
    if (isSwiping || !currentUser) return;

    setIsSwiping(true);
    try {
      // Record the swipe
      await createSwipe({
        targetUserId: targetUser.id,
        action,
      });

      // Show toast notification
      if (action === "reject") {
        toast.success(`You passed on ${targetUser.name}`);
      } else if (action === "like") {
        toast.success(`You liked ${targetUser.name}! They'll be notified.`);
      } else if (action === "message") {
        toast.success(
          `Message sent to ${targetUser.name}! Starting conversation...`,
        );
        // Note: Conversation is created in the mutation
      }

      // Note: We don't auto-advance anymore since cards are in a list
    } catch (error: unknown) {
      console.error("Swipe error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to process swipe";

      // Check if it's "already swiped" error
      if (errorMessage.includes("Already swiped on this user")) {
        // User already swiped (like or message), that's okay
        if (action === "reject") {
          toast.info(`You already passed on ${targetUser.name}`);
        } else if (action === "like") {
          toast.info(`You already liked ${targetUser.name}`);
        } else if (action === "message") {
          toast.info(`You already messaged ${targetUser.name}`);
        }
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSwiping(false);
    }
  };

  // Clear AI filter
  const clearAIFilter = () => {
    setAiFilter(null);
    toast.info("AI filter cleared");
  };

  // Load more users when scrolling near bottom
  const containerRef = useRef<HTMLDivElement>(null);
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (isNearBottom && !isLoading && queryStatus === "CanLoadMore") {
      loadMore(5);
    }
  }, [isLoading, queryStatus, loadMore]);

  // Simplified card component
  const UserCard = ({ user }: { user: AIEnrichedUser }) => {
    const isExpanded = expandedUsers.has(user.id);
    const hasSkills = user.skills.length > 0;
    const hasLookingToLearn = user.lookingToLearn.length > 0;
    const maxVisibleSkills = 2;

    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-4">
        {/* AI Match indicator */}
        {user.matchScore !== undefined && user.matchScore > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="size-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  AI Match Score: {user.matchScore}%
                </span>
              </div>
              {user.isGoodMatch && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Good Match
                </Badge>
              )}
            </div>
            {user.matchReasons && user.matchReasons.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {user.matchReasons.slice(0, 3).map((reason, index) => (
                  <Badge
                    key={index}
                    className="bg-purple-100 text-purple-800 border-purple-200 text-xs whitespace-nowrap"
                    title={reason}
                  >
                    {reason.length > 25
                      ? reason.substring(0, 22) + "..."
                      : reason}
                  </Badge>
                ))}
                {user.matchReasons.length > 3 && (
                  <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
                    +{user.matchReasons.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        {/* Header with user info */}
        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <Avatar className="w-16 h-16 border-2 border-gray-200">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback
                className="text-xl"
                style={{
                  backgroundColor: getRandomColorBasedOnName(user.name),
                }}
              >
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {user.name}
              </h3>
              <p className="text-sm text-gray-600 truncate">{user.email}</p>
              <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                {user.bio}
              </p>
            </div>
          </div>

          {/* Skills preview (always visible) */}
          {(hasSkills || hasLookingToLearn) && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {/* Skills preview */}
              {hasSkills && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <Star className="w-4 h-4" />
                    <span>Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {user.skills.slice(0, maxVisibleSkills).map((skill) => (
                      <Badge
                        key={skill.id}
                        className="bg-[#1d324e] text-white border-none px-2 py-0.5 text-xs"
                      >
                        {skill.name}
                      </Badge>
                    ))}
                    {user.skills.length > maxVisibleSkills && (
                      <Badge
                        variant="outline"
                        className="px-2 py-0.5 text-xs text-gray-600 border-gray-300"
                      >
                        +{user.skills.length - maxVisibleSkills} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Looking to learn preview */}
              {hasLookingToLearn && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <BookOpen className="w-4 h-4" />
                    <span>Wants to learn</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {user.lookingToLearn
                      .slice(0, maxVisibleSkills)
                      .map((skill) => (
                        <Badge
                          key={skill.id}
                          variant="outline"
                          className="border-primary text-primary px-2 py-0.5 text-xs"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    {user.lookingToLearn.length > maxVisibleSkills && (
                      <Badge
                        variant="outline"
                        className="px-2 py-0.5 text-xs text-gray-600 border-gray-300"
                      >
                        +{user.lookingToLearn.length - maxVisibleSkills} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Expandable detailed sections */}
          {(hasSkills || hasLookingToLearn) && (
            <>
              <button
                onClick={() => toggleExpand(user.id)}
                className="flex items-center justify-center gap-1 w-full mt-3 text-sm text-gray-600 hover:text-gray-900"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show all skills
                  </>
                )}
              </button>

              {isExpanded && (
                <div className="mt-4 space-y-4 pt-4 border-t border-gray-100">
                  {/* Full skills list */}
                  {hasSkills && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        All Skills ({user.skills.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill) => (
                          <Badge
                            key={skill.id}
                            className="bg-[#1d324e] hover:bg-[#2a4568] text-white border-none px-3 py-1"
                          >
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Full looking to learn list */}
                  {hasLookingToLearn && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Wants to Learn ({user.lookingToLearn.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {user.lookingToLearn.map((skill) => (
                          <Badge
                            key={skill.id}
                            variant="outline"
                            className="border-primary text-primary px-3 py-1"
                          >
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Action buttons - Round icons */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex justify-center items-center space-x-12">
            <Button
              onClick={() => handleSwipeAction("reject", user)}
              disabled={isSwiping}
              className="rounded-full size-16 hover:text-red-700 hover:bg-red-50 border-2 border-red-400 bg-white shadow-sm hover:shadow-md transition-all duration-200"
              aria-label="Pass"
              variant="outline"
            >
              <X className="size-8" />
            </Button>

            <Button
              onClick={() => router.push(`/profile/${user.id}`)}
              disabled={isSwiping}
              className="rounded-full size-16 hover:text-blue-700 hover:bg-blue-50 border-2 border-blue-400 bg-white shadow-sm hover:shadow-md transition-all duration-200"
              aria-label="View Profile"
              variant="outline"
            >
              <User className="size-8" />
            </Button>

            <Button
              onClick={() => handleSwipeAction("like", user)}
              disabled={isSwiping}
              className="rounded-full size-16 hover:text-green-700 hover:bg-green-50 border-2 border-green-400 bg-white shadow-sm hover:shadow-md transition-all duration-200"
              aria-label="Like"
              variant="outline"
            >
              <Handshake className="size-8" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (queryStatus === "LoadingFirstPage") {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No users found
          </h2>
          <p className="text-gray-600 mb-6">
            {aiFilter
              ? "No matches found for your AI search. Try a different query."
              : "You've seen all available users or there are no other users in the system yet."}
          </p>
          {aiFilter && (
            <Button onClick={clearAIFilter} className="mb-4">
              Clear AI Filter
            </Button>
          )}
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#1d324e] hover:bg-[#2a4568]"
          >
            Refresh
          </Button>
        </div>

        {/* AI Floating Button */}
        <button
          onClick={() => {
            setShowAIModal(true);
            setAIQuery("");
            setIsAISearching(false);
          }}
          className="fixed bottom-24 right-6 z-50 size-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center text-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          aria-label="AI Search"
        >
          <Brain className="size-8" />
          <div className="absolute -top-1 -right-1 size-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <Sparkles className="size-3 text-black" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* AI Search Modal */}
      <Dialog open={showAIModal} onOpenChange={setShowAIModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="size-5" />
              AI Skill Search
            </DialogTitle>
            <DialogDescription>
              Describe what you&apos;re looking for in natural language
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 size-4 text-gray-400" />
              <Input
                placeholder="e.g., 'React mentor for web development' or 'beginner wanting to learn guitar'"
                value={aiQuery}
                onChange={(e) => setAIQuery(e.target.value)}
                className="pl-10"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAISearch();
                  }
                }}
              />
            </div>

            <div className="text-sm text-gray-600">
              <p className="mb-2">Examples:</p>
              <ul className="space-y-1 text-xs">
                <li>
                  • &quot;JavaScript mentor for frontend development&quot;
                </li>
                <li>• &quot;Beginner wanting to learn photography&quot;</li>
                <li>• &quot;UI/UX designer to collaborate with&quot;</li>
                <li>• &quot;Business mentor for startup advice&quot;</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAIModal(false);
                  setAIQuery("");
                  setIsAISearching(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAISearch}
                disabled={!aiQuery.trim() || isAISearching}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isAISearching ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    AI Searching...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 size-4" />
                    Find Matches
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="shrink-0 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Discover</h1>
            <p className="text-sm text-gray-600">
              {aiFilter
                ? getAIFilterDisplayText(
                    aiFilter.classification,
                    users.length,
                    true,
                  )
                : "Connect with other users based on skills"}
            </p>
            {aiFilter && (
              <div className="mt-1 text-xs text-purple-600">
                {aiFilter.classification.explanation.length > 80
                  ? aiFilter.classification.explanation.substring(0, 80) + "..."
                  : aiFilter.classification.explanation}
              </div>
            )}
          </div>
          {aiFilter && (
            <Button
              onClick={clearAIFilter}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <FilterX className="size-4" />
              Clear AI Filter
            </Button>
          )}
        </div>
      </div>

      {/* User cards */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4"
      >
        {aiFilter && (
          <div className="mb-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Brain className="size-5 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-purple-900">
                    AI Filter Active
                  </h3>
                  <p className="text-sm text-purple-700">
                    {getAIFilterDisplayText(
                      aiFilter.classification,
                      users.length,
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 max-w-[200px] justify-end">
                {aiFilter.classification.matchedSkills.length > 0
                  ? aiFilter.classification.matchedSkills
                      .slice(0, 3)
                      .map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-purple-100 text-purple-800 border-purple-200 text-xs whitespace-nowrap"
                          title={skill}
                        >
                          {skill.length > 15
                            ? skill.substring(0, 14) + "…"
                            : skill}
                        </Badge>
                      ))
                  : aiFilter.classification.categories
                      .slice(0, 3)
                      .map((category, index) => (
                        <Badge
                          key={index}
                          className="bg-blue-100 text-blue-800 border-blue-200 text-xs whitespace-nowrap"
                          title={category}
                        >
                          {category.length > 15
                            ? category.substring(0, 14) + "…"
                            : category}
                        </Badge>
                      ))}
                {(aiFilter.classification.matchedSkills.length > 3 ||
                  aiFilter.classification.categories.length > 3) && (
                  <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
                    +
                    {Math.max(
                      aiFilter.classification.matchedSkills.length - 3,
                      aiFilter.classification.categories.length - 3,
                    )}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}

        {/* Loading indicator */}
        {isLoading && !aiFilter && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* End of users message */}
        {queryStatus === "Exhausted" && users.length > 0 && !aiFilter && (
          <div className="text-center py-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                That&apos;s all for now!
              </h3>
              <p className="text-gray-600">
                You&apos;ve seen all available users. Check back later for new
                connections.
              </p>
            </div>
          </div>
        )}

        {/* AI filtered results end message */}
        {aiFilter && users.length > 0 && (
          <div className="text-center py-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl shadow-sm p-6 border border-purple-200">
              <Brain className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                AI Filter Complete
              </h3>
              <p className="text-purple-700 mb-4">
                {getAIFilterDisplayText(aiFilter.classification, users.length)}
              </p>
              <Button
                onClick={clearAIFilter}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                Show All Users
              </Button>
            </div>
          </div>
        )}

        {/* Load more hint */}
        {queryStatus === "CanLoadMore" && !isLoading && !aiFilter && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">
              Scroll down to load more users
            </p>
          </div>
        )}
      </div>

      {/* AI Floating Button */}
      <button
        onClick={() => {
          setShowAIModal(true);
          setAIQuery("");
          setIsAISearching(false);
        }}
        className="fixed bottom-24 right-6 z-50 size-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center text-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        aria-label="AI Search"
      >
        <Brain className="size-8" />
        <div className="absolute -top-1 -right-1 size-6 bg-yellow-400 rounded-full flex items-center justify-center">
          <Sparkles className="size-3 text-black" />
        </div>
      </button>
    </div>
  );
}
