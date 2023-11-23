"use client";

import {useEffect} from 'react';
import Footer from './shared/components/features/Footer'
import Header from './shared/components/features/Header'
import {useStore} from '@/app/store';

export default function Home() {

    const {isLoggedIn, setIsLoggedIn} = useStore();

    useEffect(() => {
        setIsLoggedIn(true);
    });


    return (
        <main className="text-center mx-auto text-gray-700 mb-20">
            <Header text={"Dashboard"}/>

            <div>
                { isLoggedIn ?
                    <p>isLoggedIn: {isLoggedIn.toString()}</p>
                    :
                    <p>Loading...</p>
                }
            </div>

            <button onClick={() => setIsLoggedIn(false)}>
                Logout
            </button>

            <Footer/>
        </main>
    )
}
