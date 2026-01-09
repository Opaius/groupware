"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

interface CalendarButtonProps {
  conversationId: Id<"conversations">;
  disabled?: boolean;
}

export function CalendarButton({
  conversationId,
  disabled = false,
}: CalendarButtonProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [duration, setDuration] = useState("60");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const sendAppointment = useMutation(api.chat.messages.sendAppointment);

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 9).toString().padStart(2, "0"),
  ); // 09-20
  const minutes = ["00", "15", "30", "45"];
  const durations = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 hour" },
    { value: "90", label: "1.5 hours" },
    { value: "120", label: "2 hours" },
  ];

  const handleSubmit = async () => {
    if (!date || !title.trim()) {
      toast.error("Please select a date and provide a title");
      return;
    }

    if (!hour || !minute) {
      toast.error("Please select a time");
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine date and time
      const scheduledDate = new Date(date);
      scheduledDate.setHours(parseInt(hour, 10));
      scheduledDate.setMinutes(parseInt(minute, 10));
      scheduledDate.setSeconds(0);
      scheduledDate.setMilliseconds(0);

      const scheduledFor = scheduledDate.getTime();

      await sendAppointment({
        conversationId,
        scheduledFor,
        durationMinutes: parseInt(duration, 10),
        title: title.trim(),
        description: description.trim() || undefined,
      });

      toast.success("Appointment scheduled!");
      setOpen(false);

      // Reset form
      setTitle("");
      setDescription("");
      setDate(new Date());
      setHour("09");
      setMinute("00");
      setDuration("60");
    } catch (error) {
      console.error("Failed to schedule appointment:", error);
      toast.error("Failed to schedule appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSelectedTime = () => {
    if (!date || !hour || !minute) return "Select date & time";
    const d = new Date(date);
    d.setHours(parseInt(hour, 10));
    d.setMinutes(parseInt(minute, 10));
    return format(d, "MMMM dd, yyyy 'at' hh:mm a");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <CalendarIcon className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold">
            Schedule Appointment
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Set up a meeting with the other participant. Select a date, time,
            and add details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-medium">
                Appointment Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Project Planning, 1:1 Meeting, Team Sync"
                disabled={isSubmitting}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-medium">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add agenda, talking points, or any important notes..."
                rows={3}
                disabled={isSubmitting}
                className="resize-none"
              />
            </div>
          </div>

          <Card className="border shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-medium flex items-center gap-2">
                    <CalendarIcon className="size-4" />
                    Select Date
                  </Label>
                  <Card className="border overflow-hidden">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date: Date) => date < new Date()}
                      className="w-full"
                    />
                  </Card>
                </div>

                <div className="space-y-3">
                  <Label className="font-medium flex items-center gap-2">
                    <Clock className="size-4" />
                    Select Time & Duration
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="hour"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Hour
                      </Label>
                      <Select
                        value={hour}
                        onValueChange={setHour}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger id="hour" className="h-10">
                          <SelectValue placeholder="Hour" />
                          <ChevronDown className="size-4 opacity-50" />
                        </SelectTrigger>
                        <SelectContent>
                          {hours.map((h) => (
                            <SelectItem key={h} value={h} className="h-9">
                              {h}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="minute"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Minute
                      </Label>
                      <Select
                        value={minute}
                        onValueChange={setMinute}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger id="minute" className="h-10">
                          <SelectValue placeholder="Minute" />
                          <ChevronDown className="size-4 opacity-50" />
                        </SelectTrigger>
                        <SelectContent>
                          {minutes.map((m) => (
                            <SelectItem key={m} value={m} className="h-9">
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="duration"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Duration
                      </Label>
                      <Select
                        value={duration}
                        onValueChange={setDuration}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger id="duration" className="h-10">
                          <SelectValue placeholder="Duration" />
                          <ChevronDown className="size-4 opacity-50" />
                        </SelectTrigger>
                        <SelectContent>
                          {durations.map((dur) => (
                            <SelectItem
                              key={dur.value}
                              value={dur.value}
                              className="h-9"
                            >
                              {dur.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Scheduled for:</span>
                    <div className="flex items-center gap-2 bg-primary/5 px-3 py-2 rounded-lg">
                      <Clock className="size-4 text-primary" />
                      <span className="font-semibold text-primary">
                        {formatSelectedTime()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim()}
            className="flex-1 sm:flex-auto order-1 sm:order-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Scheduling...
              </>
            ) : (
              "Schedule Appointment"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
