"use client";

import Footer from "@/app/shared/components/features/Footer";
import Header from "@/app/shared/components/features/Header";
import LeaderBoard from "@/app/shared/components/features/LeaderBoard";

export default function Board() {

    return (
        <main className="text-center mx-auto text-gray-700">
            <Header text={"Bestenliste"}/>

            <div className="card card-compact shadow-xl bg-white">
                <div className="card-body">
                    <LeaderBoard/>
                </div>
            </div>

            <Footer/>
        </main>
    )
}