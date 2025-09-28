import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const appButtonVariants = cva(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    {
        variants: {
            intent: {
                primary: [
                    "bg-[#0B1529] hover:bg-[#0B1529]/90 text-white",
                    "shadow-[0_2px_0_#0000000f,0_10px_30px_-10px_rgba(11,21,41,0.6)]",
                    "border border-[#0B1529] hover:border-[#0B1529]/90",
                    "focus-visible:ring-[#0B1529]/50"
                ],
                secondary: [
                    "bg-white hover:bg-gray-50 text-gray-900",
                    "border border-neutral-200 hover:border-neutral-300",
                    "shadow-[0_1px_0_#0000000a,0_8px_24px_-10px_rgba(2,6,23,0.15)]",
                    "focus-visible:ring-neutral-400/50"
                ],
                ghost: [
                    "bg-transparent hover:bg-gray-100 text-gray-700",
                    "border border-transparent",
                    "focus-visible:ring-gray-400/50"
                ],
                outline: [
                    "bg-transparent hover:bg-gray-50 text-gray-900",
                    "border border-neutral-200 hover:border-neutral-300",
                    "focus-visible:ring-neutral-400/50"
                ]
            },
            size: {
                sm: "px-3 h-8 text-sm",
                md: "px-4 h-10 text-sm",
                lg: "px-5 h-12 text-base"
            }
        },
        defaultVariants: {
            intent: "primary",
            size: "md"
        }
    }
)

export interface AppButtonProps extends
    Omit<React.ComponentProps<"button">, 'className'>,
    VariantProps<typeof appButtonVariants> {
    intent?: "primary" | "secondary" | "ghost" | "outline"
    size?: "sm" | "md" | "lg"
    className?: string
    asChild?: boolean
}

export function AppButton({
                              className,
                              intent,
                              size,
                              children,
                              asChild = false,
                              ...props
                          }: AppButtonProps) {
    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            className={cn(appButtonVariants({ intent, size }), className)}
            {...props}
        >
            {children}
        </Comp>
    )
}