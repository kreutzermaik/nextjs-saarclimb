import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlicer'

export const store = configureStore({
    reducer: {
        counter: counterReducer
    }
})