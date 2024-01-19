"use client";

import Footer from "@/app/shared/components/features/Footer";
import Header from "@/app/shared/components/features/Header";
import LeaderBoard from "@/app/shared/components/features/LeaderBoard";
import NoSSR from 'react-no-ssr';

export default function Board() {

    return (
        <main className="text-center mx-auto text-gray-700">
            <NoSSR>
                <Header text={"Bestenliste"}/>
            </NoSSR>

            <div className="card card-compact shadow-xl bg-white">
                <div className="card-body">
                    <NoSSR>
                        <LeaderBoard/>
                    </NoSSR>
                </div>
            </div>

            <Footer/>
        </main>
    )
}