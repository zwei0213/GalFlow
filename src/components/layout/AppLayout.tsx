import React from 'react';
import { clsx } from 'clsx';

interface AppLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, className }) => {
    return (
        <div className={clsx(
            "relative w-full h-[100dvh] overflow-hidden bg-kachimushiro text-paper-white",
            "flex flex-col",
            className
        )}>
            {children}
        </div>
    );
};
