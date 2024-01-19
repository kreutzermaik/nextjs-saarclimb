"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "../ui/Button";
import Link from "next/link";
import Cache from "@/app/cache";
import {supabase} from "@/supabase";
import Toast from "../ui/Toast";
import SupabaseService from "../../api/supabase-service";
import Session from "@/app/session";
import {useDispatch} from "react-redux";
import {login, setUserImage,} from "@/app/userSlicer";

type AuthProps = {
    type: string
}

export default function Auth(props: AuthProps) {

    const router = useRouter();
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    /**
     * register with email and password
     */
    async function registerWithEmail() {
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) {
            new Toast().push({
                title: Toast.REGISTER_ERROR_MESSAGE,
                content: error.message,
                style: 'error',
                duration: 5000
            });
            return;
        }

        await SupabaseService.addUser({uid: data.user?.id, email: data.user?.email, name: name, avatar_url: ''});
        await initUserData();

        new Toast().push({content: Toast.REGISTERED_MESSAGE, style: 'success', duration: 3000});

        router.push('/');
    }

    /**
     * login with email and password
     */
    async function loginWithEmail() {
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            new Toast().push({
                title: Toast.LOGIN_ERROR_MESSAGE,
                content: error.message,
                style: 'error',
                duration: 5000
            });
            return;
        }

        dispatch(login());

        router.push('/');
    }

    /**
     * init user data that is required for the app
     */
    async function initUserData() {
        if (await Session.getCurrentUser()) {
            if ((await Session.getCurrentUser())?.name === undefined) {
                await Session.updateUserInSession(JSON.parse(Cache.getCacheItem("username")));
            }
        }
        await addAvatar();
        await addPlan();
        await initUserPoints();
        dispatch(login());
    }

    /**
     * returns provider from cache
     * @returns
     */
    function checkProvider(): string | undefined {
        if (Cache.getCacheItem("sb-ybeongwjjfdkgizzkmsc-auth-token")) {
            return JSON.parse(
                Cache.getCacheItem("sb-ybeongwjjfdkgizzkmsc-auth-token")
            ).user.app_metadata.provider;
        }
    }

    /**
     * add avatar if not exists
     * gets only called if 'initAvatar' is not in the cache
     */
    async function addAvatar() {
        if (!Cache.getCacheItem("initAvatar")) {
            let avatar = await SupabaseService.getAvatar();
            if (avatar.data === null) {
                await SupabaseService.initAvatar();
            }
            Cache.setCacheItem("initAvatar", true);
        }
    }

    /**
     * update avatar url in cache
     */
    async function updateAvatarUrlInCache() {
        let url = (await SupabaseService.getAvatar()).data?.signedUrl;
        if (url) {
            dispatch(setUserImage(url));
            await updateUserWithAvatarUrl(url);
        }
    }

    /**
     * update user table with avatar_url
     * @param avatarUrl
     */
    async function updateUserWithAvatarUrl(avatarUrl: string) {
        await SupabaseService.updateUser(avatarUrl);
    }

    /**
     * add plan if not exists
     * gets only called if 'initPlan' is not in the cache
     */
    async function addPlan() {
        if (!Cache.getCacheItem("initPlan")) {
            let plan = await SupabaseService.getPlan();
            if (plan.planer === null) {
                await SupabaseService.addPlan();
            }
            Cache.setCacheItem("initPlan", true);
        }
    }

    /**
     * init points in user table for all gyms with value 0
     * gets only called if 'initPoints' is not in the cache
     */
    async function initUserPoints(): Promise<void> {
        if (!Cache.getCacheItem("initPoints")) {
            let user = await SupabaseService.getCurrentPoints();
            if (!user?.points?.points) {
                let pointsArray: { gymId: string; value: number; }[] = [];
                let gyms = (await SupabaseService.getGyms()).gym;
                gyms?.map((gym): void => {
                    pointsArray.push({gymId: gym.id.toString(), value: 0})
                })
                await SupabaseService.updateUserPoints(pointsArray);
            }
            Cache.setCacheItem("initPoints", true);
        }
    }

    return (
        <div>
            {props.type === 'login' &&
                <div className="login-container p-6 mx-auto space-y-4 md:space-y-6 sm:p-8">
                    <form className="space-y-4 md:space-y-6" action="#">
                        <div>
                            <label htmlFor="email"
                                   className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">E-Mail
                                Adresse</label>
                            <input type="email" name="email" onChange={(e: any) => {
                                setEmail(e.target.value)
                            }} id="email"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="name@email.com" required/>
                        </div>
                        <div>
                            <label htmlFor="password"
                                   className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">Passwort</label>
                            <input type="password" name="password" onChange={(e: any) => {
                                setPassword(e.target.value)
                            }} id="password" placeholder="••••••••"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   required/>
                        </div>
                        <div id="login">
                            <Button text="Einloggen" type="secondary" onClick={loginWithEmail}/>
                        </div>
                        <hr/>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Du hast noch keinen Account? <Link href="/register"
                                                               className="font-medium text-primary-600 hover:underline dark:text-primary-500">Registrieren</Link>
                        </p>
                    </form>
                </div>
            }
            {props.type === 'register' &&
                <div className="login-container p-6 mx-auto space-y-4 md:space-y-6 sm:p-8">
                    <form className="space-y-4 md:space-y-6" action="#">
                        <div>
                            <label htmlFor="name"
                                   className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">Vollständiger
                                Name</label>
                            <input type="name" name="name" onChange={(e: any) => {
                                setName(e.target.value);
                                Cache.setCacheItem('username', e.target.value)
                            }} id="name"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="Max Mustermann" required/>
                        </div>
                        <div>
                            <label htmlFor="email"
                                   className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">E-Mail
                                Adresse</label>
                            <input type="email" name="email" onChange={(e: any) => {
                                setEmail(e.target.value)
                            }} id="email"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="name@email.com" required/>
                        </div>
                        <div>
                            <label htmlFor="password"
                                   className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">Passwort</label>
                            <input type="password" name="password" onChange={(e: any) => {
                                setPassword(e.target.value)
                            }} id="password" placeholder="••••••••"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   required/>
                        </div>
                        <Button text="Registrieren" type="secondary" onClick={registerWithEmail}/>
                        <hr/>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Zurück zum <Link href="/login"
                                             className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</Link>
                        </p>
                    </form>
                </div>
            }
        </div>
    )
}