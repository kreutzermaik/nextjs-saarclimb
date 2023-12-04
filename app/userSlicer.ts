"use client";

import {createSlice} from '@reduxjs/toolkit'
import {Gym} from './shared/types/Gym';

const initialState = {
    isLoggedIn: false,
    userImage: "",
    userPoints: 0,
    currentGym: {} as Gym,
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
        setCurrentGym: (state, action) => {
            state.currentGym = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    login,
    logout,
    setUserImage,
    setUserPoints,
    setCurrentGym
} = userSlice.actions

export default userSlice.reducer