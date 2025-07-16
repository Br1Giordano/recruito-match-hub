import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "gradient-primary text-white shadow-sm",
        approved: "bg-status-approved/10 text-status-approved border border-status-approved/20",
        pending: "bg-status-pending/10 text-status-pending border border-status-pending/20", 
        rejected: "bg-status-rejected/10 text-status-rejected border border-status-rejected/20",
        secondary: "bg-gray-100 text-navy border border-gray-200",
        outline: "border border-gray-200 text-foreground bg-background hover:bg-gray-50",
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
