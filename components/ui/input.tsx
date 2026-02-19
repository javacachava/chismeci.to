import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-md border border-[#2A2F36] bg-[#1E2329] px-3 py-2 text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-[#3B82F6] transition-colors",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
