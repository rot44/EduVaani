import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 tracking-wide gap-1.5 animate-badge-spring",
  {
    variants: {
      variant: {
        // Core Palette Variants
        primary:
          "border-transparent bg-terracotta text-cream-white shadow-warm-sm",
        secondary:
          "border-transparent bg-peacock-teal text-cream-white shadow-warm-sm",
        accent:
          "border-transparent bg-turmeric text-deep-brown font-bold shadow-warm-sm",
        turmeric:
          "border border-turmeric/40 bg-turmeric/20 text-deep-brown font-semibold",
        teal:
          "border border-peacock-teal/30 bg-peacock-teal/15 text-peacock-teal font-semibold",
        outline:
          "border border-warm-sand bg-cream-white/70 text-deep-brown font-medium",
        ivory:
          "border border-warm-sand bg-warm-ivory text-deep-brown font-medium shadow-warm-sm",
        sand:
          "border-transparent bg-warm-sand text-deep-brown font-medium",
        destructive:
          "border-transparent bg-soft-coral text-cream-white shadow-warm-sm",

        // Backwards-compatible aliases
        terracotta:
          "border-transparent bg-terracotta text-cream-white shadow-warm-sm",
        default:
          "border-transparent bg-terracotta text-cream-white shadow-warm-sm",
        saffron:
          "border border-turmeric/40 bg-turmeric/20 text-deep-brown font-semibold",
        success:
          "border border-peacock-teal/30 bg-peacock-teal/15 text-peacock-teal font-semibold",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
