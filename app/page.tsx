"use client";

import Footer from './shared/components/features/Footer'
import Header from './shared/components/features/Header'
import Calendar from "@/app/shared/components/features/Calendar";
import NotLoggedIn from "@/app/shared/components/ui/NotLoggedIn";
import {useSelector} from "react-redux";
import PlanerCompact from "@/app/shared/components/features/PlanerCompact";

export default function Home() {

    const userStore = useSelector((state: any) => state.user);

    return (
        <main className="text-center mx-auto text-gray-700 mb-20">
            <Header text={"Dashboard"}/>

            {userStore.isLoggedIn ?
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
