import SupabaseService from "../../api/supabase-service";
import {Plan} from "../../types/Plan";
import Toast from "../ui/Toast";
import Cache from "../../../cache";
import {LoadingSpinner} from "../ui/LoadingSpinner";
import {InfoIcon} from "../ui/icons/InfoIcon";
import {TrashIcon} from "../ui/icons/TrashIcon";
import {Button} from "../ui/Button";
import {Subscription} from "@supabase/supabase-js";
import {useEffect, useRef, useState} from "react";
import NoSSR from 'react-no-ssr';

export default function Planer() {
    const subscriptionRef = useRef<Subscription | null>(null);

    const [plan, setPlan] = useState<Plan[]>([]);

    /**
     * fetch data from SupabaseService
     * @returns
     */
    async function fetchPlan() {
        try {
            let result = (await SupabaseService.getPlan()).planer.plan;
            return result;
        } catch (err: any) {
            console.log(err);
        }
    }

    /**
     * save input changes
     * @param element
     * @param day
     */
    function setInputValue(e: React.ChangeEvent<HTMLInputElement>, day: Plan) {
        const checkbox = document.querySelector(".".concat(day.day, "-checkbox")) as HTMLInputElement;
        // set value
        day.value = e.target.value;
        // update ui elements
        if (e.target.value === "") {
            e.target.classList.remove("border-primary");
            e.target.classList.add("placeholder-gray-500");
            e.target.classList.add("bg-neutral");
            checkbox.checked = false;
        } else {
            e.target.classList.remove("bg-neutral");
            e.target.classList.add("border-primary");
        }
        const newPlan = plan.map((item) =>
            item.day === day.day ? {...item, value: e.target.value} : item
        );
        setPlan(newPlan);
    }

    /**
     * update plan in supabase
     */
    function updatePlan() {
        try {
            SupabaseService.updatePlan(plan);
            new Toast().push({content: Toast.PLAN_UPDATED_MESSAGE, style: 'success', duration: 3000});
        } catch (err: any) {
            new Toast().push({title: Toast.PLAN_UPDATED_ERROR_MESSAGE, style: 'error', duration: 5000});
        }
    }

    /**
     * resetPlan in UI
     */
    function resetPlan() {
        plan?.map((day: any) => {
            day.value = "";
            day.checked = false;
        });
        setPlan(
            plan?.map(({day, value, checked}) => ({day, value, checked}))
        );
        updatePlan();
    }

    /**
     * reset single day in UI
     * @param day
     */
    function resetDay(day: Plan) {
        day.value = "";
        day.checked = false;
        setPlan(
            plan?.map(({day, value, checked}) => ({day, value, checked}))
        );
    }

    /**
     * on subscription insert
     * @param payload
     */
    function onInsert(payload: any) {
        setPlan((prev: any) => [...prev, payload.new]);
    }

    /**
     * on subscription update
     */
    async function onUpdate() {
        setPlan(await fetchPlan());
        Cache.setCacheItem("plan", plan);
    }

    /**
     * on subscription delete
     * @param payload
     */
    function onDelete(payload: any) {
        setPlan((prev: any) =>
            prev.filter((item: any) => item.day != payload.old.day)
        );
    }

    useEffect(() => {
        const fetchData = async () => {
            const planCache: any = Cache.getCacheItem("plan");
            if (planCache) {
                setPlan(JSON.parse(planCache));
            } else {
                const returnedValue = await fetchPlan();
                if (returnedValue) {
                    setPlan(returnedValue);
                    Cache.setCacheItem("plan", returnedValue);
                }
            }
        };
        fetchData();
    }, []);


    useEffect(() => {
        subscriptionRef.current = SupabaseService.subscribeToTable(
            "planer",
            "planer-channel",
            onInsert,
            onUpdate,
            onDelete
        );

        return () => {
            // Cleanup subscription when component unmounts
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }
            Cache.removeCacheItem("plan");
        };
    }, []);

    return (
        <main className="text-center text-gray-700">
            {
                plan ?
                    <div className="mb-6">
                        <h2 className="card-title float-left">Plane deine Trainingseinheiten</h2>
                        <div
                            className="tooltip tooltip-left tooltip-primary float-right mb-4 z-50"
                            data-tip="Hier kannst du für die ganze Woche deine geplanten
                  Bouldereinheiten sowie Workouts planen. Gib dazu einfach eine Einheit in ein Textfeld ein und klick auf Speichern.
                  Durch das Reset-Symbol setzt du den Wert für ein Eingabefeld zurück.
                  Über Zurücksetzen werden alle eingegebenen Werte geleert."
                        >
                            <NoSSR><InfoIcon/></NoSSR>
                        </div>

                        <table className="table table-zebra w-full shadow-md">
                            <thead>
                            <tr>
                                <th>Tag</th>
                                <th>Geplante Einheit</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                plan && plan.map((day: any) => {
                                    return (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-3 py-2">
                                                <strong>{day.day.slice(0, 2)}</strong>
                                            </td>
                                            <td className="px-3 py-2 w-10/12">
                                                <div className="flex items-center justify-start gap-3">
                                                    <input
                                                        value={day.value}
                                                        onChange={(e) =>
                                                            setInputValue(e, day)
                                                        }
                                                        type="text"
                                                        id={day.day}
                                                        className={`${
                                                            day.value !== ""
                                                                ? "border-primary"
                                                                : "bg-neutral text-black placeholder-gray-500"
                                                        } border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-w-7xl`}
                                                        placeholder="Nichts geplant"
                                                        required
                                                    />
                                                    {day.value !== "" ? (
                                                        <button onClick={() => resetDay(day)}>
                                                            <TrashIcon/>
                                                        </button>
                                                    ) : (
                                                        <div className="w-6"></div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                    : <NoSSR><LoadingSpinner/></NoSSR>
            }

            <NoSSR><Button
                text="Speichern"
                type="secondary"
                onClick={updatePlan}
                width="w-full"
            /></NoSSR>
            <NoSSR><Button
                text="Zurücksetzen"
                type="secondary"
                onClick={resetPlan}
                outline="true"
                width="w-full"
            /></NoSSR>
        </main>
    );
}
