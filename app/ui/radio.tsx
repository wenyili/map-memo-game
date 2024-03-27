"use client"

import * as React from "react"
import * as RadioGroupPrimitives from "@radix-ui/react-radio-group"

import { cn } from "../lib/utils"


const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Root>
>(({ className, ...props }, ref) => (
    <RadioGroupPrimitives.Root
        ref={ref}
        className={cn("flex flex-row gap-2",className)}
        {...props}
    />
))

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Item>
>(({ className, ...props }, ref) => (
    <div className="flex items-center">
        <RadioGroupPrimitives.Item
            ref={ref}
            className={cn(
            "w-6 h-6 rounded-full border border-primary/20 shadow-lg ring-0 hover:bg-input focus:border-primary/70 focus:border-2 ",
            className
            )}
            {...props}
        />
    </div>
))

const RadioGroupIndicator = React.forwardRef<
React.ElementRef<typeof RadioGroupPrimitives.Indicator>,
React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Indicator>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitives.Indicator
      ref={ref}
      className={cn(
        "flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-primary/70",
      className
      )}
      {...props}
  />
))

export { RadioGroup, RadioGroupIndicator, RadioGroupItem }
