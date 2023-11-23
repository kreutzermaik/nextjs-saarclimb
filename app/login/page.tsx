"use client";

import Auth from "../shared/components/features/Auth";

export default function Login() {

    return (
        <main className="text-center mx-auto text-gray-700 p-4">
            <h1 className="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
                Login
            </h1>
            <Auth type="login" />
        </main>
    )
}
