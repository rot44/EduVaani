import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow",
        secondary:
          "border-white/10 bg-white/10 text-white hover:bg-white/15",
        destructive:
          "border-transparent bg-red-500 text-white shadow",
        outline:
          "border-white/20 text-white/90 bg-white/5 backdrop-blur-sm",
        saffron:
          "border-orange-500/30 bg-orange-500/15 text-orange-300 font-medium",
        success:
          "border-emerald-500/30 bg-emerald-500/15 text-emerald-300 font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
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
