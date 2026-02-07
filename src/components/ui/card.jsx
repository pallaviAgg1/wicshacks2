// @ts-nocheck
import * as React from "react"

const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm ${className || ''}`}
    {...props}
  >
    {children}
  </div>
))
Card.displayName = "Card"

const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className || ''}`} {...props}>
    {children}
  </div>
))
CardContent.displayName = "CardContent"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className || ''}`} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2 ref={ref} className={`text-2xl font-semibold leading-none tracking-tight ${className || ''}`} {...props} />
))
CardTitle.displayName = "CardTitle"

export { Card, CardContent, CardHeader, CardTitle }
