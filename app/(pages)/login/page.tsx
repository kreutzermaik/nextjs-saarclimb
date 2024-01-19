"use client";

import Auth from "../../shared/components/features/Auth";
import NoSSR from 'react-no-ssr';

export default function Login() {

    return (
        <main className="text-center mx-auto text-gray-700 p-4">
            <h1 className="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
                Login
            </h1>
            <NoSSR>
                <Auth type="login"/>
            </NoSSR>
        </main>
)
}
