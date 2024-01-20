"use client";

import dynamic from "next/dynamic";
const Footer = dynamic(() => import('@/app/shared/components/features/Footer'), {ssr: false});
const Header = dynamic(() => import('@/app/shared/components/features/Header'), {ssr: false});
const ProgressCard = dynamic(() => import('@/app/shared/components/features/ProgressCard'), {ssr: false});
const NotLoggedIn = dynamic(() => import('@/app/shared/components/ui/NotLoggedIn'), {ssr: false});
import { autoLogin } from "@/test/autoLogin";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Progress() {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const userStore = useSelector((state: any) => state.user)

    useEffect(() => {
        if (!userStore.isLoggedIn && process.env.NODE_ENV === "development") {
            autoLogin().then(() => {
                setIsLoggedIn(true);
            });
        } else {
            setIsLoggedIn(userStore.isLoggedIn)
        }
    }, [])

    return (
        <main className="text-center text-gray-700">
            <Header text="Fortschritt"/>

            {isLoggedIn ? <ProgressCard/>
                : <NotLoggedIn/> }

            <Footer/>
        </main>
    );
}