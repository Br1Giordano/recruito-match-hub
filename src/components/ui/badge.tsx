import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-navy text-white shadow-sm",
        approved: "bg-green-100 text-green-800 border border-green-200",
        pending: "bg-blue-100 text-blue-800 border border-blue-200", 
        rejected: "bg-red-100 text-red-800 border border-red-200",
        secondary: "bg-gray-100 text-gray-800 border border-gray-200",
        outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50",
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
