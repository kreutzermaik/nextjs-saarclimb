"use client";

import dynamic from "next/dynamic";
const Footer = dynamic(() => import('@/app/shared/components/features/Footer'), {ssr: false});
const Header = dynamic(() => import('@/app/shared/components/features/Header'), {ssr: false});
const LeaderBoard = dynamic(() => import('@/app/shared/components/features/LeaderBoard'), {ssr: false});

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