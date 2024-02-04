import SupabaseService from "../../api/supabase-service";
import {Subscription} from "@supabase/supabase-js";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Gym} from "../../types/Gym";
import {User} from "../../types/User";
import {Point} from "../../types/Point";
import {setCurrentGym} from "@/app/userSlicer";
import {TrophyIcon} from "../ui/icons/TrophyIcon";
import {LoadingSpinner} from "../ui/LoadingSpinner";

export default function LeaderBoard() {

    const subscriptionRef = useRef<Subscription | null>(null);

    const dispatch = useDispatch();
    const userStore = useSelector((state: any) => state.user);

    const [users, setUsers] = useState<User[]>([]);
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [usersGym, setUsersGym] = useState<any>();
    const [selectedGym, setSelectedGym] = useState<any>("");

    /**
     * fetch all users
     */
    async function fetchAllUsers() {
        const {users, error} = await SupabaseService.getAllUsers();
        if (error) {
            console.log(error);
        } else {
            setUsers(users as User[]);
        }
    }

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
     * sorted users by points
     * @returns {User[]}
     */
    function getSortedUsers() {
        let currentGymObj: Gym;
        if (userStore.currentGym) {
            currentGymObj = userStore.currentGym;
        } else {
            currentGymObj = userStore.currentGym;
        }

        const usersWithPoints = users.filter(
            (user: User) => user.points !== null
        );

        if (userStore.currentGym) {
            const filteredUsers = usersWithPoints.map((user: User) => {
                let points: Point[];

                if (user.points) {
                    points = user.points.filter(
                        (point: Point) => Number(point.gymId) === currentGymObj.id
                    );
                } else {
                    points = [];
                }

                return {
                    uid: user.uid,
                    name: user.name,
                    avatar_url: user.avatar_url,
                    points: points[0] != undefined ? points[0].value : 0,
                    boardId: 0,
                };
            });

            const sortedUsers = filteredUsers.sort((a: any, b: any) => {
                return b.points - a.points;
            });

            // Set the boardId of each user to be the same if the points are the same
            for (let i = 0; i < sortedUsers.length; i++) {
                if (sortedUsers[i].points == sortedUsers[i - 1]?.points) {
                    sortedUsers[i].boardId = sortedUsers[i - 1].boardId;
                } else {
                    sortedUsers[i].boardId = i + 1;
                }
            }

            return sortedUsers;
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
        await fetchAllUsers();
    }

    /**
     * on subscription insert
     * @param payload
     */
    function onInsert(payload: any) {
        setUsers((prev: any) => [...prev, payload.new]);
    }

    /**
     * on subscription update
     */
    async function onUpdate() {
        await fetchAllUsers();
    }

    /**
     * on subscription delete
     * @param payload
     */
    function onDelete(payload: any) {
        setUsers((prev) => prev.filter((item) => item.uid != payload.old.uid));
    }

    useEffect(() => {
        subscriptionRef.current = SupabaseService.subscribeToTable(
            "users",
            "users-channel",
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
            await fetchAllUsers();
            await fetchGyms();

            if (userStore.isLoggedIn) {
                let currentGymId: number = 0;
                let currentGymName: string = "";

                if (userStore.currentGym && Object.keys(userStore.currentGym).length > 0) {
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

                setCurrentGym({id: id, name: name, logo: logo, grades: grades});
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            <select
                id="gyms"
                defaultValue={'DEFAULT'}
                onChange={(e: any) => {
                    changeGym(e.target.value);
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
                <option value="DEFAULT" key={userStore.currentGym}>
                    {Object.keys(userStore.currentGym).length > 0 ? userStore.currentGym.name : "Bitte auswählen..."}
                </option>
                {gyms
                    ? gyms.map((gym: Gym) => {
                        if (userStore.currentGym && gym.name !== userStore.currentGym.name)
                            return <option value={gym.name} key={gym.name}>{gym.name}</option>
                    })
                    : ''}
            </select>

            {users ? (
                <div className="p-2">
                    <table className="table table-zebra w-full shadow-md board-table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Benutzer</th>
                            <th>Punkte</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            getSortedUsers()?.map((user, i) => {
                                return (
                                    <tr key={user.boardId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-3 py-2 w-1/12">
                                            {i === 0 ? (
                                                <TrophyIcon color="text-custom-gold"/>
                                            ) : i === 1 ? (
                                                <TrophyIcon color="text-custom-silver"/>
                                            ) : i === 2 ? (
                                                <TrophyIcon color="text-custom-bronze"/>
                                            ) : (
                                                user.boardId
                                            )}
                                        </td>
                                        <td className="px-3 py-2 w-10/12">
                                            <div className="flex gap-5">
                                                <div
                                                    className="userImage w-10 h-10"
                                                    style={{backgroundImage: `url(${user.avatar_url})`}}
                                                />
                                                <strong>{user.name}</strong>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 w-1/12">{user.points}</td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            ) : (
                <LoadingSpinner/>
            )}
        </div>
    )
}