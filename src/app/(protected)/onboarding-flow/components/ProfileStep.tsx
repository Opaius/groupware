"use client";

import React, { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { Plus, X, Loader2 } from "lucide-react";
import { ProfileStepProps } from "./types";
import { api } from "~/convex/_generated/api";

const ProfileStep = ({ formData, updateFormData }: ProfileStepProps) => {
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingFeatured, setIsUploadingFeatured] = useState(false);
  const [mainPhotoPreview, setMainPhotoPreview] = useState<string | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<
    string | null
  >(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const mainPhotoInputRef = useRef<HTMLInputElement>(null);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.onboarding.generateUploadUrl);
  const saveOnboardingStep = useMutation(api.onboarding.saveOnboardingStep);

  // Load existing previews from formData on initial render
  const mainPhotoUrlQuery = useQuery(
    api.onboarding.getImageUrl,
    formData.mainPhotoUrl && formData.mainPhotoUrl.trim() !== ""
      ? { storageId: formData.mainPhotoUrl }
      : "skip",
  );

  const featuredImageUrlQuery = useQuery(
    api.onboarding.getImageUrl,
    formData.featuredImageUrl && formData.featuredImageUrl.trim() !== ""
      ? { storageId: formData.featuredImageUrl }
      : "skip",
  );

  React.useEffect(() => {
    // If we have a main photo URL from query, set the preview
    if (mainPhotoUrlQuery?.url) {
      setMainPhotoPreview(mainPhotoUrlQuery.url);
    }
  }, [mainPhotoUrlQuery]);

  React.useEffect(() => {
    // If we have a featured image URL from query, set the preview
    if (featuredImageUrlQuery?.url) {
      setFeaturedImagePreview(featuredImageUrlQuery.url);
    }
  }, [featuredImageUrlQuery]);

  const handleFileSelect = async (
    file: File,
    type: "mainPhoto" | "featuredImage",
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
        setFeaturedImagePreview(preview);
      }
    };
    reader.readAsDataURL(file);

    // Upload to Convex storage
    try {
      if (type === "mainPhoto") {
        setIsUploadingMain(true);
      } else {
        setIsUploadingFeatured(true);
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

      // Update form data with the storage ID
      if (type === "mainPhoto") {
        updateFormData({
          ...formData,
          mainPhotoUrl: storageId,
        });

        // Save to user profile immediately
        await saveOnboardingStep({
          step: "profile",
          data: { mainPhoto: storageId },
        });
      } else {
        updateFormData({
          ...formData,
          featuredImageUrl: storageId,
        });

        // Save to user profile immediately
        await saveOnboardingStep({
          step: "profile",
          data: { featuredImage: storageId },
        });
      }
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
        setFeaturedImagePreview(null);
      }
    } finally {
      if (type === "mainPhoto") {
        setIsUploadingMain(false);
      } else {
        setIsUploadingFeatured(false);
      }
    }
  };

  const triggerFileInput = (type: "mainPhoto" | "featuredImage") => {
    if (type === "mainPhoto") {
      mainPhotoInputRef.current?.click();
    } else {
      featuredImageInputRef.current?.click();
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "mainPhoto" | "featuredImage",
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file, type);
    }
    // Reset the input so the same file can be selected again
    event.target.value = "";
  };

  const removeImage = (type: "mainPhoto" | "featuredImage") => {
    if (type === "mainPhoto") {
      setMainPhotoPreview(null);
      updateFormData({
        ...formData,
        mainPhotoUrl: undefined,
      });
    } else {
      setFeaturedImagePreview(null);
      updateFormData({
        ...formData,
        featuredImageUrl: undefined,
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        padding: "0 25px",
      }}
    >
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={mainPhotoInputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFileChange(e, "mainPhoto")}
      />
      <input
        type="file"
        ref={featuredImageInputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFileChange(e, "featuredImage")}
      />

      {/* Error message */}
      {uploadError && (
        <div
          style={{
            padding: "10px 15px",
            background: "rgba(255, 0, 0, 0.1)",
            border: "1px solid rgba(255, 0, 0, 0.3)",
            borderRadius: 8,
            color: "#d32f2f",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {uploadError}
        </div>
      )}

      {/* MAIN PHOTO SECTION */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            color: "#1D324E",
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 8,
            marginTop: 0,
          }}
        >
          Add a Main Photo
        </h3>
        <p
          style={{
            color: "#496995",
            fontSize: 12,
            fontWeight: 400,
            textAlign: "center",
            marginBottom: 15,
            maxWidth: 300,
          }}
        >
          This image will appear at the top of your profile — make it stand out!
        </p>

        <div
          style={{
            position: "relative",
            width: 100,
            height: 100,
            background: mainPhotoPreview
              ? "transparent"
              : "rgba(147, 198, 231, 0.96)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isUploadingMain ? "wait" : "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            border: !formData.mainPhotoUrl ? "2px solid #d32f2f" : "none",
            overflow: "hidden",
          }}
          onClick={() => !isUploadingMain && triggerFileInput("mainPhoto")}
        >
          {isUploadingMain ? (
            <Loader2
              size={36}
              color="#1D324E"
              strokeWidth={2}
              className="animate-spin"
            />
          ) : formData.mainPhotoUrl && mainPhotoUrlQuery === undefined ? (
            // Loading existing image from storage
            <Loader2
              size={36}
              color="#1D324E"
              strokeWidth={2}
              className="animate-spin"
            />
          ) : mainPhotoPreview ? (
            <>
              <img
                src={mainPhotoPreview}
                alt="Main photo preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  background: "rgba(0,0,0,0.7)",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage("mainPhoto");
                }}
              >
                <X size={14} color="white" />
              </div>
            </>
          ) : (
            <Plus size={36} color="#1D324E" strokeWidth={2} />
          )}
        </div>

        {!formData.mainPhotoUrl && (
          <div
            style={{
              marginTop: "10px",
              padding: "10px 15px",
              background: "rgba(255, 0, 0, 0.1)",
              border: "1px solid rgba(255, 0, 0, 0.3)",
              borderRadius: 8,
              color: "#d32f2f",
              fontSize: 14,
              textAlign: "center",
              width: "100%",
              maxWidth: 348,
            }}
          >
            ⚠️ Please add a main profile photo to continue
          </div>
        )}
      </div>

      {/* FEATURED IMAGE SECTION */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            color: "#1D324E",
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 8,
            marginTop: 0,
          }}
        >
          Upload a Featured Image
        </h3>
        <p
          style={{
            color: "#496995",
            fontSize: 12,
            fontWeight: 400,
            textAlign: "center",
            marginBottom: 15,
            maxWidth: 300,
          }}
        >
          Choose a photo that represents your skills, work, or personality.
        </p>

        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 348,
            height: 89,
            background: featuredImagePreview
              ? "transparent"
              : "rgba(147, 198, 231, 0.35)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isUploadingFeatured ? "wait" : "pointer",
            border: featuredImagePreview
              ? "none"
              : "1px dashed rgba(29, 50, 78, 0.2)",
            overflow: "hidden",
          }}
          onClick={() =>
            !isUploadingFeatured && triggerFileInput("featuredImage")
          }
        >
          {isUploadingFeatured ? (
            <Loader2
              size={36}
              color="#1D324E"
              strokeWidth={2}
              className="animate-spin"
            />
          ) : formData.featuredImageUrl &&
            featuredImageUrlQuery === undefined ? (
            // Loading existing image from storage
            <Loader2
              size={36}
              color="#1D324E"
              strokeWidth={2}
              className="animate-spin"
            />
          ) : featuredImagePreview ? (
            <>
              <img
                src={featuredImagePreview}
                alt="Featured image preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  background: "rgba(0,0,0,0.7)",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage("featuredImage");
                }}
              >
                <X size={14} color="white" />
              </div>
            </>
          ) : (
            <Plus size={36} color="#1D324E" strokeWidth={2} />
          )}
        </div>
      </div>

      {/* BIO SECTION */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            color: "#1D324E",
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 8,
            marginTop: 0,
          }}
        >
          Add a Short Bio
        </h3>
        <p
          style={{
            color: "#496995",
            fontSize: 12,
            fontWeight: 400,
            textAlign: "center",
            marginBottom: 15,
            lineHeight: "1.5",
          }}
        >
          Tell us a bit about yourself — your background, passions, and what
          drives you. Write a short description of your key strengths,
          expertise, and experience.
        </p>

        <div
          style={{
            width: "100%",
            maxWidth: 348,
            height: 127,
            background: "rgba(139, 154, 183, 0.20)",
            borderRadius: 10,
            padding: "24px",
            boxSizing: "border-box",
            border:
              !formData.bio || formData.bio.trim() === ""
                ? "2px solid #d32f2f"
                : "none",
          }}
        >
          <textarea
            placeholder="Your words..."
            value={formData.bio || ""}
            onChange={(e) =>
              updateFormData({ ...formData, bio: e.target.value })
            }
            style={{
              width: "100%",
              height: "100%",
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              color: "#1D324E",
              fontSize: 14,
              fontFamily: "'Roboto', sans-serif",
            }}
          />
        </div>

        {(!formData.bio || formData.bio.trim() === "") && (
          <div
            style={{
              marginTop: "10px",
              padding: "10px 15px",
              background: "rgba(255, 0, 0, 0.1)",
              border: "1px solid rgba(255, 0, 0, 0.3)",
              borderRadius: 8,
              color: "#d32f2f",
              fontSize: 14,
              textAlign: "center",
              width: "100%",
              maxWidth: 348,
            }}
          >
            ⚠️ Please write a bio about yourself to continue
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileStep;
