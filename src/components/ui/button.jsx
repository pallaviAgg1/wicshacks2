// @ts-nocheck
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

const Button = React.forwardRef(({ className, children, ...props }, ref) =>
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 ${className || ''}`}
    ref={ref}
    {...props}
  >
    {children}
  </button>
)
Button.displayName = "Button"

export { Button }
