"use client";

import {usePathname, useRouter} from 'next/navigation'
import dynamic from "next/dynamic";
const MonitorIcon = dynamic(() => import('@/app/shared/components/ui/icons/MonitorIcon'), {ssr: false});
const UserGroupIcon = dynamic(() => import('@/app/shared/components/ui/icons/UserGroupIcon'), {ssr: false});
const ToolIcon = dynamic(() => import('@/app/shared/components/ui/icons/ToolIcon'), {ssr: false});
const DashboardIcon = dynamic(() => import('@/app/shared/components/ui/icons/DashboardIcon'), {ssr: false});

export default function Footer() {

    const router = useRouter();
    const pathname = usePathname();
    const active = (path: string) => path == pathname ? "text-primary" : "";

    return (
        <nav className="bg-white fixed bottom-0">
            <div className="grid grid-cols-4 w-screen gap-5 px-1 pt-1">
                <button
                    className={`flex items-center justify-center flex-col cursor-pointer p-2 ${active(
                        "/"
                    )}`}
                    onClick={() => router.push("/")}
                >
                    <DashboardIcon/>
                    <p className="text-sm">Dashboard</p>
                </button>
                <button
                    className={`flex items-center justify-center flex-col cursor-pointer p-2 ${active(
                        "/plan"
                    )}`}
                    onClick={() => router.push("/plan")}
                >
                    <ToolIcon/>
                    <p className="text-sm">Planer</p>
                </button>
                <button
                    className={`flex items-center justify-center flex-col cursor-pointer p-2 ${active(
                        "/progress"
                    )}`}
                    onClick={() => router.push("/progress")}
                >
                    <UserGroupIcon/>
                    <p className="text-sm">Fortschritt</p>
                </button>
                <button
                    className={`flex items-center justify-center flex-col cursor-pointer p-2 ${active(
                        "/board"
                    )}`}
                    onClick={() => router.push("/board")}
                >
                    <MonitorIcon/>
                    <p className="text-sm">Ranking</p>
                </button>
            </div>
        </nav>
    )
}