// src/components/ui/Button.tsx
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils"; // Make sure this path is correct

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:hover:scale-100 shadow hover:shadow-md",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 border border-transparent",
        teal:    "bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-500 border border-transparent",
        sky:     "bg-sky-600 text-white hover:bg-sky-700 focus-visible:ring-sky-500 border border-transparent",
        // --- ADDED INDIGO VARIANT ---
        indigo:  "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 border border-transparent",
        // --- OUTLINE REMAINS DEFINED (but might not be used here) ---
        outline: "border-2 border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-500 dark:text-sky-400 dark:border-sky-500 dark:hover:bg-sky-900/30",
      },
      size: {
        sm: "text-sm h-9 px-4",
        md: "text-base h-11 px-6",
        lg: "text-lg h-12 px-8 py-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

// Keeping named export consistent