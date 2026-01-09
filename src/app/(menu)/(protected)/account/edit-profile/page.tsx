"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import {
  Settings,
  Edit2,
  ChevronRight,
  MapPin,
  Star,
  Zap,
  Plus,
  X,
  Save,
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
  skill: string;
  type: "skill" | "learning";
  handleRemoveSkill: (
    skillToRemove: string,
    type: "skill" | "learning",
  ) => void;
}

const InteractiveSkillBadge = ({
  skill,
  type,
  handleRemoveSkill,
}: InteractiveSkillBadgeProps) => {
  const isSkill = type === "skill";
  return (
    <Badge
      className={`rounded-xl px-3 py-1 text-white font-medium text-sm transition-colors cursor-pointer
        ${isSkill ? "bg-[#24507f] hover:bg-[#24507f]/90" : "bg-primary hover:bg-primary/90"}
        flex items-center space-x-1
      `}
    >
      <span>{skill}</span>
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
              <strong>{skill}</strong> din profilul tău.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                handleRemoveSkill(skill, type);
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

interface ProfileActionButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  onClick: () => void;
}

const ProfileActionButton = ({
  icon: Icon,
  text,
  onClick,
}: ProfileActionButtonProps) => (
  <Button
    variant="ghost"
    className="w-full justify-start h-12 rounded-xl px-4 bg-muted/50 hover:bg-muted/70 text-primary transition-colors"
    onClick={onClick}
  >
    <div className="flex items-center space-x-4">
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-base font-medium">{text}</span>
    </div>
    <ChevronRight className="h-5 w-5 ml-auto text-primary" />
  </Button>
);

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
        .map((skill) => skill.name),
      ...customSkills
        .filter((skill) => skill.type === "current")
        .map((skill) => skill.name),
    ],
    [catalogSkills, customSkills],
  );

  const wantedSkills = useMemo(
    () => [
      ...catalogSkills
        .filter((skill) => skill.type === "wanted")
        .map((skill) => skill.name),
      ...customSkills
        .filter((skill) => skill.type === "wanted")
        .map((skill) => skill.name),
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
  const [skills, setSkills] = useState(currentSkills);
  const [learning, setLearning] = useState(wantedSkills);
  const [newSkill, setNewSkill] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isAddingLearning, setIsAddingLearning] = useState(false);

  // Update local state when query data changes
  useEffect(() => {
    if (userProfileData !== undefined) {
      setDescription(userBio);
      setSkills(currentSkills);
      setLearning(wantedSkills);
    }
  }, [userProfileData, userBio, currentSkills, wantedSkills]);

  // --- Logica de Interactivitate ---

  const saveOnboardingStep = useMutation(api.onboarding.saveOnboardingStep);

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

  const handleAddSkill = (type: "skill" | "learning") => {
    if (newSkill.trim() === "") return;

    const skillToAdd = newSkill.trim();

    if (type === "skill") {
      // Previne duplicatele
      if (!skills.includes(skillToAdd)) {
        setSkills((prev) => [...prev, skillToAdd]);
      }
      setIsAddingSkill(false);
    } else if (type === "learning") {
      // Previne duplicatele
      if (!learning.includes(skillToAdd)) {
        setLearning((prev) => [...prev, skillToAdd]);
      }
      setIsAddingLearning(false);
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (
    skillToRemove: string,
    type: "skill" | "learning",
  ) => {
    if (type === "skill") {
      setSkills((prev) => prev.filter((s) => s !== skillToRemove));
    } else if (type === "learning") {
      setLearning((prev) => prev.filter((s) => s !== skillToRemove));
    }
  };

  const handleAction = (action: string) => console.log(`${action} clicked`);

  // --- JSX de Randare ---

  return (
    <div className="flex justify-center bg-gray-50">
      <div className="w-full bg-background shadow-xl overflow-y-auto relative">
        {/* Banner */}
        <div
          className="h-64 w-full bg-cover bg-center relative"
          style={{
            backgroundImage: `url('https://placehold.co/390x256/1d324e/ffffff?text=Banner+Image')`,
          }}
        >
          <div className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm cursor-pointer">
            <Settings className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Conținutul Profilului */}
        <div className="relative p-6 -mt-20">
          {/* Info de bază (Static) */}
          <div className="flex flex-col items-center">
            <Avatar className="h-40 w-40 border-4 border-background shadow-lg">
              {mainPhotoUrlQuery?.url && (
                <AvatarImage
                  src={mainPhotoUrlQuery.url}
                  alt={userName}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="bg-secondary text-white font-bold text-4xl">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
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
                  setNewSkill("");
                }}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <InteractiveSkillBadge
                  key={skill}
                  skill={skill}
                  type="skill"
                  handleRemoveSkill={handleRemoveSkill}
                />
              ))}
            </div>
            {isAddingSkill && (
              <div className="flex space-x-2 mt-4">
                <Input
                  placeholder="Nume skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="bg-white"
                />
                <Button
                  onClick={() => handleAddSkill("skill")}
                  className="bg-green-500 hover:bg-green-600 px-4"
                >
                  Adaugă
                </Button>
                <Button
                  onClick={() => setIsAddingSkill(false)}
                  variant="ghost"
                  className="px-3"
                >
                  <X className="h-5 w-5" />
                </Button>
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
                  setNewSkill("");
                }}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {learning.map((skill) => (
                <InteractiveSkillBadge
                  key={skill}
                  skill={skill}
                  type="learning"
                  handleRemoveSkill={handleRemoveSkill}
                />
              ))}
            </div>
            {isAddingLearning && (
              <div className="flex space-x-2 mt-4">
                <Input
                  placeholder="Interes nou..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="bg-white"
                />
                <Button
                  onClick={() => handleAddSkill("learning")}
                  className="bg-green-500 hover:bg-green-600 px-4"
                >
                  Adaugă
                </Button>
                <Button
                  onClick={() => setIsAddingLearning(false)}
                  variant="ghost"
                  className="px-3"
                >
                  <X className="h-5 w-5" />
                </Button>
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
