"use client";

import Footer from './shared/components/features/Footer'
import Header from './shared/components/features/Header'
import Calendar from "@/app/shared/components/features/Calendar";
import NotLoggedIn from "@/app/shared/components/ui/NotLoggedIn";
import {useSelector} from "react-redux";
import PlanerCompact from "@/app/shared/components/features/PlanerCompact";
import {useState, useEffect} from 'react'
import {autoLogin} from '@/test/autoLogin';

export default function Home() {

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
        <main className="text-center mx-auto text-gray-700 mb-20">
            <Header text={"Dashboard"}/>

            {isLoggedIn ?
                <div>
                    <PlanerCompact/>
                    <br/>

                    <div className="card card-compact shadow-xl bg-white">
                        <div className="card-body">
                            <Calendar/>
                        </div>
                    </div>
                </div>
                : <NotLoggedIn/>
            }


            <Footer/>
        </main>
    )
}
