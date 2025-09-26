import type {ReactNode} from "react";
import {cn} from "@/lib/utils";

interface ContainerProps {
    className?: string;
    children: ReactNode;
}

export function Container({ className, children }: ContainerProps) {
    return (
        <div
            className={cn(
                "mx-auto w-full px-4 sm:px-6 lg:px-8",
                "max-w-[1200px] xl:max-w-[1280px]",
                className
            )}
        >
            {children}
        </div>
    );
}
