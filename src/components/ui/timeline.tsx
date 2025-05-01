
import * as React from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const TimelineContext = React.createContext<{
  value?: number
  onChange?: (value: number) => void
  orientation: "horizontal" | "vertical"
  children?: React.ReactNode
}>({
  orientation: "horizontal",
})

const Timeline = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultValue?: number
    value?: number
    onChange?: (value: number) => void
    orientation?: "horizontal" | "vertical"
  }
>(({ className, defaultValue, value, onChange, orientation = "horizontal", children, ...props }, ref) => {
  const [localValue, setLocalValue] = React.useState(defaultValue || 0)
  const val = value !== undefined ? value : localValue

  const handleChange = React.useCallback(
    (value: number) => {
      setLocalValue(value)
      onChange?.(value)
    },
    [onChange]
  )

  return (
    <TimelineContext.Provider
      value={{
        value: val,
        onChange: handleChange,
        orientation,
        children,
      }}
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          className
        )}
        ref={ref}
        {...props}
      />
    </TimelineContext.Provider>
  )
})
Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    step: number
  }
>(({ className, step, ...props }, ref) => {
  const { value, onChange, orientation } = React.useContext(TimelineContext)
  const isActive = value !== undefined && step <= value
  const isClickable = onChange !== undefined

  return (
    <div
      className={cn(
        "group flex flex-1",
        orientation === "horizontal" ? "flex-col" : "flex-row",
        isClickable && "cursor-pointer",
        className
      )}
      ref={ref}
      onClick={() => onChange?.(step)}
      {...props}
    />
  )
})
TimelineItem.displayName = "TimelineItem"

const TimelineHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = React.useContext(TimelineContext)

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        orientation === "horizontal" ? "flex-col" : "flex-row",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
TimelineHeader.displayName = "TimelineHeader"

const TimelineTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { orientation } = React.useContext(TimelineContext)

  return (
    <p
      className={cn(
        "text-sm font-medium",
        orientation === "horizontal" && "text-center",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
TimelineTitle.displayName = "TimelineTitle"

const TimelineContent = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { orientation } = React.useContext(TimelineContext)

  return (
    <p
      className={cn(
        "text-sm text-muted-foreground mt-2",
        orientation === "horizontal" && "text-center",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
TimelineContent.displayName = "TimelineContent"

const TimelineIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { value, orientation } = React.useContext(TimelineContext)
  const parentStep = React.useContext(TimelineItemContext)
  const isActive = value !== undefined && parentStep <= value

  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background border-border",
        orientation === "horizontal" ? "order-first" : "order-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
TimelineIndicator.displayName = "TimelineIndicator"

const TimelineItemContext = React.createContext<number>(0)

const TimelineSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { value, orientation, children } = React.useContext(TimelineContext)
  const parentStep = React.useContext(TimelineItemContext)
  const isActive = value !== undefined && parentStep <= value
  const isLast = React.Children.count(children) === parentStep

  return (
    <div
      className={cn(
        "flex items-center",
        orientation === "horizontal"
          ? "flex-1 justify-center"
          : "h-full flex-col justify-start",
        className
      )}
      ref={ref}
      {...props}
    >
      {!isLast && (
        <>
          {orientation === "horizontal" ? (
            <div
              className={cn(
                "h-[1px] w-full flex-1 transition-colors",
                isActive ? "bg-primary" : "bg-border"
              )}
            />
          ) : (
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            />
          )}
        </>
      )}
    </div>
  )
})
TimelineSeparator.displayName = "TimelineSeparator"

export {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
}
