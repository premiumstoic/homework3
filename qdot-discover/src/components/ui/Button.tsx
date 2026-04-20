import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default:
        "border border-primary/30 bg-primary text-primary-foreground shadow-[0_14px_32px_rgba(37,99,235,0.24)] hover:-translate-y-0.5 hover:bg-primary/92",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline:
        "border border-border/80 bg-background/75 text-foreground shadow-[0_12px_30px_rgba(15,23,42,0.06)] hover:border-primary/35 hover:bg-card",
      secondary: "border border-border/70 bg-secondary text-secondary-foreground hover:bg-secondary/90",
      ghost: "text-foreground/78 hover:bg-card hover:text-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    }
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-full px-3.5",
      lg: "h-11 rounded-full px-8",
      icon: "h-10 w-10 rounded-full",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
