"use client";

import {useEffect} from 'react';
import Footer from './shared/components/features/Footer'
import Header from './shared/components/features/Header'
import {useStore} from '@/app/store';
import Calendar from "@/app/shared/components/features/Calendar";
import NotLoggedIn from "@/app/shared/components/ui/NotLoggedIn";
import {useSelector} from "react-redux";

export default function Home() {

    const {isLoggedIn, setIsLoggedIn} = useStore();
    const userStore = useSelector((state: any) => state.user);

    useEffect(() => {
        console.log(userStore.isLoggedIn)
    });


    return (
        <main className="text-center mx-auto text-gray-700 mb-20">
            <Header text={"Dashboard"}/>

            {userStore.isLoggedIn ?
                <div className="card card-compact shadow-xl bg-white">
                    <div className="card-body">
                        <Calendar/>
                    </div>
                </div>
                : <NotLoggedIn />
            }

            <Footer/>
        </main>
    )
}
