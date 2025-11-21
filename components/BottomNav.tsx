"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, List, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        {
            label: "Main",
            href: "/",
            icon: Map,
        },
        {
            label: "List",
            href: "/list",
            icon: List,
        },
        {
            label: "Favorite",
            href: "/favorite",
            icon: Heart,
        },
        {
            label: "Profile",
            href: "/profile",
            icon: User,
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white pb-safe pt-2">
            <div className="flex h-16 items-center justify-around">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors",
                                isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            <Icon className={cn("h-6 w-6", isActive && "fill-current")} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
