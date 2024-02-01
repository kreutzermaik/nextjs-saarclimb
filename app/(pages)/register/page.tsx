"use client";

import Auth from "../../shared/components/features/Auth";

export default function Register() {

    return (
        <main className="text-center mx-auto text-gray-700 p-4">
            <h1 className="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
                Registrieren
            </h1>
            <Auth type="register" />
        </main>
    )
}
