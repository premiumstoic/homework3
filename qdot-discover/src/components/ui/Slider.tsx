import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number[];
  onValueChange: (value: number[]) => void;
  max: number;
  min: number;
  step: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, min, max, step, ...props }, ref) => {
    return (
      <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => onValueChange([parseFloat(e.target.value)])}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
          {...props}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
