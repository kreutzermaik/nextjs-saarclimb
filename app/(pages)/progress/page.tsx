"use client";

import Footer from "@/app/shared/components/features/Footer";
import Header from "@/app/shared/components/features/Header";
import ProgressCard from "@/app/shared/components/features/ProgressCard";
import NotLoggedIn from "@/app/shared/components/ui/NotLoggedIn";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Progress() {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const userStore = useSelector((state: any) => state.user)

    useEffect(() => {
        setIsLoggedIn(userStore.isLoggedIn)
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