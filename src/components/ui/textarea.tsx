<<<<<<< HEAD:src/components/ui/textarea.tsx
import * as React from "react";

import { cn } from "@/lib/utils";

type TextareaProps = React.ComponentProps<"textarea"> & {
  icons?: React.ReactNode;
  focusedIcon?: React.ReactNode;
  containerClassName?: string;
};

function Textarea({
  className,
  icons,
  focusedIcon,
  containerClassName,
  ...props
}: TextareaProps) {
  return (
    <div
      className={cn(
        "border-input focus-within:border-ring focus-within:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-sm border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-within:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm  items-center justify-center",
        containerClassName
      )}
    >
      <textarea
        data-slot="textarea"
        className={cn(
          "placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-0 rounded-none!",
          className
        )}
        {...props}
      />

      <div>{icons}</div>
    </div>
  );
}

export { Textarea };
=======
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
>>>>>>> 7dc7f58b000842c5ab90a92d7b129effc6102a27:apps/web/src/components/ui/textarea.tsx
