import {useEffect, useState, useRef} from "react";
import * as FullCalendar from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import InteractionPlugin from "@fullcalendar/interaction";
import SupabaseService from "@/app/shared/api/supabase-service";
import {Event} from "@/app/shared/types/Event";
import {Subscription} from "@supabase/supabase-js";
import dynamic from "next/dynamic";
const LoadingSpinner = dynamic(() => import('@/app/shared/components/ui/LoadingSpinner'), {ssr: false});
const AddEventDialog = dynamic(() => import('@/app/shared/components/features/AddEventDialog'), {ssr: false});

export default function Calendar() {

    const calendarRef = useRef<any>(null);
    const subscriptionRef = useRef<Subscription | null>(null);

    const [events, setEvents] = useState<Event[]>();
    const [selectedDate, setSelectedDate] = useState();

    /**
     * create fullcalendar with config
     */
    function createCalendar() {
        if (calendarRef.current) {
            const calendar = new FullCalendar.Calendar(calendarRef.current, {
                plugins: [dayGridPlugin, InteractionPlugin],
                initialView: "dayGridMonth",
                events: events,
                firstDay: 1,
                locale: "de",
                dateClick: handleDateClick,
            });
            calendar.render();
        }
    }

    /**
     * fetch all events for current user
     * @returns
     */
    async function fetchEvents(): Promise<any[] | undefined> {
        try {
            let result = (await SupabaseService.getEvents()).events;
            return parseAndSetEvents(result);
        } catch (err: any) {
            console.log(err);
        }
    }

    /**
     * parse events from supabase to calendar events
     * @param eventList
     * @returns
     */
    function parseAndSetEvents(eventList: any) {
        let eventArray: any[] = [];
        eventList.map((item: any) => {
            eventArray.push({title: item.title, date: item.date});
        });
        return eventArray;
    }

    /**
     * set selected date on date click
     * @param event
     */
    function handleDateClick(event: any) {
        setSelectedDate(event.dateStr);
        openDialog();
    }

    /**
     * open dialog for adding a new event
     */
    function openDialog() {
        document.getElementById("event-dialog")?.classList.remove("hidden");
    }

    /**
     * on subscription insert
     * @param payload
     */
    function onInsert(payload: any) {
        setEvents((prev: any) => [...prev, payload.new]);
        if (events) createCalendar();
    }

    /**
     * on subscription update
     */
    async function onUpdate() {
        setEvents(await fetchEvents());
    }

    /**
     * on subscription delete
     * @param payload
     */
    function onDelete(payload: any) {
        setEvents((prev: any) =>
            prev.filter((item: any) => item.id != payload.old.id)
        );
        if (events) createCalendar();
    }

    useEffect(() => {
        fetchEvents().then((result) => {
            setEvents(result);
        });
    }, []);

    useEffect(() => {
        createCalendar();
    }, [events]);

    useEffect(() => {
        subscriptionRef.current = SupabaseService.subscribeToTable(
            "events",
            "event-channel",
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

    return (
        <main className="text-gray-700">
            {
                events
                    ? (
                        <div
                            className="max-sm:h-screen"
                            style={{maxHeight: `50vh`}}
                            ref={calendarRef}
                        ></div>
                    )
                    : (
                        <LoadingSpinner/>
                    )

            }
             <AddEventDialog date={selectedDate} />
        </main>
    )
}