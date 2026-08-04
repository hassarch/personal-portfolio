import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* eslint-disable react-refresh/only-export-components */

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-2 border-foreground shadow-brutal-md hover:shadow-brutal-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200",
        destructive: "bg-destructive text-destructive-foreground border-2 border-foreground shadow-brutal-md hover:shadow-brutal-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none",
        outline: "border-2 border-foreground bg-background hover:bg-foreground hover:text-background shadow-brutal-md hover:shadow-brutal-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200",
        secondary: "bg-secondary text-secondary-foreground border-2 border-foreground shadow-brutal-md hover:shadow-brutal-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none",
        ghost: "hover:bg-secondary hover:text-secondary-foreground rounded-lg",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-primary text-primary-foreground font-bold border-2 border-foreground shadow-brutal-lg hover:shadow-brutal-xl hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all duration-200",
        glass: "bg-card border-2 border-foreground text-foreground hover:bg-foreground hover:text-background shadow-brutal-md hover:shadow-brutal-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200",
        glow: "bg-primary text-primary-foreground border-2 border-foreground shadow-brutal-lg hover:shadow-brutal-xl hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
