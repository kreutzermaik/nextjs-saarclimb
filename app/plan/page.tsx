"use client";

import Footer from "@/app/shared/components/features/Footer";
import Header from "@/app/shared/components/features/Header";
import Planer from "@/app/shared/components/features/Planer";

export default function Plan() {

    return (
        <main className="text-center mx-auto text-gray-700">
            <Header text={"Wochenplaner"} />

            <div className="card card-compact shadow-xl bg-white">
                <div className="card-body">
                    <Planer />
                </div>
            </div>

            <Footer />
        </main>
    )
}
