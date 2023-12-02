"use client";

import {supabase} from "@/supabase";
import Cache from "@/app/cache";
import {useRouter} from "next/navigation";
import Header from "@/app/shared/components/features/Header";
import {HelpIcon} from "@/app/shared/components/ui/icons/HelpIcon";
import {Button} from "@/app/shared/components/ui/Button";
import Footer from "@/app/shared/components/features/Footer";

export default function Settings() {
    
    const router = useRouter();

    /**
     * logout and navigate to login page
     */
    async function logout() {
        const { error } = await supabase.auth.signOut();
        Cache.clearOnLogout();
        router.push("/login");
    }

    return (
        <main className="text-center mx-auto text-gray-700">
            <Header text="Einstellungen" />

            <div className="card card-compact shadow-xl bg-white">
                <div className="card-body">
                    <div>
                        <h2 className="card-title float-left">Hilfe</h2>
                        <div className="float-right">
                            <a href="https://saarclimb-docs.netlify.app/benutzerhandbuch/allgemein/"><HelpIcon /></a>
                        </div>
                    </div>

                    <div className="text-left">
                        <p>
                            Bei Problemen oder Fragen wende dich bitte direkt an den mich, den Entwickler. Du kannst mich per
                            E-Mail
                            unter
                            <b><a href="mailto:kreutzermaik123@web.de"> kreutzermaik123@web.de </a></b> erreichen.
                            Alternativ findest du möglicherweise auch im <b><a
                            href="https://saarclimb-docs.netlify.app/benutzerhandbuch/allgemein/"> Benutzerhandbuch </a></b>
                            eine Antwort auf deine Fragen.
                        </p>
                    </div>

                    <div className="text-left mt-2">
                        <Button
                            text="Ausloggen"
                            type="secondary"
                            outline="true"
                            rounded="true"
                            onClick={() => logout()}
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
