"use client";

import Session from "@/app/session";
import SupabaseService from "@/app/shared/api/supabase-service";
import Footer from "@/app/shared/components/features/Footer";
import Header from "@/app/shared/components/features/Header";
import {User} from "@/app/shared/types/User";
import {setUserImage, setUserPoints} from "@/app/userSlicer";
import imageCompression from "browser-image-compression";
import {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import NotLoggedIn from "@/app/shared/components/ui/NotLoggedIn";
import {LoadingSpinner} from "@/app/shared/components/ui/LoadingSpinner";
import {Button} from "@/app/shared/components/ui/Button";
import NumberAnimation from "@/app/shared/components/ui/NumberAnimation";
import ChartVisitedGyms from "@/app/shared/components/features/ChartVisitedGyms";

export default function Profile() {

    const dispatch = useDispatch();
    const userStore = useSelector((state: any) => state.user);

    const [user, setUser] = useState<User>();
    const [finishedEvents, setFinishedEvents] = useState<number>();
    const [avatar, setAvatar] = useState("");

    /**
     * check if user has avatar in store
     */
    async function checkUserImage() {
        if (userStore.userImage) {
            setAvatar(userStore.userImage);
        } else if (!userStore.userImage && userStore.isLoggedIn) {
            setAvatar((await SupabaseService.getCurrentAvatarUrl()).avatar_url?.avatar_url);
            dispatch(setUserImage(avatar));
        }
    }
    
    /**
     * get number of finished events per user
     */
    async function fetchEventsCount() {
        let events = (await SupabaseService.getEvents()).events;
        if (events) setFinishedEvents(events.length);
    }

    /**
     * update avatar
     * @param e
     */
    async function handleUpload(e: any) {
        closeDialog();

        let file: File = e.target.files[0];

        try {
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            });
            await SupabaseService.updateAvatar(compressedFile);
            await updateAvatarUrlInCache();


        } catch (error) {
            console.log(error);
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
     * open dialog for changing profile picture
     */
    function openDialog() {
        document.getElementById("image-upload-dialog")?.classList.remove("hidden");
    }

    /**
     * hide dialog
     */
    function closeDialog() {
        document.getElementById("image-upload-dialog")?.classList.add("hidden");
    }

    /**
     * sum up all points of current user
     * show in profile page
     * @returns
     */
    async function getSummedPoints(): Promise<number> {
        let summedPoints: number = 0;
        const pointsArray = (await SupabaseService.getCurrentPoints())?.points?.points;
        if (pointsArray !== null && pointsArray !== undefined) {
            pointsArray.map((item: any) => {
                summedPoints += item.value;
            });
        } else {
            summedPoints = 0;
        }
        return summedPoints;
    }

    useEffect(() => {
        const fetchData = async () => {
            setUser(await Session.getCurrentUser());
            if (userStore.userPoints === 0) {
                getSummedPoints().then((points: any) => {
                    dispatch(setUserPoints(points));
                });
            }
            await fetchEventsCount();
        }
        fetchData();
        checkUserImage()
    }, []);

    return (
        <main className="text-center mx-auto text-gray-700 mb-20">
            <Header text={"Profil"}/>

            {
                userStore.isLoggedIn ?
                    user ?
                        <div>
                            <div
                                className="userImage mx-auto w-20 h-20 mt-4 cursor-pointer border-secondary border-2 hover:opacity-80"
                                style={{backgroundImage: `url(${avatar})`}}
                                onClick={openDialog}
                            />

                            <div
                                id="image-upload-dialog"
                                className="relative z-10 hidden"
                                aria-labelledby="modal-title"
                                role="dialog"
                                aria-modal="true"
                            >
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                                <div className="fixed inset-0 z-10 overflow-y-auto">
                                    <div
                                        className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                        <div
                                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                                <div className="sm:flex sm:items-start">
                                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                        <h3
                                                            className="text-base font-semibold leading-6 text-gray-900"
                                                            id="modal-title"
                                                        >
                                                            <p className="text-left">Profilbild ändern</p>
                                                        </h3>
                                                        <br/>
                                                        <div className="m-2 w-full">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                id="file-input"
                                                                onChange={(e) => handleUpload(e)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                <Button
                                                    text="Abbrechen"
                                                    type="secondary"
                                                    onClick={closeDialog}
                                                    outline="true"
                                                    rounded="true"
                                                    width="w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <br/>

                            <div
                                className="card card-compact shadow-xl mx-auto max-w-sm opacity-90 gradient-lightblue text-white">
                                <div className="card-body">
                                    <h2 className="card-title mx-auto">Persönliche Daten</h2>
                                    <p className="py-1">Name: {user?.name}</p>
                                    <p className="py-1">Email: {user?.email}</p>
                                </div>
                            </div>

                            <br/>


                            <div
                                className="card card-compact shadow-xl mx-auto max-w-sm gradient-orange text-white">
                                <div className="card-body">
                                    {
                                        userStore.userPoints >= 0 ?
                                            <h2 className="card-title mx-auto">
                                                <NumberAnimation targetValue={userStore.userPoints}/>
                                            </h2>
                                            : <LoadingSpinner/>
                                    }
                                    <p className="py-1">Punkte gesamt</p>
                                </div>
                            </div>

                            <br/>

                            <div
                                className="card card-compact shadow-xl mx-auto max-w-sm gradient-purple text-white">
                                <div className="card-body">
                                    {
                                        finishedEvents ?
                                            <h2 className="card-title mx-auto">
                                                <NumberAnimation targetValue={finishedEvents}/>
                                            </h2>
                                            : <LoadingSpinner/>
                                    }
                                    <p className="py-1">Absolvierte Trainingseinheiten</p>
                                </div>
                            </div>

                            <br/>

                            <div className="card card-compact shadow-xl mx-auto max-w-sm gradient-green text-white">
                                <h2 className="card-title mx-auto py-4">Besuchte Hallen</h2>
                                <ChartVisitedGyms/>
                            </div>
                        </div>
                        : <LoadingSpinner/>
                    :
                    <NotLoggedIn/>
            }

            <Footer/>
        </main>
    )
}
