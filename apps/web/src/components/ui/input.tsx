"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Eye, EyeOff } from "lucide-react";

type InputProps = React.ComponentProps<"input"> & {
  icon?: React.ReactElement<React.ComponentProps<"div">>;
  isPassword?: boolean;
};

function Input({ className, type, icon, isPassword, ...props }: InputProps) {
  const iconProps = {
    ...icon?.props,
    className: "size-[20px] text-muted-foreground shrink-0",
  };
  const inputIcon = icon ? React.cloneElement(icon, iconProps) : null;

  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div
      data-slot="input"
      className="focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive selection:bg-primary  dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-white! h-[50px]  py-1 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-background  file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 flex items-center px-[10px] gap-[10px]"
    >
      {inputIcon}
      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        className={cn(
          "focus:border-transparent focus:outline-none focus:ring-0 file:text-foreground placeholder:text-muted-foreground selection:text-primary-foreground file:text-sm md:text-sm w-full",
          "",
          "",
          className
        )}
        {...props}
      />
      {isPassword && (
        <Button
          variant="ghost"
          onClick={() => setShowPassword(!showPassword)}
          className="text-muted-foreground hover:text-foreground shrink-0 "
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </Button>
      )}
    </div>
  );
}

export { Input };
