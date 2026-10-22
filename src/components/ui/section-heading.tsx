import * as React from "react"
import { cn } from "../../lib/utils"
import { Badge, type badgeVariants } from "./badge"
import { type VariantProps } from "class-variance-authority"

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode
  subtitle?: React.ReactNode
  badge?: React.ReactNode
  badgeVariant?: VariantProps<typeof badgeVariants>["variant"]
  align?: "left" | "center" | "right"
}

export function SectionHeading({
  title,
  subtitle,
  badge,
  badgeVariant = "accent",
  align = "center",
  className,
  ...props
}: SectionHeadingProps) {
  const alignContainerClasses = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  }

  return (
    <div
      className={cn(
        "flex flex-col max-w-3xl mb-10 sm:mb-14",
        alignContainerClasses[align],
        className
      )}
      {...props}
    >
      {badge && (
        <div className="mb-3.5">
          {typeof badge === "string" ? (
            <Badge variant={badgeVariant}>{badge}</Badge>
          ) : (
            badge
          )}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-deep-brown tracking-tight leading-[1.18]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3.5 text-base sm:text-lg text-deep-brown/75 leading-relaxed font-sans max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  )
}
