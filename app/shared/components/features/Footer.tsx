"use client";

import {usePathname, useRouter} from 'next/navigation'
import {MonitorIcon} from '../ui/icons/MonitorIcon';
import {UserGroupIcon} from '../ui/icons/UserGroupIcon';
import {ToolIcon} from '../ui/icons/ToolIcon';
import {DashboardIcon} from '../ui/icons/DashboardIcon';
import NoSSR from 'react-no-ssr';

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
                    <NoSSR><DashboardIcon/></NoSSR>
                    <p className="text-sm">Dashboard</p>
                </button>
                <button
                    className={`flex items-center justify-center flex-col cursor-pointer p-2 ${active(
                        "/plan"
                    )}`}
                    onClick={() => router.push("/plan")}
                >
                    <NoSSR><ToolIcon/></NoSSR>
                    <p className="text-sm">Planer</p>
                </button>
                <button
                    className={`flex items-center justify-center flex-col cursor-pointer p-2 ${active(
                        "/progress"
                    )}`}
                    onClick={() => router.push("/progress")}
                >
                    <NoSSR><UserGroupIcon/></NoSSR>
                    <p className="text-sm">Fortschritt</p>
                </button>
                <button
                    className={`flex items-center justify-center flex-col cursor-pointer p-2 ${active(
                        "/board"
                    )}`}
                    onClick={() => router.push("/board")}
                >
                    <NoSSR><MonitorIcon/></NoSSR>
                    <p className="text-sm">Ranking</p>
                </button>
            </div>
        </nav>
    )
}