"use client";

import SupabaseService from "@/app/src/api/supabase-service";
import {useEffect, useState} from "react";
import {User} from "../src/types/User";
import {LoadingSpinner} from "../src/components/ui/LoadingSpinner";

export default function Login() {

    const [users, setUsers] = useState<User[]>();

    async function fetchUsers(): Promise<void> {
        let users = await SupabaseService.getAllUsers();
        if (users.users) setUsers(users.users);
        else throw new Error("Error: " + users.error);
    }

    useEffect(() => {
        fetchUsers();
    }, []);


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <h1 className={"text-5xl"}>Login</h1>

                {users ?
                    <div className="flex flex-col">
                        <div className="flex flex-col">
                            {users?.map((user) => (
                                <div className="flex flex-row">
                                    <p className="text-2xl">{user.email} : {user.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    : <LoadingSpinner/>
                }

            </div>
        </main>
    )
}
