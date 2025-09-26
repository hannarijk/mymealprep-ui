import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
    children: ReactNode;
    className?: string;
    background?: "white" | "neutral-50" | "neutral-100" | "gradient";
    padding?: "sm" | "md" | "lg" | "xl";
    id?: string;
}

const backgroundClasses = {
    white: "bg-white",
    "neutral-50": "bg-neutral-50",
    "neutral-100": "bg-neutral-100",
    gradient: "bg-gradient-to-b from-white to-neutral-50"
};

const paddingClasses = {
    sm: "py-12",
    md: "py-16",
    lg: "py-20",
    xl: "py-24"
};

export function Section({
                            children,
                            className,
                            background = "white",
                            padding = "xl",
                            id
                        }: SectionProps) {
    return (
        <section
            id={id}
            className={cn(
                "w-full", // Always full width
                backgroundClasses[background],
                paddingClasses[padding],
                className
            )}
        >
            {children}
        </section>
    );
}