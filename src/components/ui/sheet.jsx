import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger

const SheetContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <SheetPrimitive.Portal>
    <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
    <SheetPrimitive.Content
      ref={ref}
      className={`fixed z-50 gap-4 bg-background p-6 shadow-lg animate-in slide-in-from-right-1/2 duration-200 right-0 top-0 w-full sm:w-[540px] h-full flex flex-col ${className || ''}`}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPrimitive.Portal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

export { Sheet, SheetTrigger, SheetContent }
