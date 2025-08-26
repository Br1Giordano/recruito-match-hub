import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-navy text-white shadow-sm",
        approved: "bg-status-approved/10 text-status-approved border border-status-approved/20 shadow-sm",
        pending: "bg-status-pending/10 text-status-pending border border-status-pending/20 shadow-sm", 
        rejected: "bg-status-rejected/10 text-status-rejected border border-status-rejected/20 shadow-sm",
        blocked: "bg-destructive/15 text-destructive border border-destructive/25 shadow-sm",
        secondary: "bg-secondary text-secondary-foreground border border-border shadow-sm",
        outline: "border border-border text-muted-foreground bg-background hover:bg-secondary",
        confidence: "bg-confidence/10 text-confidence border border-confidence/20 shadow-sm",
        electric: "bg-electric-teal/10 text-electric-teal border border-electric-teal/20 shadow-sm",
        amber: "bg-warm-amber/10 text-warm-amber border border-warm-amber/20 shadow-sm",
        "match-high": "bg-status-match-high/10 text-status-match-high border border-status-match-high/20 shadow-sm",
        "match-medium": "bg-status-match-medium/10 text-status-match-medium border border-status-match-medium/20 shadow-sm",
        "match-low": "bg-status-match-low/10 text-status-match-low border border-status-match-low/20 shadow-sm",
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
