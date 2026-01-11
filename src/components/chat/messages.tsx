"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials, getRandomColorBasedOnName } from "@/lib/utils";
import { useMutation } from "convex/react";
import {
  LucideCheck,
  LucideCheckCheck,
  LucideClock,
  LucideDownload,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const useSeenMessage = (
  messageId: string,
  conversationId: string,
  userId: string,
) => {
  const ref = useRef(null);
  const markSeen = useMutation(api.chat.messages.markSeen);

  useEffect(() => {
    if (!ref.current) return;

    // Skip temporary message IDs (optimistic messages)
    if (messageId.startsWith("temp-")) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          markSeen({
            messageId: messageId as Id<"messages">,
            conversationId: conversationId as Id<"conversations">,
            userId,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }, // 50% visible = seen
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [messageId, conversationId, userId, markSeen]);

  return ref;
};

export type MessageProp = {
  message: string;
  seen: boolean;
  currentUserHasSeen?: boolean;
  allOthersSeen?: boolean;
  seenByOtherUserNames?: string[];
  timeSent: Date | number;
  senderId: string;
  avatarUrl?: string;
  senderName?: string;
  isOwnMessage?: boolean;
  /** * If true, the message is currently sending (optimistic).
   * Displays a clock icon.
   */
  sent?: boolean;
  attachments?: Array<{
    filename: string;
    mimeType: string;
    size: number;
    url?: string;
  }>;
  appointment?: {
    _id: Id<"appointments">;
    title: string;
    description?: string;
    scheduledFor: number;
    durationMinutes: number;
    status: "pending" | "accepted" | "declined" | "cancelled" | "completed";
    createdBy: string;
  };
};

export function ChatMessage({
  message,
  messageId,
  seen,
  currentUserHasSeen,
  allOthersSeen,
  seenByOtherUserNames,
  timeSent,
  senderId,
  avatarUrl,
  senderName,
  isOwnMessage = false,
  sent = false,
  conversationId,
  currentUserId,
  attachments,
  appointment,
}: MessageProp & {
  conversationId: string;
  currentUserId: string;
  messageId: string;
}) {
  const router = useRouter();
  const timestamp = useMemo(() => {
    return timeSent instanceof Date
      ? timeSent
      : new Date(timeSent ?? Date.now());
  }, [timeSent]);

  const timeString = useMemo(() => {
    return timestamp.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }, [timestamp]);

  const ref = useSeenMessage(messageId, conversationId, currentUserId);
  const StatusIcon = useMemo(() => {
    if (sent) return <LucideClock className="size-3 opacity-70" />;

    if (isOwnMessage) {
      if (allOthersSeen)
        return <LucideCheckCheck className="size-3 text-blue-400" />;
      if (seen || currentUserHasSeen)
        return <LucideCheckCheck className="size-3 text-primary/60" />;
      return <LucideCheck className="size-3 text-muted-foreground" />;
    }
    return null;
  }, [sent, allOthersSeen, seen, currentUserHasSeen, isOwnMessage]);

  const avatarColor = getRandomColorBasedOnName(senderName ?? "");
  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full gap-2 ",
        isOwnMessage ? "justify-end" : "justify-start",
      )}
    >
      {/* Left Avatar (for others) */}
      {!isOwnMessage && (
        <Avatar
          className="size-8 shrink-0 mt-auto cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push(`/profile/${senderId}`)}
        >
          <AvatarImage className="object-cover" src={avatarUrl ?? ""} />
          <AvatarFallback
            className="text-2xs"
            style={{ backgroundColor: avatarColor }}
          >
            {senderName
              ? getInitials(senderName)
              : senderId.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Bubble */}
      <div
        className={cn(
          "relative px-3 py-2 text-sm max-w-[75%] shadow-sm wrap-break-word",
          "rounded-2xl",
          isOwnMessage
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-muted text-foreground rounded-bl-none",
        )}
      >
        <p className="leading-relaxed whitespace-pre-wrap pb-1">{message}</p>

        {/* Attachments */}
        {attachments && attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-background/50 rounded-lg border"
              >
                {attachment.mimeType.startsWith("image/") && attachment.url ? (
                  <img
                    src={attachment.url}
                    alt={attachment.filename}
                    className="max-w-32 max-h-32 rounded object-cover"
                  />
                ) : (
                  <div className="flex items-center gap-2 w-full">
                    <div className="p-2 bg-muted rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {attachment.filename}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(attachment.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    {attachment.url && (
                      <a
                        href={attachment.url}
                        download={attachment.filename}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Download"
                      >
                        <LucideDownload className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Appointment */}
        {appointment && (
          <div className="mt-3 p-4 bg-card border rounded-xl shadow-sm text-foreground">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="shrink-0 p-1.5 bg-primary/10 rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-base truncate flex-1 min-w-0 text-foreground">
                        {appointment.title}
                      </h4>
                    </div>
                    {appointment.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {appointment.description}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 ml-2">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold capitalize truncate max-w-25 ${
                        appointment.status === "accepted"
                          ? "bg-green-500/10 text-green-700 border border-green-200"
                          : appointment.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-700 border border-yellow-200"
                            : appointment.status === "declined"
                              ? "bg-red-500/10 text-red-700 border border-red-200"
                              : appointment.status === "cancelled"
                                ? "bg-gray-500/10 text-gray-700 border border-gray-200"
                                : "bg-blue-500/10 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">
                      {new Date(appointment.scheduledFor).toLocaleDateString(
                        undefined,
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">
                      {new Date(appointment.scheduledFor).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">
                      {appointment.durationMinutes} minutes
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {appointment.status === "pending" && (
              <div className="flex gap-3 mt-4 pt-4 border-t">
                {!isOwnMessage ? (
                  <>
                    <AppointmentAcceptButton
                      appointmentId={appointment._id}
                      disabled={appointment.status !== "pending"}
                    />
                    <AppointmentDeclineButton
                      appointmentId={appointment._id}
                      disabled={appointment.status !== "pending"}
                    />
                  </>
                ) : (
                  <AppointmentCancelButton
                    appointmentId={appointment._id}
                    disabled={appointment.status !== "pending"}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Meta Footer */}
        <div
          className={cn(
            "flex items-center gap-1 text-2xs select-none opacity-80",
            isOwnMessage ? "justify-end" : "justify-start",
          )}
        >
          <span>{timeString}</span>

          {seenByOtherUserNames && seenByOtherUserNames.length > 0 && (
            <span className="max-w-20 truncate">
              • {seenByOtherUserNames.join(", ")}
            </span>
          )}

          {StatusIcon}
        </div>
      </div>

      {/* Right Avatar (for self) */}
      {isOwnMessage && (
        <Avatar
          className="size-8 shrink-0 mt-auto cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push(`/profile/${senderId}`)}
        >
          <AvatarImage className="object-cover" src={avatarUrl ?? ""} />
          <AvatarFallback
            className="text-2xs"
            style={{ backgroundColor: avatarColor }}
          >
            {senderName ? getInitials(senderName) : "ME"}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

function AppointmentAcceptButton({
  appointmentId,
  disabled = false,
}: {
  appointmentId: Id<"appointments">;
  disabled?: boolean;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateAppointmentStatus = useMutation(
    api.chat.messages.updateAppointmentStatus,
  );

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      await updateAppointmentStatus({
        appointmentId,
        status: "accepted",
      });
      toast.success("Appointment accepted!");
    } catch (error) {
      console.error("Failed to accept appointment:", error);
      toast.error("Failed to accept appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      size="sm"
      className="bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all hover:shadow"
      onClick={handleAccept}
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? (
        <>
          <svg
            className="size-4 mr-2 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Accepting...
        </>
      ) : (
        <>
          <svg
            className="size-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Accept
        </>
      )}
    </Button>
  );
}

function AppointmentDeclineButton({
  appointmentId,
  disabled = false,
}: {
  appointmentId: Id<"appointments">;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noReasonDialogOpen, setNoReasonDialogOpen] = useState(false);
  const updateAppointmentStatus = useMutation(
    api.chat.messages.updateAppointmentStatus,
  );

  const performDecline = async (declineReason?: string) => {
    setIsSubmitting(true);
    try {
      await updateAppointmentStatus({
        appointmentId,
        status: "declined",
        declinedReason: declineReason?.trim() || undefined,
      });
      toast.success("Appointment declined.");
      setOpen(false);
      setReason("");
    } catch (error) {
      console.error("Failed to decline appointment:", error);
      toast.error("Failed to decline appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (!reason.trim()) {
      setNoReasonDialogOpen(true);
      return;
    }
    await performDecline(reason);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-sm transition-all hover:shadow"
            disabled={disabled}
          >
            <svg
              className="size-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Decline
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Decline Appointment</DialogTitle>
            <DialogDescription>
              Provide a reason for declining this appointment (optional).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="E.g., I'm not available at that time, scheduling conflict, etc."
                rows={3}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="sm:flex-none order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDecline}
              disabled={isSubmitting}
              className="sm:flex-auto order-1 sm:order-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="size-4 mr-2 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Declining...
                </>
              ) : (
                <>
                  <svg
                    className="size-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Decline Appointment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={noReasonDialogOpen}
        onOpenChange={setNoReasonDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline without reason?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to decline this appointment without
              providing a reason?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Add Reason</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setNoReasonDialogOpen(false);
                await performDecline();
              }}
            >
              Decline Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function AppointmentCancelButton({
  appointmentId,
  disabled = false,
}: {
  appointmentId: Id<"appointments">;
  disabled?: boolean;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const updateAppointmentStatus = useMutation(
    api.chat.messages.updateAppointmentStatus,
  );

  const handleCancel = async () => {
    setIsSubmitting(true);
    try {
      await updateAppointmentStatus({
        appointmentId,
        status: "cancelled",
      });
      toast.success("Appointment cancelled.");
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      toast.error("Failed to cancel appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-700 shadow-sm transition-all hover:shadow"
          disabled={disabled}
        >
          <svg
            className="size-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this appointment? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>
            Keep Appointment
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isSubmitting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="size-4 mr-2 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Cancelling...
              </>
            ) : (
              "Cancel Appointment"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
