import {Button} from "@/app/shared/components/ui/Button";
import SupabaseService from "@/app/shared/api/supabase-service";
import Session from "@/app/session";
import {Event} from "@/app/shared/types/Event";
import {Gym} from "@/app/shared/types/Gym";
import Toast from "@/app/shared/components/ui/Toast";
import {useEffect, useState} from "react";

type AddEventDialogProps = {
    date: any;
};

export default function AddEventDialog(props: AddEventDialogProps) {

    const [date, setDate] = useState("");
    const [event, setEvent] = useState("");
    const [location, setLocation] = useState("");
    const [gyms, setGyms] = useState<Gym[] | undefined>([]);

    async function fetchGyms() {
        try {
            let result = (await SupabaseService.getGyms()).gym;
            const gyms = result?.map((item: { [x: string]: any }) => {
                const {id, name, grades} = item;
                return {id, name, grades} as Gym;
            });
            setGyms(gyms);
            return gyms;
        } catch (err: any) {
            console.log(err);
        }
    }

    /**
     * add new event to supabase and close dialog
     */
    async function addEvent() {
        try {
            if (!event) return;
            let newEvent: Event = {
                title: event,
                date: date !== "" ? date : props.date,
                userid: await Session.getCurrentUserId(),
                location: location,
            };
            await SupabaseService.addEvent(newEvent);
            closeDialog();
            new Toast().push({content: Toast.EVENT_ADDED_MESSAGE, style: 'success', duration: 3000});
        } catch (err: any) {
            new Toast().push({content: Toast.EVENT_ADDED_ERROR_MESSAGE, style: 'error'});
        }
    }

    /**
     * hide dialog
     */
    function closeDialog() {
        document.getElementById("event-dialog")?.classList.add("hidden");
    }

    useEffect(() => {
        fetchGyms().then();
    }, []);


    return (
        <div
            id="event-dialog"
            className="relative z-10 hidden"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h3
                                        className="text-base font-semibold leading-6 text-gray-900"
                                        id="modal-title"
                                    >
                                        Training hinzufügen
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Füge hier eine Trainingseinheit hinzu. Dazu musst du alle
                                            Felder ausfüllen und auf Speichern klicken. Die Einheit
                                            wird anschließend in der Kalenderübersicht angezeigt.
                                        </p>
                                        <div className="m-2 w-full">
                                            <div className="m-2">
                                                <label
                                                    htmlFor="date"
                                                    className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
                                                >
                                                    Datum
                                                </label>
                                                <input
                                                    name="date"
                                                    datepicker-autohide
                                                    type="text"
                                                    onChange={(e: any) => {
                                                        setDate(e.target.value);
                                                    }}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    placeholder="2023-05-31"
                                                    value={props.date}
                                                />
                                            </div>
                                            <div className="m-2">
                                                <label
                                                    htmlFor="event"
                                                    className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
                                                >
                                                    Trainingseinheit
                                                </label>
                                                <input
                                                    type="text"
                                                    name="event"
                                                    onChange={(e: any) => {
                                                        setEvent(e.target.value);
                                                    }}
                                                    id="email"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    placeholder="Bouldern"
                                                />
                                            </div>
                                            <div className="m-2">
                                                <label
                                                    htmlFor="gyms"
                                                    className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
                                                >
                                                    Ort
                                                </label>
                                                <select
                                                    id="gyms"
                                                    onChange={(e: any) => {
                                                        setLocation(e.target.value);
                                                    }}
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                >
                                                    <option selected>Bitte auswählen...</option>
                                                    {
                                                        gyms
                                                            ? (
                                                                gyms.map((gym) => {
                                                                    return (
                                                                        <option value={gym.name}
                                                                                key={gym.name}>{gym.name}</option>
                                                                    );
                                                                })
                                                            )
                                                            : (
                                                                <option value="Keine Gyms gefunden">Keine Gyms
                                                                    gefunden</option>
                                                            )
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <Button
                                text="Speichern"
                                type="secondary"
                                onClick={addEvent}
                                rounded="true"
                                width="w-full"
                                disabled={!event || !props.date}
                            />
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
    )
}