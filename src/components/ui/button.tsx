import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-cream-white disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Core Palette Variants
        primary:
          "bg-terracotta text-cream-white shadow-warm-sm hover:bg-terracotta-hover hover:shadow-terracotta",
        secondary:
          "bg-peacock-teal text-cream-white shadow-warm-sm hover:bg-peacock-teal-hover hover:shadow-teal",
        accent:
          "bg-turmeric text-deep-brown shadow-warm-sm hover:bg-turmeric-hover hover:shadow-turmeric font-bold",
        outline:
          "border border-warm-sand bg-cream-white/50 text-deep-brown hover:bg-warm-sand/60 hover:border-terracotta/40 shadow-sm",
        ghost:
          "text-deep-brown hover:bg-warm-sand/60 hover:text-deep-brown",
        destructive:
          "bg-soft-coral text-cream-white shadow-warm-sm hover:bg-soft-coral-hover",

        // Backwards-compatible aliases
        default:
          "bg-terracotta text-cream-white shadow-warm-sm hover:bg-terracotta-hover hover:shadow-terracotta",
        glow:
          "bg-terracotta text-cream-white shadow-terracotta hover:bg-terracotta-hover hover:scale-[1.02] active:scale-[0.98]",
        link:
          "text-terracotta underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-13 rounded-2xl px-8 text-base font-bold",
        icon: "h-10 w-10 rounded-xl",
        pill: "h-11 px-6 rounded-full text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
