"use client";

import Footer from "@/app/shared/components/features/Footer";
import Header from "@/app/shared/components/features/Header";
import ProgressCard from "@/app/shared/components/features/ProgressCard";
import NotLoggedIn from "@/app/shared/components/ui/NotLoggedIn";
import { autoLogin } from "@/test/autoLogin";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NoSSR from 'react-no-ssr';

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
            <NoSSR><Header text="Fortschritt"/></NoSSR>

            {isLoggedIn ? <NoSSR><ProgressCard/></NoSSR>
                : <NoSSR><NotLoggedIn/></NoSSR> }

            <NoSSR><Footer/></NoSSR>
        </main>
    );
}