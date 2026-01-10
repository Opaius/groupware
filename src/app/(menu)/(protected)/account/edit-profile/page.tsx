"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import {
  Settings,
  Edit2,
  MapPin,
  Star,
  Zap,
  Plus,
  X,
  Save,
  Search,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Datele inițiale ale utilizatorului (fallback)
const initialUserData = {
  name: "User Test",
  role: "Web designer",
  location: "Iași , România",
  rating: "4.9",
  description:
    "I work in Figma and have an empathetic, clarity-focused approach. Open to exchanging skills related to design, research, or usability testing.",
  skills: ["Wireframing", "Figma", "User Flows", "UX Research"],
  lookingToLearn: ["Motion Design", "Web Development", "Branding"],
  progress: 75,
  level: "Level 4",
};

// --- Componente Reutilizabile (Definite în afara componentei principale pentru curățenie) ---

interface InteractiveSkillBadgeProps {
  skill: {
    id: string;
    name: string;
    type: "current" | "wanted";
    isCustom: boolean;
  };
  uiType: "skill" | "learning";
  handleRemoveSkill: (
    skillToRemove: {
      id: string;
      name: string;
      type: "current" | "wanted";
      isCustom: boolean;
    },
    uiType: "skill" | "learning",
  ) => void;
}

const InteractiveSkillBadge = ({
  skill,
  uiType,
  handleRemoveSkill,
}: InteractiveSkillBadgeProps) => {
  const isSkill = uiType === "skill";
  return (
    <Badge
      className={`rounded-xl px-3 py-1 text-white font-medium text-sm transition-colors cursor-pointer
        ${isSkill ? "bg-[#24507f] hover:bg-[#24507f]/90" : "bg-primary hover:bg-primary/90"}
        flex items-center space-x-1
      `}
    >
      <span>{skill.name}</span>
      {/* Buton Ștergere (folosind AlertDialog pentru confirmare) */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="ml-1 text-red-300 hover:text-red-500 transition-colors focus:outline-none">
            <X className="h-3 w-3" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ești sigur(ă)?</AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune va șterge permanent abilitatea/interesul{" "}
              <strong>{skill.name}</strong> din profilul tău.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                handleRemoveSkill(skill, uiType);
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Badge>
  );
};

// --- Componenta Principală Interactivă ---

export default function ProfileScreenInteractive() {
  // Fetch real user data from Convex
  const userProfileData = useQuery(api.onboarding.getUserProfileWithSkills, {});

  // Get profile image URL if available
  const mainPhotoUrlQuery = useQuery(
    api.onboarding.getImageUrl,
    userProfileData?.profile?.mainPhoto
      ? { storageId: userProfileData.profile.mainPhoto }
      : "skip",
  );

  // Get featured image (banner) URL if available
  const featuredImageUrlQuery = useQuery(
    api.onboarding.getImageUrl,
    userProfileData?.profile?.featuredImage
      ? { storageId: userProfileData.profile.featuredImage }
      : "skip",
  );

  // Loading state removed as unused

  // Extract data from query result
  const userProfile = userProfileData?.profile;
  const catalogSkills = useMemo(
    () => userProfileData?.catalogSkills || [],
    [userProfileData],
  );
  const customSkills = useMemo(
    () => userProfileData?.customSkills || [],
    [userProfileData],
  );
  const authUser = userProfileData?.authUser;

  // Combine catalog and custom skills into current and wanted skills with useMemo
  const currentSkills = useMemo(
    () => [
      ...catalogSkills
        .filter((skill) => skill.type === "current")
        .map((skill) => ({
          id: skill.id,
          name: skill.name,
          type: skill.type as "current" | "wanted",
          isCustom: false,
        })),
      ...customSkills
        .filter((skill) => skill.type === "current")
        .map((skill) => ({
          id: skill.id,
          name: skill.name,
          type: skill.type as "current" | "wanted",
          isCustom: true,
        })),
    ],
    [catalogSkills, customSkills],
  );

  const wantedSkills = useMemo(
    () => [
      ...catalogSkills
        .filter((skill) => skill.type === "wanted")
        .map((skill) => ({
          id: skill.id,
          name: skill.name,
          type: skill.type as "current" | "wanted",
          isCustom: false,
        })),
      ...customSkills
        .filter((skill) => skill.type === "wanted")
        .map((skill) => ({
          id: skill.id,
          name: skill.name,
          type: skill.type as "current" | "wanted",
          isCustom: true,
        })),
    ],
    [catalogSkills, customSkills],
  );

  // Get user bio from profile or use default
  const userBio = userProfile?.bio || initialUserData.description;
  const userName = authUser?.name || initialUserData.name;
  const userRole = initialUserData.role; // TODO: Add role field to user schema
  const userLocation = initialUserData.location; // TODO: Add location field to user schema
  const userRating = initialUserData.rating; // TODO: Add rating field to user schema

  // Starea pentru datele editabile
  const [description, setDescription] = useState(userBio);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [skills, setSkills] = useState<
    Array<{
      id: string;
      name: string;
      type: "current" | "wanted";
      isCustom: boolean;
    }>
  >(currentSkills);
  const [learning, setLearning] = useState<
    Array<{
      id: string;
      name: string;
      type: "current" | "wanted";
      isCustom: boolean;
    }>
  >(wantedSkills);

  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isAddingLearning, setIsAddingLearning] = useState(false);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [learningSearchQuery, setLearningSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<{
    _id: string;
    name: string;
    icon?: string;
    categoryId: string;
  } | null>(null);

  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [mainPhotoPreview, setMainPhotoPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const mainPhotoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Update local state when query data changes
  useEffect(() => {
    if (userProfileData !== undefined) {
      setDescription(userBio);
      setSkills(currentSkills);
      setLearning(wantedSkills);
    }
  }, [userProfileData, userBio, currentSkills, wantedSkills]);

  // Update main photo preview when query loads
  useEffect(() => {
    if (mainPhotoUrlQuery?.url) {
      setMainPhotoPreview(mainPhotoUrlQuery.url);
    }
  }, [mainPhotoUrlQuery]);

  // Update banner preview when query loads
  useEffect(() => {
    if (featuredImageUrlQuery?.url) {
      setBannerPreview(featuredImageUrlQuery.url);
    }
  }, [featuredImageUrlQuery]);

  // --- Logica de Interactivitate ---

  const saveOnboardingStep = useMutation(api.onboarding.saveOnboardingStep);
  const addSkill = useMutation(api.onboarding.addSkill);
  const removeSkillByName = useMutation(api.onboarding.removeSkillByName);

  // Image upload mutations
  const generateUploadUrl = useMutation(api.onboarding.generateUploadUrl);

  // Search results for skills
  const skillSearchResults = useQuery(
    api.skills.index.searchSkills,
    skillSearchQuery.trim() ? { query: skillSearchQuery } : "skip",
  );

  // Search results for learning
  const learningSearchResults = useQuery(
    api.skills.index.searchSkills,
    learningSearchQuery.trim() ? { query: learningSearchQuery } : "skip",
  );

  const handleDescriptionSave = async () => {
    try {
      // Save description to Convex
      await saveOnboardingStep({
        step: "profile",
        data: { bio: description },
      });
      console.log("Descriere salvată:", description);
      setIsEditingDescription(false);
    } catch (error) {
      console.error("Error saving description:", error);
      alert("Failed to save description. Please try again.");
    }
  };

  const handleAddSkill = async (type: "skill" | "learning") => {
    const skillQuery =
      type === "skill" ? skillSearchQuery : learningSearchQuery;
    if (skillQuery.trim() === "") return;

    const skillToAdd = skillQuery.trim();
    const skillType = type === "skill" ? "current" : "wanted";

    try {
      const result = await addSkill({
        name: skillToAdd,
        type: skillType,
        category: "Other",
        description: "",
        link: "",
      });

      const newSkillObj = {
        id: result.skillId as string,
        name: result.name,
        type: skillType as "current" | "wanted",
        isCustom: result.isCustom,
      };

      if (type === "skill") {
        // Prevent duplicates
        if (!skills.some((s) => s.name === skillToAdd)) {
          setSkills((prev) => [...prev, newSkillObj]);
        }
        setIsAddingSkill(false);
        setSkillSearchQuery("");
        setSelectedSkill(null);
      } else if (type === "learning") {
        // Prevent duplicates
        if (!learning.some((s) => s.name === skillToAdd)) {
          setLearning((prev) => [...prev, newSkillObj]);
        }
        setIsAddingLearning(false);
        setLearningSearchQuery("");
        setSelectedSkill(null);
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      alert("Failed to add skill. Please try again.");
    }
  };

  const handleRemoveSkill = async (
    skillToRemove: {
      id: string;
      name: string;
      type: "current" | "wanted";
      isCustom: boolean;
    },
    uiType: "skill" | "learning",
  ) => {
    try {
      await removeSkillByName({
        name: skillToRemove.name,
        type: skillToRemove.type,
      });

      if (uiType === "skill") {
        setSkills((prev) => prev.filter((s) => s.id !== skillToRemove.id));
      } else if (uiType === "learning") {
        setLearning((prev) => prev.filter((s) => s.id !== skillToRemove.id));
      }
    } catch (error) {
      console.error("Error removing skill:", error);
      alert("Failed to remove skill. Please try again.");
    }
  };

  // Image upload handling
  const handleImageUpload = async (
    file: File,
    type: "mainPhoto" | "banner",
  ) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size should be less than 5MB");
      return;
    }

    setUploadError(null);

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      if (type === "mainPhoto") {
        setMainPhotoPreview(preview);
      } else {
        setBannerPreview(preview);
      }
    };
    reader.readAsDataURL(file);

    // Upload to Convex storage
    try {
      if (type === "mainPhoto") {
        setIsUploadingMain(true);
      } else {
        setIsUploadingBanner(true);
      }

      // Get upload URL from Convex
      const result = await generateUploadUrl({ count: 1 });
      if (!result.success || !result.urls || result.urls.length === 0) {
        throw new Error("Failed to get upload URL");
      }

      const uploadUrl = result.urls[0];

      // Upload the file
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        const errorText = await response
          .text()
          .catch(() => `Status: ${response.status}`);
        throw new Error(`Upload failed: ${errorText}`);
      }

      // The response may be JSON or plain text
      const responseText = await response.text();

      if (!responseText) {
        throw new Error("Empty response from upload");
      }

      let storageId: string;

      try {
        // Try to parse as JSON first
        const jsonResponse = JSON.parse(responseText);
        // Check if it has a storageId field
        if (jsonResponse && typeof jsonResponse.storageId === "string") {
          storageId = jsonResponse.storageId.trim();
        } else {
          // If not JSON with storageId, use the text as-is
          storageId = responseText.trim();
        }
      } catch {
        // If not valid JSON, use the text as-is
        storageId = responseText.trim();
      }

      if (!storageId) {
        throw new Error("No storage ID returned from upload");
      }

      // Save to user profile immediately
      if (type === "mainPhoto") {
        await saveOnboardingStep({
          step: "profile",
          data: { mainPhoto: storageId },
        });
      } else {
        // For banner, we need to store it somewhere - using featuredImage for now
        await saveOnboardingStep({
          step: "profile",
          data: { featuredImage: storageId },
        });
      }

      console.log(`${type} uploaded successfully:`, storageId);
    } catch (error) {
      console.error("Upload error:", error);
      let errorMessage = "Upload failed";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      setUploadError(errorMessage);

      // Clear preview on error
      if (type === "mainPhoto") {
        setMainPhotoPreview(null);
      } else {
        setBannerPreview(null);
      }
    } finally {
      if (type === "mainPhoto") {
        setIsUploadingMain(false);
      } else {
        setIsUploadingBanner(false);
      }
    }
  };

  const triggerFileInput = (type: "mainPhoto" | "banner") => {
    if (type === "mainPhoto") {
      mainPhotoInputRef.current?.click();
    } else {
      bannerInputRef.current?.click();
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "mainPhoto" | "banner",
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file, type);
    }
    // Reset the input so the same file can be selected again
    event.target.value = "";
  };

  const removeImage = (type: "mainPhoto" | "banner") => {
    if (type === "mainPhoto") {
      setMainPhotoPreview(null);
      // Clear main photo in database
      saveOnboardingStep({
        step: "profile",
        data: { mainPhoto: undefined },
      }).catch(console.error);
    } else {
      setBannerPreview(null);
      // Clear banner/featured image in database
      saveOnboardingStep({
        step: "profile",
        data: { featuredImage: undefined },
      }).catch(console.error);
    }
  };

  // --- JSX de Randare ---

  return (
    <div className="flex justify-center bg-gray-50">
      <div className="w-full bg-background shadow-xl overflow-y-auto relative">
        {/* Error message */}
        {uploadError && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg max-w-md">
            {uploadError}
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          type="file"
          ref={mainPhotoInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, "mainPhoto")}
        />
        <input
          type="file"
          ref={bannerInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, "banner")}
        />

        {/* Banner */}
        <div
          className="h-64 w-full bg-cover bg-center relative"
          style={{
            backgroundImage: bannerPreview
              ? `url(${bannerPreview})`
              : featuredImageUrlQuery?.url
                ? `url(${featuredImageUrlQuery.url})`
                : `url('https://placehold.co/390x256/1d324e/ffffff?text=Banner+Image')`,
          }}
        >
          {isUploadingBanner && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
          <div
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors"
            onClick={() => triggerFileInput("banner")}
          >
            <Settings className="h-6 w-6 text-white" />
          </div>
          {(bannerPreview || featuredImageUrlQuery?.url) && (
            <div
              className="absolute top-4 left-4 p-2 rounded-full bg-white/20 backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors"
              onClick={() => removeImage("banner")}
            >
              <X className="h-6 w-6 text-white" />
            </div>
          )}
        </div>

        {/* Conținutul Profilului */}
        <div className="relative p-6 -mt-20">
          {/* Info de bază (Static) */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-40 w-40 border-4 border-background shadow-lg">
                {mainPhotoPreview || mainPhotoUrlQuery?.url ? (
                  <AvatarImage
                    src={mainPhotoPreview || mainPhotoUrlQuery?.url || ""}
                    alt={userName}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-secondary text-white font-bold text-4xl">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isUploadingMain && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
              )}
              <div
                className="absolute bottom-2 right-2 p-2 rounded-full bg-[#24507f] hover:bg-[#24507f]/90 cursor-pointer transition-colors shadow-lg"
                onClick={() => triggerFileInput("mainPhoto")}
              >
                <Edit2 className="h-4 w-4 text-white" />
              </div>
              {(mainPhotoPreview || mainPhotoUrlQuery?.url) && (
                <div
                  className="absolute top-2 right-2 p-2 rounded-full bg-red-500/80 hover:bg-red-600/90 cursor-pointer transition-colors shadow-lg"
                  onClick={() => removeImage("mainPhoto")}
                >
                  <X className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-primary mt-4">{userName}</h1>
            <p className="text-sm text-muted-foreground mt-1">{userRole}</p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-1 text-base text-primary">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{userLocation}</span>
              </div>
              <Card className="flex items-center space-x-1 p-2 bg-card rounded-full shadow-md border-none">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-base font-medium text-primary">
                  {userRating}
                </span>
              </Card>
            </div>
          </div>

          {/* 3. Descriere Card (Interactiv) */}
          <Card className="mt-8 p-4 bg-muted/40 rounded-xl border-none shadow-none">
            <div className="flex justify-between items-start mb-3">
              <p className="text-base font-semibold text-primary">
                Description:
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingDescription((prev) => !prev)}
              >
                {isEditingDescription ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Edit2 className="h-4 w-4" />
                )}
              </Button>
            </div>

            {isEditingDescription ? (
              <div className="space-y-2">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white"
                  rows={4}
                />
                <Button
                  onClick={handleDescriptionSave}
                  size="sm"
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" /> Salvează
                </Button>
              </div>
            ) : (
              <p className="text-sm text-primary/90">{description}</p>
            )}
          </Card>

          {/* 4. Skills Card (Interactiv) */}
          <Card className="mt-6 p-4 bg-muted/40 rounded-xl border-none shadow-none">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-base font-semibold text-primary">Skills:</h3>
              <Button
                size="icon"
                className="h-8 w-8 rounded-lg bg-[#24507f] hover:bg-[#24507f]/90"
                onClick={() => {
                  setIsAddingSkill(true);
                  setIsAddingLearning(false); // Închide celelalt input
                  setSkillSearchQuery("");
                  setSelectedSkill(null);
                }}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <InteractiveSkillBadge
                  key={skill.id}
                  skill={skill}
                  uiType="skill"
                  handleRemoveSkill={handleRemoveSkill}
                />
              ))}
            </div>
            {isAddingSkill && (
              <div className="mt-4">
                <div className="relative">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <Input
                      type="text"
                      placeholder="Search for skills you master..."
                      value={skillSearchQuery}
                      onChange={(e) => {
                        setSkillSearchQuery(e.target.value);
                        setSelectedSkill(null);
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-white"
                    />
                  </div>

                  {/* Search results dropdown */}
                  {skillSearchQuery.trim() && !selectedSkill && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {/* Loading state */}
                      {skillSearchResults === undefined && (
                        <div className="px-4 py-3 text-center text-gray-500">
                          Searching...
                        </div>
                      )}

                      {/* Results found */}
                      {skillSearchResults && skillSearchResults.length > 0 && (
                        <>
                          {skillSearchResults.map((skill) => (
                            <button
                              key={skill._id}
                              onClick={() => {
                                setSelectedSkill(skill);
                                setSkillSearchQuery(skill.name);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                            >
                              <span className="text-lg">
                                {skill.icon || "💡"}
                              </span>
                              <div className="flex-1">
                                <div className="font-medium text-gray-800">
                                  {skill.name}
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">
                                Select
                              </span>
                            </button>
                          ))}
                        </>
                      )}

                      {/* No results or add new option */}
                      {skillSearchResults &&
                        skillSearchResults.length === 0 && (
                          <button
                            onClick={() => {
                              setSelectedSkill({
                                _id: "new",
                                name: skillSearchQuery,
                                categoryId: "",
                              });
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-blue-600"
                          >
                            <Plus size={20} />
                            <div className="flex-1">
                              <div className="font-medium">
                                Add &quot;{skillSearchQuery}&quot; as new skill
                              </div>
                              <div className="text-sm text-gray-500">
                                This skill doesn&apos;t exist in our catalog
                              </div>
                            </div>
                          </button>
                        )}
                    </div>
                  )}
                </div>

                {/* Selected skill info and add button */}
                {(selectedSkill || skillSearchQuery.trim()) && (
                  <div className="flex space-x-2 mt-4">
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-1">
                        {selectedSkill ? "Selected skill:" : "Add new skill:"}
                      </div>
                      <div className="font-medium">
                        {selectedSkill ? selectedSkill.name : skillSearchQuery}
                      </div>
                    </div>
                    <Button
                      onClick={async () => {
                        if (skillSearchQuery.trim()) {
                          await handleAddSkill("skill");
                          setSkillSearchQuery("");
                          setSelectedSkill(null);
                        }
                      }}
                      className="bg-green-500 hover:bg-green-600 px-4"
                    >
                      Adaugă
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingSkill(false);
                        setSkillSearchQuery("");
                        setSelectedSkill(null);
                      }}
                      variant="ghost"
                      className="px-3"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* 5. Looking to learn Card (Interactiv) */}
          <Card className="mt-6 p-4 bg-muted/40 rounded-xl border-none shadow-none">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-base font-semibold text-primary">
                Looking to learn:
              </h3>
              <Button
                size="icon"
                className="h-8 w-8 rounded-lg bg-[#24507f] hover:bg-[#24507f]/90"
                onClick={() => {
                  setIsAddingLearning(true);
                  setIsAddingSkill(false); // Închide celelalt input
                  setLearningSearchQuery("");
                  setSelectedSkill(null);
                }}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {learning.map((skill) => (
                <InteractiveSkillBadge
                  key={skill.id}
                  skill={skill}
                  uiType="learning"
                  handleRemoveSkill={handleRemoveSkill}
                />
              ))}
            </div>
            {isAddingLearning && (
              <div className="mt-4">
                <div className="relative">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <Input
                      type="text"
                      placeholder="Search for skills you want to learn..."
                      value={learningSearchQuery}
                      onChange={(e) => {
                        setLearningSearchQuery(e.target.value);
                        setSelectedSkill(null);
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-white"
                    />
                  </div>

                  {/* Search results dropdown */}
                  {learningSearchQuery.trim() && !selectedSkill && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {/* Loading state */}
                      {learningSearchResults === undefined && (
                        <div className="px-4 py-3 text-center text-gray-500">
                          Searching...
                        </div>
                      )}

                      {/* Results found */}
                      {learningSearchResults &&
                        learningSearchResults.length > 0 && (
                          <>
                            {learningSearchResults.map((skill) => (
                              <button
                                key={skill._id}
                                onClick={() => {
                                  setSelectedSkill(skill);
                                  setLearningSearchQuery(skill.name);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                              >
                                <span className="text-lg">
                                  {skill.icon || "💡"}
                                </span>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-800">
                                    {skill.name}
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500">
                                  Select
                                </span>
                              </button>
                            ))}
                          </>
                        )}

                      {/* No results or add new option */}
                      {learningSearchResults &&
                        learningSearchResults.length === 0 && (
                          <button
                            onClick={() => {
                              setSelectedSkill({
                                _id: "new",
                                name: learningSearchQuery,
                                categoryId: "",
                              });
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-blue-600"
                          >
                            <Plus size={20} />
                            <div className="flex-1">
                              <div className="font-medium">
                                Add &quot;{learningSearchQuery}&quot; as new
                                skill
                              </div>
                              <div className="text-sm text-gray-500">
                                This skill doesn&apos;t exist in our catalog
                              </div>
                            </div>
                          </button>
                        )}
                    </div>
                  )}
                </div>

                {/* Selected skill info and add button */}
                {(selectedSkill || learningSearchQuery.trim()) && (
                  <div className="flex space-x-2 mt-4">
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-1">
                        {selectedSkill ? "Selected skill:" : "Add new skill:"}
                      </div>
                      <div className="font-medium">
                        {selectedSkill
                          ? selectedSkill.name
                          : learningSearchQuery}
                      </div>
                    </div>
                    <Button
                      onClick={async () => {
                        if (learningSearchQuery.trim()) {
                          await handleAddSkill("learning");
                          setLearningSearchQuery("");
                          setSelectedSkill(null);
                        }
                      }}
                      className="bg-green-500 hover:bg-green-600 px-4"
                    >
                      Adaugă
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingLearning(false);
                        setLearningSearchQuery("");
                        setSelectedSkill(null);
                      }}
                      variant="ghost"
                      className="px-3"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* 6. Progress Card (Static) */}
          <Card className="mt-6 p-6 bg-blue-100/50 rounded-xl border-none shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-primary">Progress</div>
              <Badge className="px-2 py-0.5 rounded-md font-semibold text-yellow-600 bg-transparent border-none">
                {initialUserData.level}
              </Badge>
            </div>

            <div className="flex flex-col items-center my-6">
              <div className="w-32 h-32 bg-green-200 rounded-full flex items-center justify-center">
                <Zap className="h-10 w-10 text-green-700" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative h-4 rounded-xl bg-gray-300">
                <Progress
                  value={initialUserData.progress}
                  className="h-full bg-[#40C9E7] rounded-xl *:bg-[#40C9E7]"
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border border-[#40C9E7] shadow-md"
                  style={{ left: `calc(${initialUserData.progress}% - 10px)` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-primary font-medium">
                <span>Progress</span>
                <span>{initialUserData.progress}%</span>
              </div>
            </div>
          </Card>

          {/* 7. Butoane de Navigare inferioare */}
        </div>
      </div>
    </div>
  );
}
