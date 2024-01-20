"use client";

import dynamic from "next/dynamic";
const Footer = dynamic(() => import('@/app/shared/components/features/Footer'), {ssr: false});
const Header = dynamic(() => import('@/app/shared/components/features/Header'), {ssr: false});
const Planer = dynamic(() => import('@/app/shared/components/features/Planer'), {ssr: false});
const NotLoggedIn = dynamic(() => import('@/app/shared/components/ui/NotLoggedIn'), {ssr: false});
import {useSelector} from "react-redux";
import {useState, useEffect} from 'react'

export default function Plan() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const userStore = useSelector((state: any) => state.user)

    useEffect(() => {
        setIsLoggedIn(userStore.isLoggedIn)
    }, [])

    return (
        <main className="text-center mx-auto text-gray-700">
            <Header text={"Wochenplaner"}/>

            {isLoggedIn ?
                <div className="card card-compact shadow-xl bg-white">
                    <div className="card-body">
                        <Planer/>
                    </div>
                </div>
                : <NotLoggedIn/>
            }

            <Footer/>
        </main>
    )
}