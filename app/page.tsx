"use client";

import dynamic from 'next/dynamic'
const Footer = dynamic(() => import('./shared/components/features/Footer'), {ssr: false});
const Header = dynamic(() => import('./shared/components/features/Header'), {ssr: false});
const Calendar = dynamic(() => import("@/app/shared/components/features/Calendar"), {ssr: false});
const NotLoggedIn = dynamic(() => import("@/app/shared/components/ui/NotLoggedIn"), {ssr: false});
const PlanerCompact = dynamic(() => import("@/app/shared/components/features/PlanerCompact"), {ssr: false});
import {useSelector} from "react-redux";
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
