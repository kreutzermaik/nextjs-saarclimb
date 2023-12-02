import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlicer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage,
}

const persistedUserReducer = persistReducer(persistConfig, userReducer)

export const store = configureStore({
    reducer: {
        user: persistedUserReducer,
    }
})

export const persistor = typeof window !== 'undefined' ? persistStore(store) : null
