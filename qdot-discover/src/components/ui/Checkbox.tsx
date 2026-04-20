import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => {
    return (
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          ref={ref}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className={cn(
            "peer h-5 w-5 shrink-0 appearance-none rounded-md border border-border/80 bg-background/90 ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:border-primary checked:bg-primary",
            className
          )}
          {...props}
        />
        <Check className="pointer-events-none absolute h-3.5 w-3.5 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100" />
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
