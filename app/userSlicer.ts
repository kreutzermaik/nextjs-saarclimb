import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn: false,
    userImage: ""
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
        }
    },
})

// Action creators are generated for each case reducer function
export const { login, logout, setUserImage } = userSlice.actions

export default userSlice.reducer