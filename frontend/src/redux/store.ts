import { configureStore } from "@reduxjs/toolkit";
import { buttonReducer } from "./buttonsSlice";


export const store = configureStore({
    reducer : {
        buttonReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch