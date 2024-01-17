import * as React from "react";
import { cn } from "@starter/ui/src/lib/utils";

const h1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h1
    className={cn("scroll-m-20 text-2xl font-bold tracking-tight", className)}
    {...props}
    ref={ref}
  >
    {children}
  </h1>
));
h1.displayName = "h1";

const h2 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h2
    className={cn(
      "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      className
    )}
    {...props}
    ref={ref}
  >
    {children}
  </h2>
));
h2.displayName = "h2";

const h3 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    className={cn(
      "scroll-m-20 text-2xl font-semibold tracking-tight",
      className
    )}
    {...props}
    ref={ref}
  >
    {children}
  </h3>
));
h3.displayName = "h3";

const h4 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h4
    className={cn(
      "scroll-m-20 text-lg font-semibold tracking-tight",
      className
    )}
    {...props}
    ref={ref}
  >
    {children}
  </h4>
));
h4.displayName = "h4";

const Title = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h1
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
    ref={ref}
  >
    {children}
  </h1>
));
Title.displayName = "Title";

const p = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p className={cn("text-sm leading-7", className)} {...props} ref={ref}>
    {children}
  </p>
));
p.displayName = "p";

const lead = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    className={cn("text-xl text-muted-foreground", className)}
    {...props}
    ref={ref}
  >
    {children}
  </div>
));
lead.displayName = "lead";

const large = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div className={cn("text-lg font-semibold", className)} {...props} ref={ref}>
    {children}
  </div>
));
large.displayName = "large";

const small = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    className={cn("text-sm font-medium leading-none", className)}
    {...props}
    ref={ref}
  >
    {children}
  </div>
));
small.displayName = "small";

const muted = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
    ref={ref}
  >
    {children}
  </div>
));
muted.displayName = "muted";

export const Typography = {
  Title,
  h1,
  h2,
  h3,
  h4,
  p,
  lead,
  large,
  small,
  muted,
};
