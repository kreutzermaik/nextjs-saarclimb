"use client";

import Footer from "@/app/shared/components/features/Footer";
import Header from "@/app/shared/components/features/Header";
import Planer from "@/app/shared/components/features/Planer";
import {useSelector} from "react-redux";
import NotLoggedIn from "../../shared/components/ui/NotLoggedIn";

export default function Plan() {

    const userStore = useSelector((state: any) => state.user);

    return (
        <main className="text-center mx-auto text-gray-700">
            <Header text={"Wochenplaner"}/>

            {userStore.isLoggedIn ?
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
