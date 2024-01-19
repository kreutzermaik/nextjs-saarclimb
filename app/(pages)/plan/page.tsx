"use client";

import Footer from "@/app/shared/components/features/Footer";
import Header from "@/app/shared/components/features/Header";
import Planer from "@/app/shared/components/features/Planer";
import {useSelector} from "react-redux";
import NotLoggedIn from "../../shared/components/ui/NotLoggedIn";
import {useState, useEffect} from 'react'
import NoSSR from 'react-no-ssr';

export default function Plan() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const userStore = useSelector((state: any) => state.user)

    useEffect(() => {
        setIsLoggedIn(userStore.isLoggedIn)
    }, [])

    return (
        <main className="text-center mx-auto text-gray-700">
            <NoSSR>
                <Header text={"Wochenplaner"}/>
            </NoSSR>

            {isLoggedIn ?
                <div className="card card-compact shadow-xl bg-white">
                    <div className="card-body">
                        <NoSSR>
                            <Planer/>
                        </NoSSR>
                    </div>
                </div>
                : <NoSSR><NotLoggedIn/></NoSSR>
            }

            <NoSSR><Footer/></NoSSR>
        </main>
    )
}