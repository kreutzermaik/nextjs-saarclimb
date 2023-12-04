"use client";

import {Button} from "../ui/Button";
import Toast from "@/app/shared/components/ui/Toast";
import {useEffect, useRef, useState} from "react";
import {Gym} from "../../types/Gym";
import {Progress} from "../../types/Progress";
import SupabaseService from "../../api/supabase-service";
import {ProgressItem} from "../../types/ProgressItem";
import {Chip} from "../ui/Chip";
import {setCurrentGym} from "@/app/userSlicer";
import {useDispatch, useSelector} from "react-redux";
import {Subscription} from "@supabase/supabase-js";
import NotLoggedIn from "../ui/NotLoggedIn";

export default function ProgressCard() {

    const subscriptionRef = useRef<Subscription | null>(null);

    const dispatch = useDispatch();
    const userStore = useSelector((state: any) => state.user);

    const [gyms, setGyms] = useState<Gym[]>([]);
    const [usersGym, setUsersGym] = useState<any>();
    const [selectedGym, setSelectedGym] = useState<any>("");
    const [progress, setProgress] = useState<Progress[]>([]);

    /**
     * fetch gym for current user
     * @returns
     */
    async function fetchUsersCurrentGym() {
        try {
            let result = (await SupabaseService.getCurrentGym()).gym;
            setUsersGym(result);
            return result;
        } catch (err: any) {
            console.log(err);
        }
    }

    /**
     * fetch all gyms
     * @returns
     */
    async function fetchGyms() {
        try {
            let result = (await SupabaseService.getGyms()).gym;
            const gyms = result?.map((item: { [x: string]: any }) => {
                const {id, name, grades} = item;
                return {id, name, grades} as Gym;
            });
            if (gyms) setGyms(gyms);
            return gyms;
        } catch (err: any) {
            console.log(err);
        }
    }

    /**
     * fetch progress object
     * @returns
     */
    async function fetchProgress(gymId: number) {
        try {
            let result = (await SupabaseService.getProgress(gymId)).progress;
            setProgress(result as Progress[]);
            return progress;
        } catch (err: any) {
            console.log(err);
        }
    }

    /**
     * update gym name in the select field
     * update different values that are affected by the gym change
     * @param gym
     */
    async function changeGym(gym: string) {
        setSelectedGym(gym);
        const {id, logo, grades} = (await SupabaseService.getGymByName(gym)).gym;
        if (usersGym !== undefined && usersGym.gym === null)
            await SupabaseService.updateUserGym(id);
        dispatch(setCurrentGym({id: id, name: gym, logo: logo, grades: grades}));
        await fetchProgress(id);
    }

    /**
     * push new entry for progress table
     * @param grades
     */
    async function initProgressDataForGym(grades: ProgressItem[]) {
        let array: any[] = [];
        grades.map((item: ProgressItem) => {
            array.push({grade: item, value: 0});
        });
        await SupabaseService.insertProgress(array, userStore.currentGym.id);
        const p = await fetchProgress(userStore.currentGym.id);
        if (p) setProgress(p);
        new Toast().push({content: Toast.GYM_VALUES_ADDED_MESSAGE, style: 'success', duration: 3000});
        if (p) setProgress(p);
    }

    /**
     * update progress value
     * @param event
     * @param grade
     */
    async function updateProgress(value: number, grade: string, currentItem: ProgressItem) {
        progress.map((item: Progress) => {
            if (item.gymid === userStore.currentGym.id) {
                // @ts-ignore
                item.progress.find((item: any) => item.grade === grade).value = value;
            }
        });

        await SupabaseService.updateProgress(
            // @ts-ignore
            progress.find((item: Progress) => item.gymid === userStore.currentGym.id)
                .progress, userStore.currentGym.id
        );

        let currentUserPointsArray = await SupabaseService.getCurrentPoints();
        // @ts-ignore
        currentUserPointsArray.points.points.map((item: any) => {
            if (userStore.currentGym) {
                if (Number(item.gymId) === userStore.currentGym.id) {
                    item.value = calculatePoints();
                }
            }
        });

        await SupabaseService.updateUserPoints(currentUserPointsArray?.points?.points);
    }

    /**
     * calculate points for current user
     * every grade has a multiplier that is increased by 2 for every grade
     * @returns
     */
    function calculatePoints(): number {
        let points = 0;
        progress.map((item: Progress) => {
            let multiplier = 2;
            item.progress.map((item: any, i: number) => {
                if (i > 0) {
                    multiplier += 2;
                }
                points += multiplier * item.value;
            });
        });
        return points;
    }

    /**
     * increment input value by 1 and update progress
     * @param item
     */
    function incrementValue(item: ProgressItem) {
        const newValue = Number(item.value) + 1;
        let inputElement: any = document.getElementById(`input-${item.grade}`);
        inputElement.value = newValue;
        updateProgress(newValue, item.grade, item);
    }

    /**
     * decrement input value by 1 and update progress
     * @param item
     */
    function decrementValue(item: ProgressItem) {
        const newValue = Number(item.value) - 1;
        let inputElement: any = document.getElementById(`input-${item.grade}`);
        if (newValue >= 0) {
            inputElement.value = newValue;
            updateProgress(newValue, item.grade, item);
        }
    }

    /**
     * return grade value by grade name
     * @param grade
     */
    function getGymGradeValueByName(grade: string): any {
        return userStore.currentGym.grades?.find((item: any) => item.grade === grade)?.value;
    }

    /**
     * on subscription insert
     * @param payload
     */
    function onInsert(payload: any) {
        setProgress((prev: any) => [...prev, payload.new]);
    }

    /**
     * on subscription update
     */
    async function onUpdate() {
        await fetchProgress(userStore.currentGym.id);
    }

    /**
     * on subscription delete
     * @param payload
     */
    function onDelete(payload: any) {
        setProgress((prev: any) =>
            prev.filter((item: any) => item.id != payload.old.id)
        );
    }

    useEffect(() => {
        subscriptionRef.current = SupabaseService.subscribeToTable(
            "progress",
            "progress-channel",
            onInsert,
            onUpdate,
            onDelete
        );

        return () => {
            // Cleanup subscription when component unmounts
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            await fetchGyms();

            let currentGymId: number = 0;
            let currentGymName: string = "";

            if (userStore.currentGym && userStore.currentGym.name) {
                currentGymId = userStore.currentGym.id;
                currentGymName = userStore.currentGym.name;
            } else {
                currentGymId = (await fetchUsersCurrentGym())?.gym;
                if (currentGymId) {
                    currentGymName = (await SupabaseService.getGymNameById(currentGymId))?.gym?.name;
                }
            }

            const {id, name, logo, grades} = (
                await SupabaseService.getGymByName(currentGymName)
            ).gym;

            dispatch(setCurrentGym({id: id, name: name, logo: logo, grades: grades}));
            await fetchProgress(currentGymId);
        }
        fetchData();
    }, []);

    return (
        userStore.isLoggedIn ?
            <div className="card card-compact shadow-xl bg-white text-left mb-20">
                <div className="card-body">
                    <h2 className="card-title">Boulderhalle auswählen</h2>
                    <label
                        htmlFor={"gyms"}
                        className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
                    >
                        Aktuelle Halle
                    </label>
                    <select
                        id="gyms"
                        onChange={(e: any) => {
                            changeGym(e.target.value);
                        }}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option selected>
                            {userStore.currentGym ? userStore.currentGym.name : "Bitte auswählen..."}
                        </option>
                        {gyms
                            ? gyms.map((gym: Gym) => {
                                if (userStore.currentGym && gym.name !== userStore.currentGym.name)
                                    return <option value={gym.name}>{gym.name}</option>
                            })
                            : ''}
                    </select>

                    <br/>

                    {
                        progress.length > 0 ?
                            <table className="table table-zebra w-full shadow-md">
                                <thead>
                                <tr>
                                    <th className="text-sm normal-case">Erledigte Boulder</th>
                                    <th className="text-sm normal-case">Schwierigkeitsgrad</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    progress.map((item: any) => {
                                        return (
                                            item.progress.map((item: ProgressItem) => {
                                                return (
                                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                        <td className="px-3 py-2 w-2/12">
                                                        <span className="minus-button">
                                                            <Button
                                                                text="-"
                                                                type="secondary"
                                                                opacity="opacity-80"
                                                                textSize="text-lg"
                                                                paddingX="px-3.5"
                                                                onClick={() => {
                                                                    decrementValue(item);
                                                                }}
                                                                disabled={item.value <= 0}
                                                            />
                                                        </span>
                                                            <input
                                                                type="number"
                                                                name="number"
                                                                id={`input-${item.grade}`}
                                                                min={0}
                                                                onChange={(e: any) =>
                                                                    updateProgress(e.target.value, item.grade, item)
                                                                }
                                                                value={item.value}
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 mr-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-14 lg:w-44"
                                                            />
                                                            <span className="plus-button">
                                                          <Button
                                                              text="+"
                                                              type="secondary"
                                                              opacity="opacity-80"
                                                              textSize="text-lg"
                                                              paddingX="px-3.5"
                                                              onClick={() => {
                                                                  incrementValue(item);
                                                              }}
                                                          />
                                                        </span>
                                                        </td>
                                                        <td className="px-3 py-2 w-9/12">
                                                            <div className="flex gap-5">
                                                                <Chip
                                                                    //@ts-ignore
                                                                    text={getGymGradeValueByName(item.grade.grade)}
                                                                    //@ts-ignore
                                                                    color={item.grade.grade}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                            : <Button
                                text="Starte mit dieser Boulderhalle!"
                                type="secondary"
                                onClick={() => initProgressDataForGym(userStore.currentGym.grades)}
                            />
                    }
                </div>
            </div>
            : <NotLoggedIn/>
    );
}
