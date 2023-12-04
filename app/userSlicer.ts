import { createSlice } from '@reduxjs/toolkit'
import SupabaseService from './shared/api/supabase-service';

const initialState = {
    isLoggedIn: false,
    userImage: "",
    userPoints: calculateSummedPoints(),
}

async function calculateSummedPoints(): Promise<number> {
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

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state) => {
            state.isLoggedIn = true
        },
        logout: (state) => {
            state.isLoggedIn = false
        },
        setUserImage: (state, action) => {
            state.userImage = action.payload
        },
        setUserPoints: (state, action) => {
            state.userPoints = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    login,
    logout,
    setUserImage ,
    setUserPoints,
} = userSlice.actions

export default userSlice.reducer