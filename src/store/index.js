import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slices/slice"
export const store = configureStore({
    reducer:{
        auth:authReducer,
    },
})